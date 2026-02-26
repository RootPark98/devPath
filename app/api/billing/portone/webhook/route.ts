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

  // ✅ 멱등 처리
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "portone",
        providerEventId: webhookId,
        paymentId,
      },
      select: { id: true },
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return apiOk({ received: true, duplicate: true }, 200);
    }
    return apiErr("INTERNAL_ERROR", "웹훅 이벤트 기록 실패", 500);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
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

      // 🔥 1) PortOne API로 진짜 상태 조회
      const client = PortOneClient({ secret: apiSecret });
      const payment = await client.payment.getPayment({ paymentId });

      if (!payment || typeof payment !== "object" || !("amount" in payment)) {
          return { ignored: true };
      }

      const portoneStatus = payment.status;
      const mappedStatus = mapStatus(portoneStatus);

      // 🔥 2) 금액 검증 (PAID일 때만 강제)
      if (mappedStatus === "PAID") {
        const paidAmount = payment.amount?.total;
        if (paidAmount !== intent.amount) {
          console.error("금액 불일치", {
            paymentId,
            portoneAmount: paidAmount,
            expected: intent.amount,
          });
          return { mismatch: true };
        }
      }

      // 🔥 3) 상태별 처리

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
        if (intent.status === "PAID") {
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
        }

        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: { status: "REFUNDED" },
        });

        return { refunded: true };
      }

      return { ignored: true };
    });

    prisma.webhookEvent
      .update({
        where: { providerEventId: webhookId },
        data: { processedAt: new Date() },
      })
      .catch(() => {});

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