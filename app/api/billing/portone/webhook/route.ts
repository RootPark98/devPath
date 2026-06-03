import { apiErr, apiOk } from "@/lib/devpath/api.server";
import { prisma } from "@/lib/prisma";
import { Webhook, PortOneClient } from "@portone/server-sdk";

export const runtime = "nodejs";

function pickPaymentId(obj: any): string | null {
  return (
    obj?.paymentId ??
    obj?.payment_id ??
    obj?.data?.paymentId ??
    obj?.data?.payment_id ??
    obj?.merchantUid ??
    obj?.merchant_uid ??
    obj?.data?.merchantUid ??
    obj?.data?.merchant_uid ??
    null
  );
}

// 🔥 PortOne status → 우리 PaymentIntent.status 매핑
function mapStatus(portoneStatus: unknown) {
  const s = String(portoneStatus ?? "").toUpperCase();

  if (s === "PAID") return "PAID";
  if (s === "FAILED") return "FAILED";
  if (s === "CANCELLED") return "CANCELED";
  if (s === "PARTIAL_CANCELLED") return "REFUNDED";

  return "PENDING";
}

export async function POST(request: Request) {
  const secret = process.env.PORTONE_WEBHOOK_SECRET;
  const apiSecret = process.env.PORTONE_API_SECRET;

  if (!secret || !apiSecret) {
    return apiErr("INTERNAL_ERROR", "PORTONE 환경변수가 설정되지 않았습니다.", 500);
  }

  const payload = await request.text().catch(() => null);
  if (!payload) {
    return apiErr("BAD_REQUEST", "웹훅 body가 비어있습니다.", 400);
  }

  const webhookId = request.headers.get("webhook-id") ?? "";
  const webhookSignature = request.headers.get("webhook-signature") ?? "";
  const webhookTimestamp = request.headers.get("webhook-timestamp") ?? "";

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return apiErr("BAD_REQUEST", "웹훅 검증 헤더가 누락되었습니다.", 400);
  }

  let webhook: any;
  try {
    webhook = await Webhook.verify(secret, payload, {
      "webhook-id": webhookId,
      "webhook-signature": webhookSignature,
      "webhook-timestamp": webhookTimestamp,
    });
  } catch (e: any) {
    return apiErr("FORBIDDEN", "유효하지 않은 웹훅 서명입니다.", 403);
  }

  const paymentId = pickPaymentId(webhook);
  if (!paymentId) {
    return apiErr("BAD_REQUEST", "paymentId를 찾지 못했습니다.", 400);
  }

  // ✅ FIX 1: PortOne API 조회를 트랜잭션 밖에서 먼저 수행
  // 외부 HTTP 호출이 DB 커넥션을 점유하지 않도록 분리
  let payment: any;
  try {
    const client = PortOneClient({ secret: apiSecret });
    payment = await client.payment.getPayment({ paymentId });
  } catch (e: any) {
    return apiErr("INTERNAL_ERROR", "PortOne 결제 정보 조회에 실패했습니다.", 500);
  }

  if (!payment || typeof payment !== "object" || !("amount" in payment)) {
    return apiOk({ received: true, ignored: true }, 200);
  }

  const portoneStatus = payment.status;
  const mappedStatus = mapStatus(portoneStatus);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // ✅ FIX 2: 멱등 키(webhookEvent)를 트랜잭션 안에서 생성
      // 트랜잭션 실패 시 webhookEvent도 함께 롤백 → PortOne 재시도 정상 처리 가능
      try {
        await tx.webhookEvent.create({
          data: {
            provider: "portone",
            providerEventId: webhookId,
            paymentId,
            processedAt: new Date(),
          },
          select: { id: true },
        });
      } catch (e: any) {
        if (e?.code === "P2002") {
          return { duplicate: true as const };
        }
        throw e;
      }

      const intent = await tx.paymentIntent.findUnique({
        where: { merchantUid: paymentId },
        select: {
          id: true,
          userId: true,
          credits: true,
          status: true,
          amount: true,
        },
      });

      if (!intent) {
        throw Object.assign(new Error("NOT_FOUND"), { _code: "NOT_FOUND" as const });
      }

      // 금액 검증 (PAID일 때만 강제)
      if (mappedStatus === "PAID") {
        const paidAmount = payment.amount?.total;
        if (paidAmount !== intent.amount) {
          console.error("금액 불일치", {
            paymentId,
            portoneAmount: paidAmount,
            expected: intent.amount,
          });
          // 금액 불일치는 재시도해도 해결되지 않으므로 FAILED로 종결
          // → PENDING 고착 방지, 운영자가 상태로 이상 탐지 가능
          await tx.paymentIntent.update({
            where: { id: intent.id },
            data: { status: "FAILED" },
          });
          return { mismatch: true as const };
        }
      }

      // ===== PAID =====
      if (mappedStatus === "PAID") {
        if (intent.status === "PAID") {
          return { alreadyProcessed: true };
        }

        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: { status: "PAID" },
        });

        await tx.creditBalance.upsert({
          where: { userId: intent.userId },
          create: { userId: intent.userId, balance: intent.credits },
          update: { balance: { increment: intent.credits } },
        });

        await tx.creditLedger.create({
          data: {
            userId: intent.userId,
            delta: intent.credits,
            reason: "TOPUP",
            refType: "PaymentIntent",
            refId: intent.id,
          },
        });

        return { credited: intent.credits };
      }

      // ===== FAILED / CANCELED =====
      if (mappedStatus === "FAILED" || mappedStatus === "CANCELED") {
        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: { status: mappedStatus },
        });
        return { failed: true };
      }

      // ===== REFUNDED (부분취소 포함) =====
      if (mappedStatus === "REFUNDED") {
        // updateMany + WHERE status = PAID 로 PAID→REFUNDED 전환을 원자적으로 처리
        // count > 0 인 트랜잭션만 크레딧 차감 → 동시 웹훅 이중 차감 방지
        const { count } = await tx.paymentIntent.updateMany({
          where: { id: intent.id, status: "PAID" },
          data: { status: "REFUNDED" },
        });

        if (count > 0) {
          await tx.creditBalance.update({
            where: { userId: intent.userId },
            data: { balance: { decrement: intent.credits } },
          });

          await tx.creditLedger.create({
            data: {
              userId: intent.userId,
              delta: -intent.credits,
              reason: "REFUND",
              refType: "PaymentIntent",
              refId: intent.id,
            },
          });
        } else {
          // PAID가 아닌 상태(PENDING 등)에서 환불 도달 — 크레딧 차감 없이 상태만 변경
          await tx.paymentIntent.update({
            where: { id: intent.id },
            data: { status: "REFUNDED" },
          });
        }

        return { refunded: true };
      }

      return { ignored: true };
    });

    if (result.duplicate) {
      return apiOk({ received: true, duplicate: true }, 200);
    }

    return apiOk({ received: true, paymentId, ...result }, 200);
  } catch (e: any) {
    if (e?._code === "NOT_FOUND") {
      return apiErr("NOT_FOUND", "PaymentIntent를 찾지 못했습니다.", 404);
    }

    return apiErr("INTERNAL_ERROR", "서버 처리 중 오류", 500, {
      error: String(e?.message ?? e),
    });
  }
}