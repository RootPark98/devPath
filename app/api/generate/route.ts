import { NextResponse } from "next/server";

const LANGUAGES = ["React/Next.js", "Python", "Java", "C++", "C#", "Go"] as const;
type Language = (typeof LANGUAGES)[number];

const LEVELS = ["초급", "중급", "고급"] as const;
type Level = (typeof LEVELS)[number];

const FRAMEWORKS_BY_LANGUAGE: Record<Language, readonly string[]> = {
  "React/Next.js": ["Next.js", "React Query", "Zustand", "Tailwind CSS", "shadcn/ui"],
  Python: ["FastAPI", "Django", "Flask", "SQLAlchemy", "Celery"],
  Java: ["Spring Boot", "JPA(Hibernate)", "QueryDSL", "JUnit", "Gradle"],
  "C++": ["STL", "CMake", "Catch2", "fmt", "spdlog"],
  "C#": [".NET", "ASP.NET Core", "Entity Framework Core", "xUnit", "Serilog"],
  Go: ["Gin", "Fiber", "GORM", "sqlc", "Zap"],
} as const;

type RequestBody = {
  language: Language;
  level: Level;
  frameworks: string[];
};

type GeneratedPlan = {
  projectTitle: string;
  oneLiner: string;
  mvpFeatures: string[];
  buildSteps: string[];
  readmeDraft: string; // ✅ Markdown 허용
  interviewPoints: string[];
};

function isLanguage(x: any): x is Language {
  return LANGUAGES.includes(x);
}
function isLevel(x: any): x is Level {
  return LEVELS.includes(x);
}

function isNonEmptyStringArray(v: unknown): v is string[] {
  return (
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((x) => typeof x === "string" && x.trim().length > 0)
  );
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

function sanitizeFrameworks(language: Language, frameworks: unknown): string[] {
  const allowed = new Set(FRAMEWORKS_BY_LANGUAGE[language]);
  if (!Array.isArray(frameworks)) return [];
  return frameworks
    .filter((f) => typeof f === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && allowed.has(s));
}

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

    const frameworksLine =
      body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

    const prompt = `
너는 개발자 취준생을 위한 전문 포트폴리오 프로젝트 설계자다.
단순한 토이 프로젝트가 아니라, 실제 실무에서 겪는 고민(데이터 흐름, 상태 관리, 예외 처리, 성능/확장성, 유지보수)을 드러낼 수 있는 프로젝트를 설계한다.

출력 언어 규칙:
- 모든 문자열 값(projectTitle, oneLiner, mvpFeatures, buildSteps, readmeDraft, interviewPoints)은 반드시 한국어로 작성한다.
- 기술 용어(${body.language}, ${frameworksLine}, REST, API, DB 등)는 관례적으로 영어 표기를 유지해도 된다. 단, 문장은 한국어로 작성한다.
- README는 Markdown 형식을 사용하여 가독성 있게 작성한다.

사용자 입력:
- 언어/스택: ${body.language}
- 난이도: ${body.level}
- 프레임워크/라이브러리(선택): ${frameworksLine}

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
  - 고급: 운영/모니터링/성능/보안 중 2개 이상을 포함하고 트레이드오프를 명확히 한다.
- mvpFeatures는 5~7개:
  - 단순 기능 나열이 아니라, "어떻게 구현하는지"가 드러나게 쓴다.
  - 사용자의 언어/스택과 선택한 프레임워크를 최대한 활용한다(선택이 없으면 언어/스택 중심).
- buildSteps는 6~10단계:
  - 초기 세팅 → 핵심 구현 → 예외 처리/검증 → 테스트(간단해도 됨) → 배포/운영 고려 순서로 포함한다.
- readmeDraft는 Markdown 형식으로 작성한다.
  - 포함 항목: # 개요 / ## 주요 기능 / ## 기술 스택 / ## 실행 방법 / ## 폴더 구조 / ## 개선 아이디어
- interviewPoints는 최소 5개:
  - 기술 선택 이유, 트레이드오프, 구조/아키텍처 선택 근거를 묻는 질문 위주로 작성한다.
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
          temperature: 0.4, // ✅ 제품화: 일관성 조금 더 강화
        },
      }),
    });

    // ✅ 429 처리
    if (!resp.ok) {
      const errText = await resp.text();

      if (resp.status === 429) {
        return NextResponse.json(
          { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
          { status: 429 }
        );
      }

      console.error("Gemini status:", resp.status);
      console.error("Gemini error:", errText);
      return NextResponse.json(
        { error: "Gemini API 호출 실패", detail: errText },
        { status: 500 }
      );
    }

    const json = await resp.json();

    // response_mime_type 사용 시에도 보통 text에 JSON 문자열이 들어오는 경우가 많음
    const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "Gemini 응답에서 JSON 텍스트를 찾지 못했습니다." },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      // ✅ 가벼운 정제: ```json ... ``` 또는 ``` ... ``` 코드펜스 제거
      const sanitizedText = rawText.replace(/```(?:json)?/gi, "").trim();

      parsed = JSON.parse(sanitizedText);

      // ✅ Gemini가 가끔 [{...}] 형태로 주는 경우가 있어 보정
      if (Array.isArray(parsed)) {
        parsed = parsed[0] ?? null;
      }
    } catch (e: any) {
      return NextResponse.json(
        {
          error: "Gemini JSON 파싱 실패",
          detail: String(e?.message ?? e),
          raw: rawText,
        },
        { status: 500 }
      );
    }

    if (!validatePlan(parsed)) {
      // return NextResponse.json(
      //   { error: "Gemini JSON 스키마 검증 실패", raw: parsed },
      //   { status: 500 }
      // );

      console.error("Schema validation failed. Parsed:", parsed);
  console.error("Schema validation failed. RawText:", rawText);

  return NextResponse.json(
    {
      error: "Gemini JSON 스키마 검증 실패",
      hint:
        "Gemini가 projectTitle/oneLiner/mvpFeatures/buildSteps/readmeDraft/interviewPoints 중 일부를 누락했거나 타입이 다릅니다.",
      raw: parsed,
      rawText,
    },
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
