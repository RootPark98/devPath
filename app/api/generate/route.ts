import { NextResponse } from "next/server";

import type { ApiResponse, DevPathErrorCode } from "@/lib/devpath/api";
import type { GeneratedPlan } from "@/lib/devpath/types";

import { isLanguage, isLevel, sanitizeFrameworks, type RequestBody } from "../../../lib/devpath/server/input";
import { buildPrompt } from "../../../lib/devpath/server/prompt";
import { callGeminiGenerateContent } from "../../../lib/devpath/server/gemini";
import { safeParseGeminiJson } from "../../../lib/devpath/server/parse";
import { coercePlan, validatePlan } from "../../../lib/devpath/server/validate";

/**
 * route.ts의 역할은 딱 이것만:
 * 1) 입력 받기/검증
 * 2) 프롬프트 생성
 * 3) Gemini 호출
 * 4) 파싱/보정/검증
 * 5) 응답 반환
 *
 * 즉 "조립(Orchestration)"만 담당하고,
 * 디테일 로직은 전부 lib 레이어로 내려보냄.
 */

/**
 * 응답 헬퍼
 * - API 계약을 한 곳에서 강제
 */
function ok<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { ok: true, data };
  return NextResponse.json(body, { status });
}

function fail(code: DevPathErrorCode, message: string, status: number, detail?: unknown) {
  const body: ApiResponse<never> = { ok: false, code, message, detail };
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();

    // ✅ 서버에서도 입력 강제 (프론트만 믿지 않기)
    if (!isLanguage(raw?.language) || !isLevel(raw?.level)) {
      return fail("INVALID_INPUT", "잘못된 입력값입니다.", 400);
    }

    const body: RequestBody = {
      language: raw.language,
      level: raw.level,
      frameworks: sanitizeFrameworks(raw.language, raw.frameworks),
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fail("MISSING_API_KEY", "GEMINI_API_KEY가 설정되어 있지 않습니다.", 500);
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
        return fail("TIMEOUT", "AI 응답 시간이 초과되었습니다. 다시 시도해주세요.", 504);
      }
      return fail("UPSTREAM_ERROR", "외부 API 호출 중 네트워크 오류가 발생했습니다.", 500, {
        error: String(e?.message ?? e),
      });
    }

    // ✅ 429는 여기까지 왔다는 건 재시도 끝까지 실패했다는 뜻
    if (resp.status === 429) {
      return fail("RATE_LIMIT", "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", 429);
    }

    // 그 외 upstream 에러
    if (!resp.ok) {
      const errText = await resp.text();
      return fail("UPSTREAM_ERROR", "Gemini API 호출 실패", 500, { upstream: errText });
    }

    const json = await resp.json();
    const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText || typeof rawText !== "string") {
      return fail("PARSE_ERROR", "Gemini 응답에서 JSON 텍스트를 찾지 못했습니다.", 500);
    }

    // ✅ 파싱(정제 + JSON.parse)
    let parsed: unknown;
    try {
      parsed = safeParseGeminiJson(rawText);
    } catch (e: any) {
      return fail("PARSE_ERROR", "Gemini JSON 파싱 실패", 500, {
        error: String(e?.message ?? e),
        rawText,
      });
    }

    // ✅ 보정 후 검증(부분 성공 전략)
    const coerced = coercePlan(parsed);

    if (!validatePlan(coerced)) {
      return fail("SCHEMA_ERROR", "Gemini JSON 스키마 검증 실패", 500, {
        raw: parsed,
        rawText,
      });
    }

    // 7) 성공
    return ok<GeneratedPlan>(coerced);
  } catch (e: any) {
    return fail("INTERNAL_ERROR", "서버 처리 중 오류", 500, {
      error: String(e?.message ?? e),
    });
  }
}
