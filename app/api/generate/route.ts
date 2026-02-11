import { NextResponse } from "next/server";

type RequestBody = {
  stack: string;
  level: string;
};

type GeneratedPlan = {
  projectTitle: string;
  oneLiner: string;
  mvpFeatures: string[];
  buildSteps: string[];
  readmeDraft: string; // 순수 텍스트
  interviewPoints: string[];
};

function isNonEmptyStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && x.trim().length > 0);
}

function validatePlan(plan: any): plan is GeneratedPlan {
  return (
    plan &&
    typeof plan === "object" &&
    typeof plan.projectTitle === "string" &&
    plan.projectTitle.trim().length > 0 &&
    typeof plan.oneLiner === "string" &&
    plan.oneLiner.trim().length > 0 &&
    isNonEmptyStringArray(plan.mvpFeatures) &&
    isNonEmptyStringArray(plan.buildSteps) &&
    typeof plan.readmeDraft === "string" &&
    plan.readmeDraft.trim().length > 0 &&
    isNonEmptyStringArray(plan.interviewPoints)
  );
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const prompt = `
너는 개발자 취준생을 위한 전문 포트폴리오 프로젝트 설계자다.
단순한 토이 프로젝트가 아니라, 실제 실무에서 겪는 고민(데이터 흐름, 상태 관리, 예외 처리, 성능/확장성, 유지보수)을 드러낼 수 있는 프로젝트를 설계한다.

출력 언어 규칙:
- 모든 문자열 값(projectTitle, oneLiner, mvpFeatures, buildSteps, readmeDraft, interviewPoints)은 반드시 한국어로 작성한다.
- 기술 용어(React, Next.js, REST, API, DB 등)는 관례적으로 영어 표기를 유지해도 된다. 단, 문장은 한국어로 작성한다.
- 약어는 첫 등장에만 한국어로 한 번 풀어서 쓴다(예: CSR(클라이언트 사이드 렌더링)).

사용자 입력:
- 개발 스택: ${body.stack}
- 난이도: ${body.level} (이 수준에 맞는 기술적 복잡도를 반드시 반영)

아래 스키마에 맞는 결과를 생성하라:
{
  "projectTitle": "string",
  "oneLiner": "string",
  "mvpFeatures": ["string"],
  "buildSteps": ["string"],
  "readmeDraft": "string",
  "interviewPoints": ["string"]
}

작성 규칙:
- 전체 결과는 위 스키마 구조에 맞춰 작성한다.
- 난이도 반영:
  - 초급: 과도한 멀티스택/복잡한 인프라를 요구하지 말고, 핵심 스택 중심으로 완주 가능한 범위로 설계한다.
  - 중급: 설계/확장성/성능/테스트 중 1~2개를 명확히 포함한다.
- mvpFeatures는 5~7개:
  - 단순 기능 나열이 아니라, "어떻게 구현하는지"가 드러나게 쓴다.
  - 사용자의 스택을 100% 활용하는 형태로 작성한다.
- buildSteps는 6~10단계:
  - 초기 세팅 → 핵심 구현 → 예외 처리/검증 → 테스트(간단해도 됨) → 배포/운영 고려 순서로 포함한다.
- readmeDraft는 마크다운을 쓰지 말고, 순수 텍스트로 작성한다.
  - 포함 항목: 개요 / 주요 기능 / 기술 스택 / 실행 방법 / 폴더 구조 / 개선 아이디어
- interviewPoints는 최소 5개:
  - 기술 선택 이유, 트레이드오프, 구조/아키텍처 선택 근거를 묻는 질문 위주로 작성한다.
  - 예: "왜 A 대신 B를 선택했나요?", "이 구조의 장단점은?", "성능/확장성 이슈는 어떻게 대응했나요?"
`.trim();

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.6,
        },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Gemini status:", resp.status);
      console.error("Gemini error:", errText);
      return NextResponse.json(
        { error: "Gemini API 호출 실패", detail: errText },
        { status: 500 }
      );
    }

    const json = await resp.json();

    // response_mime_type을 써도 보통 text 필드로 "JSON 문자열"이 들어옵니다.
    const rawText: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "Gemini 응답에서 JSON 텍스트를 찾지 못했습니다." },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch (e: any) {
      return NextResponse.json(
        { error: "Gemini JSON 파싱 실패", detail: String(e?.message ?? e), raw: rawText },
        { status: 500 }
      );
    }

    if (!validatePlan(parsed)) {
      return NextResponse.json(
        { error: "Gemini JSON 스키마 검증 실패", raw: parsed },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json(
      { error: "서버 처리 중 오류", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
