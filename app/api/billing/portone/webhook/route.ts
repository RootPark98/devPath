import { apiErr, apiOk } from "@/lib/devpath/api.server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "@portone/server-sdk";

export const runtime = "nodejs";

function pickPaymentId(obj: any): string | null {
  // V2 payload에서 paymentId가 핵심 주문 고유번호
  return (
    obj?.paymentId ??
    obj?.payment_id ??
    obj?.data?.paymentId ??
    obj?.data?.payment_id ??
    // 혹시 다른 형태로 내려오는 경우 대비
    obj?.merchantUid ??
    obj?.merchant_uid ??
    obj?.data?.merchantUid ??
    obj?.data?.merchant_uid ??
    null
  );
}

function isPaidWebhook(webhook: any): boolean {
  const type = String(webhook?.type ?? "").toUpperCase();
  // 대표적으로 TRANSACTION.PAID 류를 성공으로 취급
  return type === "TRANSACTION.PAID" || type.endsWith(".PAID");
}

function isFailedWebhook(webhook: any): boolean {
  const type = String(webhook?.type ?? "").toUpperCase();
  return type.includes("FAILED") || type.includes("CANCEL");
}

export async function POST(request: Request) {
  const secret = process.env.PORTONE_WEBHOOK_SECRET;
  if (!secret) {
    return apiErr("INTERNAL_ERROR", "PORTONE_WEBHOOK_SECRET이 설정되지 않았습니다.", 500);
  }

  // ✅ 1) raw body를 먼저 읽어야 서명검증 가능
  const payload = await request.text().catch(() => null);
  if (!payload) {
    return apiErr("BAD_REQUEST", "웹훅 body가 비어있습니다.", 400);
  }

  // ✅ 2) PortOne 웹훅 검증 헤더
  const webhookId = request.headers.get("webhook-id") ?? "";
  const webhookSignature = request.headers.get("webhook-signature") ?? "";
  const webhookTimestamp = request.headers.get("webhook-timestamp") ?? "";

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return apiErr("BAD_REQUEST", "웹훅 검증 헤더가 누락되었습니다.", 400, {
      required: ["webhook-id", "webhook-signature", "webhook-timestamp"],
    });
  }

  // ✅ 3) signature verify
  let webhook: any;
  try {
    webhook = await Webhook.verify(secret, payload, {
      "webhook-id": webhookId,
      "webhook-signature": webhookSignature,
      "webhook-timestamp": webhookTimestamp,
    });
  } catch (e: any) {
    return apiErr("FORBIDDEN", "유효하지 않은 웹훅 서명입니다.", 403, {
      error: String(e?.message ?? e),
    });
  }

  // ✅ 4) paymentId로 통일 (prepare에서 만든 paymentId가 여기로 와야 함)
  const paymentId = pickPaymentId(webhook);
  if (!paymentId) {
    return apiErr("BAD_REQUEST", "paymentId를 찾지 못했습니다.", 400);
  }

  // ✅ 5) 중복 이벤트 방지: providerEventId = webhook-id
  try {
    await prisma.webhookEvent.create({
        data: {
            provider: "portone",
            providerEventId: webhookId,
            paymentId, // ✅ 추가
        },
        select: { id: true },
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      // 이미 처리된 이벤트면 200으로 종료(재전송 멈추게)
      return apiOk({ received: true, duplicate: true }, 200);
    }
    return apiErr("INTERNAL_ERROR", "웹훅 이벤트 기록 실패", 500, {
      error: String(e?.message ?? e),
    });
  }

  const paid = isPaidWebhook(webhook);
  const failed = isFailedWebhook(webhook);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const intent = await tx.paymentIntent.findUnique({
        // DB 컬럼 merchantUid에 paymentId가 저장돼 있음
        where: { merchantUid: paymentId },
        select: { id: true, userId: true, credits: true, status: true },
      });

      if (!intent) {
        throw Object.assign(new Error("NOT_FOUND"), { _code: "NOT_FOUND" as const });
      }

      // idempotent: 이미 PAID면 또 적립하지 않음
      if (paid) {
        if (intent.status === "PAID") return { alreadyProcessed: true };

        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: { status: "PAID" },
          select: { id: true },
        });

        await tx.creditBalance.upsert({
          where: { userId: intent.userId },
          create: { userId: intent.userId, balance: 0 },
          update: {},
        });

        await tx.creditLedger.create({
          data: {
            userId: intent.userId,
            delta: intent.credits,
            reason: "TOPUP",
            refType: "PaymentIntent",
            refId: intent.id,
          },
          select: { id: true },
        });

        await tx.creditBalance.update({
          where: { userId: intent.userId },
          data: { balance: { increment: intent.credits } },
          select: { userId: true },
        });

        return { credited: intent.credits };
      }

      if (failed) {
        await tx.paymentIntent.update({
          where: { id: intent.id },
          data: { status: "FAILED" },
          select: { id: true },
        });
        return { failed: true };
      }

      return { ignored: true };
    });

    // processedAt은 best-effort: 실패해도 웹훅은 200 유지
    prisma.webhookEvent
      .update({
        where: { providerEventId: webhookId },
        data: { processedAt: new Date() },
        select: { id: true },
      })
      .catch(() => {});

    return apiOk({ received: true, paymentId, ...result }, 200);
  } catch (e: any) {
    if (e?._code === "NOT_FOUND") {
      // 이 경우도 운영에서는 200으로 처리하는 팀이 많지만,
      // 우리는 지금 디버깅 단계이니 404로 두자(원하면 200으로 바꿔줌)
      return apiErr("NOT_FOUND", "PaymentIntent를 찾지 못했습니다.", 404);
    }

    return apiErr("INTERNAL_ERROR", "서버 처리 중 오류", 500, {
      error: String(e?.message ?? e),
    });
  }
}