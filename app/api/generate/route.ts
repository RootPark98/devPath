import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";

import type { GeneratedPlan } from "@/lib/devpath/types";
import { apiOk, apiErr } from "@/lib/devpath/api.server";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

import {
  isLanguage,
  isLevel,
  sanitizeFrameworks,
  type RequestBody,
} from "@/lib/devpath/server/input";
import { buildPrompt } from "@/lib/devpath/server/prompt";
import { callGeminiGenerateContent } from "@/lib/devpath/server/gemini";
import { safeParseGeminiJson } from "@/lib/devpath/server/parse";
import { coercePlan, validatePlan } from "@/lib/devpath/server/validate";

export type GeneratePlanResponse = {
  plan: GeneratedPlan;
  historyId: string;
};

function getGenerateCost() {
  const raw = Number(process.env.GENERATE_CREDIT_COST ?? 10);
  if (!Number.isFinite(raw) || raw <= 0) return 10;
  return Math.floor(raw);
}

async function refundCredits(params: {
  userId: string;
  cost: number;
  refId: string;
}) {
  const { userId, cost, refId } = params;

  await prisma.$transaction(async (tx) => {
    await tx.creditLedger.create({
      data: {
        userId,
        delta: cost,
        reason: "REFUND",
        refType: "GEN_REQ",
        refId,
      },
    });

    await tx.creditBalance.upsert({
      where: { userId },
      create: { userId, balance: cost },
      update: { balance: { increment: cost } },
    });
  });
}

export async function POST(request: Request) {
  const cost = getGenerateCost();
  const refId = randomUUID(); // 이번 생성 요청 추적용(환불/로그)

  // 환불해야 하는 상황인지 판단하기 위한 플래그
  let creditsReserved = false;
  let ledgerId: string | null = null;
  let sessionUserId: string | null = null;

  try {
    // ✅ 로그인 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
    }
    sessionUserId = session.user.id;

    const raw = await request.json();

    // ✅ 입력 검증
    if (!isLanguage(raw?.language) || !isLevel(raw?.level)) {
      return apiErr("INVALID_INPUT", "잘못된 입력값입니다.", 400);
    }

    const body: RequestBody = {
      language: raw.language,
      level: raw.level,
      frameworks: sanitizeFrameworks(raw.language, raw.frameworks),
    };

    // ✅ 크레딧 먼저 “예약(차감)”
    // - AI 호출 전에 차감해야 무료 생성이 안 생김
    const reserveResult = await prisma.$transaction(async (tx) => {
      const bal = await tx.creditBalance.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, balance: 0 },
        update: {},
        select: { balance: true },
      });

      if (bal.balance < cost) {
        return { ok: false as const, balance: bal.balance };
      }

      const ledger = await tx.creditLedger.create({
        data: {
          userId: session.user.id,
          delta: -cost,
          reason: "USE",
          refType: "GEN_REQ",
          refId, // 나중에 historyId로 업데이트 가능
        },
        select: { id: true },
      });

      await tx.creditBalance.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: cost } },
      });

      return { ok: true as const, ledgerId: ledger.id };
    });

    if (!reserveResult.ok) {
      return apiErr(
        "INSUFFICIENT_CREDITS",
        "크레딧이 부족합니다. 충전 후 다시 시도해주세요.",
        402,
        { cost, balance: reserveResult.balance }
      );
    }

    creditsReserved = true;
    ledgerId = reserveResult.ledgerId;

    // ✅ Gemini 호출
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // 예약했는데 서버 설정 문제면 환불
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;
      return apiErr("MISSING_API_KEY", "GEMINI_API_KEY가 설정되어 있지 않습니다.", 500);
    }

    const prompt = buildPrompt(body);

    let resp: Response;
    try {
      resp = await callGeminiGenerateContent({
        apiKey,
        prompt,
        temperature: 0.4,
        timeoutMs: 15000,
        maxRetries429: 2,
      });
    } catch (e: any) {
      // ✅ 네트워크/타임아웃 등 -> 환불
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;

      if (e?.code === "TIMEOUT" || e?.message === "TIMEOUT") {
        return apiErr("TIMEOUT", "AI 응답 시간이 초과되었습니다.\n다시 시도해주세요.", 504);
      }
      return apiErr(
        "UPSTREAM_ERROR",
        "외부 API 호출 중 네트워크 오류가 발생했습니다.",
        500,
        { error: String(e?.message ?? e) }
      );
    }

    if (resp.status === 429) {
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;
      return apiErr("RATE_LIMIT", "요청이 너무 많습니다.\n잠시 후 다시 시도해주세요.", 429);
    }

    if (!resp.ok) {
      const errText = await resp.text();
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;
      return apiErr("UPSTREAM_ERROR", "Gemini API 호출 실패", 500, { upstream: errText });
    }

    const json = await resp.json();
    const rawText: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText || typeof rawText !== "string") {
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;
      return apiErr("PARSE_ERROR", "Gemini 응답에서 JSON 텍스트를 찾지 못했습니다.", 500);
    }

    let parsed: unknown;
    try {
      parsed = safeParseGeminiJson(rawText);
    } catch (e: any) {
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;
      return apiErr("PARSE_ERROR", "Gemini JSON 파싱 실패", 500, {
        error: String(e?.message ?? e),
        rawText,
      });
    }

    const coerced = coercePlan(parsed);
    if (!validatePlan(coerced)) {
      await refundCredits({ userId: session.user.id, cost, refId });
      creditsReserved = false;
      return apiErr("SCHEMA_ERROR", "Gemini JSON 스키마 검증 실패", 500, {
        raw: parsed,
        rawText,
      });
    }

    // ✅ 결과 저장(history) + ledger ref를 historyId로 업데이트
    const saved = await prisma.history.create({
      data: {
        userId: session.user.id,
        input: body,
        output: coerced,
      },
      select: { id: true },
    });

    if (ledgerId) {
      // "이번 USE 차감이 어떤 history 생성에 쓰였는지" 연결
      await prisma.creditLedger.update({
        where: { id: ledgerId },
        data: { refType: "HISTORY", refId: saved.id },
      });
    }

    // ✅ 응답
    const payload: GeneratePlanResponse = { plan: coerced, historyId: saved.id };
    return apiOk(payload, 201);
  } catch (e: any) {
    // 혹시 여기까지 왔는데 예약만 되고 뭔가 터졌으면 환불(최후의 안전장치)
    try {
      if (creditsReserved && sessionUserId) {
        await refundCredits({ userId: sessionUserId, cost, refId });
      }
    } catch {
      // 환불 실패는 여기서 더 키우지 말고(운영에선 로그/알림)
    }

    return apiErr("INTERNAL_ERROR", "서버 처리 중 오류", 500, {
      error: String(e?.message ?? e),
    });
  }
}