import { getServerSession } from "next-auth";

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

export async function POST(request: Request) {
  try {
    // ✅ 로그인 확인 (서버 저장이 목적이므로 서버에서 보장)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
    }

    const raw = await request.json();

    // ✅ 서버에서도 입력 강제 (프론트만 믿지 않기)
    if (!isLanguage(raw?.language) || !isLevel(raw?.level)) {
      return apiErr("INVALID_INPUT", "잘못된 입력값입니다.", 400);
    }

    const body: RequestBody = {
      language: raw.language,
      level: raw.level,
      frameworks: sanitizeFrameworks(raw.language, raw.frameworks),
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
      if (e?.code === "TIMEOUT" || e?.message === "TIMEOUT") {
        return apiErr("TIMEOUT", "AI 응답 시간이 초과되었습니다. 다시 시도해주세요.", 504);
      }
      return apiErr("UPSTREAM_ERROR", "외부 API 호출 중 네트워크 오류가 발생했습니다.", 500, {
        error: String(e?.message ?? e),
      });
    }

    if (resp.status === 429) {
      return apiErr("RATE_LIMIT", "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", 429);
    }

    if (!resp.ok) {
      const errText = await resp.text();
      return apiErr("UPSTREAM_ERROR", "Gemini API 호출 실패", 500, { upstream: errText });
    }

    const json = await resp.json();
    const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText || typeof rawText !== "string") {
      return apiErr("PARSE_ERROR", "Gemini 응답에서 JSON 텍스트를 찾지 못했습니다.", 500);
    }

    let parsed: unknown;
    try {
      parsed = safeParseGeminiJson(rawText);
    } catch (e: any) {
      return apiErr("PARSE_ERROR", "Gemini JSON 파싱 실패", 500, {
        error: String(e?.message ?? e),
        rawText,
      });
    }

    const coerced = coercePlan(parsed);

    if (!validatePlan(coerced)) {
      return apiErr("SCHEMA_ERROR", "Gemini JSON 스키마 검증 실패", 500, {
        raw: parsed,
        rawText,
      });
    }

    // ✅ 여기서부터 "서버 저장"
    const saved = await prisma.history.create({
      data: {
        userId: session.user.id,
        input: body,        // { language, level, frameworks }
        output: coerced,    // GeneratedPlan JSON
      },
      select: { id: true },
    });

    // ✅ 응답: plan + historyId
    const payload: GeneratePlanResponse = { plan: coerced, historyId: saved.id };
    return apiOk(payload, 201);
  } catch (e: any) {
    return apiErr("INTERNAL_ERROR", "서버 처리 중 오류", 500, {
      error: String(e?.message ?? e),
    });
  }
}
