import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  try {
    const raw = await request.json();

    // ✅ 서버에서도 입력 강제 (프론트만 믿지 않기)
    if (!isLanguage(raw?.language) || !isLevel(raw?.level)) {
      return NextResponse.json({ error: "잘못된 입력값입니다." }, { status: 400 });
    }

    const body: RequestBody = {
      language: raw.language,
      level: raw.level,
      frameworks: sanitizeFrameworks(raw.language, raw.frameworks),
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되어 있지 않습니다." },
        { status: 500 }
      );
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
      // ✅ timeout은 504로 구분
      if (e?.code === "TIMEOUT" || e?.message === "TIMEOUT") {
        return NextResponse.json(
          { error: "AI 응답 시간이 초과되었습니다. 다시 시도해주세요." },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: "네트워크 오류가 발생했습니다.", detail: String(e?.message ?? e) },
        { status: 500 }
      );
    }

    // ✅ 429는 여기까지 왔다는 건 재시도 끝까지 실패했다는 뜻
    if (resp.status === 429) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: "Gemini API 호출 실패", detail: errText },
        { status: 500 }
      );
    }

    const json = await resp.json();
    const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "Gemini 응답에서 JSON 텍스트를 찾지 못했습니다." },
        { status: 500 }
      );
    }

    // ✅ 파싱(정제 + JSON.parse)
    let parsed: unknown;
    try {
      parsed = safeParseGeminiJson(rawText);
    } catch (e: any) {
      return NextResponse.json(
        { error: "Gemini JSON 파싱 실패", detail: String(e?.message ?? e), rawText },
        { status: 500 }
      );
    }

    // ✅ 보정 후 검증(부분 성공 전략)
    const coerced = coercePlan(parsed);

    if (!validatePlan(coerced)) {
      return NextResponse.json(
        {
          error: "Gemini JSON 스키마 검증 실패",
          hint: "필수 필드 누락/타입 불일치 가능성이 큽니다.",
          raw: parsed,
          rawText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(coerced);
  } catch (e: any) {
    return NextResponse.json(
      { error: "서버 처리 중 오류", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
