import type { RequestBody } from "./input";

/**
 * 프롬프트 생성 레이어
 * - route.ts에서 긴 프롬프트 문자열을 떼어내서 가독성을 높임
 * - 나중에 프롬프트 A/B 테스트나 버전 관리도 쉬워짐
 */

export function buildPrompt(body: RequestBody): string {
  const frameworksLine = body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

  return `
너는 개발자 취준생을 위한 전문 포트폴리오 프로젝트 설계자다.
단순한 토이 프로젝트가 아니라, 실제 실무에서 겪는 고민(데이터 흐름, 상태 관리, 예외 처리, 성능/확장성, 유지보수)을 드러낼 수 있는 프로젝트를 설계한다.

출력 규칙(매우 중요):
- 반드시 JSON 객체 1개만 출력하라.
- 설명 문장, 코드펜스(\`\`\`), 추가 텍스트 절대 금지.
- 배열로 감싸지 말 것.

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
- buildSteps는 6~10단계:
  - 초기 세팅 → 핵심 구현 → 예외 처리/검증 → 테스트(간단해도 됨) → 배포/운영 고려 순서로 포함한다.
- readmeDraft는 Markdown 형식으로 작성한다.
  - 포함 항목: # 개요 / ## 주요 기능 / ## 기술 스택 / ## 실행 방법 / ## 폴더 구조 / ## 개선 아이디어
- interviewPoints는 최소 5개:
  - 기술 선택 이유, 트레이드오프, 구조/아키텍처 선택 근거를 묻는 질문 위주로 작성한다.
`.trim();
}
