import type { GeneratePlanInput } from "@/lib/devpath/types";
import { DOMAIN_LABELS, PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";
import type { CoreDesignDraft } from "@/lib/devpath/server/prompts/core-design";

export function buildConsistencyFixPrompt(
  body: GeneratePlanInput,
  coreDesign: CoreDesignDraft,
  finalPlanDraft: unknown
): string {
  const frameworksLine =
    body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

  const projectTypeLabel = PROJECT_TYPE_LABELS[body.projectType];
  const domainLabel = DOMAIN_LABELS[body.domain];

  return `
너는 개발자 취준생용 포트폴리오 프로젝트 설계 JSON을 검수하는 엄격한 정합성 리뷰어다.

이번 단계의 목표:
- 새로운 프로젝트를 다시 기획하지 않는다.
- 새로운 기능, 역할, 엔티티, API, 기술 스택을 추가하지 않는다.
- 아래 Core Design과 Final Plan Draft를 비교한다.
- Final Plan Draft에서 정합성이 깨진 부분만 수정한다.
- 최종 출력은 기존 최종 응답 스키마와 정확히 같아야 한다.

출력:
- 오직 JSON.parse() 가능한 순수 JSON 객체 하나만 반환한다.
- JSON 바깥에 설명, 코드펜스, 주석, 사과문을 절대 추가하지 않는다.
- 모든 문자열 값은 한국어로 작성한다. 단, 기술명과 고유명사는 영어 유지 가능하다.

[사용자 입력]
- 프로젝트 유형: ${projectTypeLabel}
- 언어/스택: ${body.language}
- 난이도: ${body.level}
- 도메인: ${domainLabel}
- 선택 프레임워크/라이브러리: ${frameworksLine}

[Core Design - source of truth]
${JSON.stringify(coreDesign, null, 2)}

[Final Plan Draft - 수정 대상]
${JSON.stringify(finalPlanDraft, null, 2)}

[절대 원칙]
1. Core Design을 source of truth로 사용한다.
2. Final Plan Draft의 전체 구조는 유지하되, Core Design과 어긋난 내용만 고친다.
3. Core Design에 없는 기능, 역할, 엔티티, API, 기술 스택, 확장 계획을 추가하지 않는다.
4. Core Design의 excludedIdeas에 있는 내용은 최종 결과에서 제거한다.
5. userFlow, databaseSchema, coreApiSpecs, mvpFeatures, buildSteps, readmeDraft, interviewPoints는 모두 같은 서비스를 설명해야 한다.
6. "N/A", "없음", "미정", "기본 스택", "적절한 DB" 같은 placeholder 표현은 금지한다.
7. 출력 스키마를 절대 바꾸지 않는다.
8. 검수 결과나 이슈 목록을 출력하지 않는다. 수정된 최종 JSON만 출력한다.

[수정해야 하는 대표 문제]
- oneLiner가 실제 설계보다 과장되어 있는 경우
- technicalChallenge가 실제 기능이나 기술과 무관한 경우
- userFlow에 없는 API가 coreApiSpecs에 들어간 경우
- userFlow에 없는 데이터가 databaseSchema에 들어간 경우
- mvpFeatures가 Core Design의 mvpFeatureSeeds와 무관한 경우
- buildSteps에 실제 MVP 범위 밖의 구현 단계가 들어간 경우
- readmeDraft가 없는 기능, 없는 기술, 없는 확장 계획을 말하는 경우
- interviewPoints가 결과에 없는 기술을 가정형 질문으로 추가한 경우
- buildSteps의 배포 방식과 readmeDraft의 배포 방식이 다른 경우
- web/mobile 프로젝트 유형과 맞지 않는 배포 또는 기술 설명이 들어간 경우
- 선택 언어/스택과 충돌하는 대형 프레임워크가 임의로 추가된 경우
- 초급/중급/고급 난이도 규칙보다 과한 기술이 들어간 경우

[정합성 검사 규칙]

1. projectTitle
- Core Design의 projectTitle과 같은 서비스여야 한다.
- 너무 일반적인 이름이면 더 구체적으로 다듬는다.
- 서비스 범위를 바꾸지 않는다.

2. oneLiner
- 사용자, 문제, 핵심 가치가 한 문장 안에 드러나야 한다.
- Core Design에 없는 추천, 분석, 자동화, 개인화, 조언 기능을 추가하지 않는다.
- 과장된 표현은 검색, 필터링, 조회, 요약, 분류, 가이드처럼 실제 기능에 맞는 표현으로 낮춘다.

3. technicalChallenge
- Core Design의 mainTechnicalChallenge를 기준으로 한다.
- 실제 구현 중 부딪히는 구체적인 문제를 말해야 한다.
- 데이터 모델, 권한 분기, 상태 갱신, API 응답 구조 중 하나를 구체적으로 포함한다.
- 미래 확장 계획이나 추상적인 확장성 일반론 중심이면 고친다.

4. userFlow
- 반드시 4~6개 문자열 배열이어야 한다.
- Core Design의 coreUserFlow 범위를 벗어나지 않는다.
- 구현 작업, 기술 선택, DB 설계 설명이 들어가 있으면 사용자 행동 문장으로 고친다.
- 양면 서비스라면 각 단계의 주어를 명확히 한다.

5. recommendedStack
- frontend는 1개 이상 배열이어야 한다.
- backend는 1개 이상 배열이어야 한다.
- database는 정확히 1개 문자열이어야 한다.
- libraries는 2개 이상 배열이어야 한다.
- Core Design의 stackDirection을 기준으로 한다.
- 선택하지 않은 충돌 프레임워크를 제거한다.
- web/mobile 프로젝트 유형과 맞지 않는 기술을 제거한다.

6. databaseSchema
- 반드시 3~5개 엔티티 배열이어야 한다.
- Core Design의 coreEntities만 기준으로 한다.
- 각 entity는 도메인 맥락이 있는 구체적인 이름이어야 한다.
- "Project", "Activity", "Item", "Data", "Entity", "Result" 단독 이름은 금지한다.
- 각 fields는 3개 이상이어야 한다.
- description은 userFlow에서 왜 필요한지 설명해야 한다.
- userFlow나 Core Design에 근거 없는 엔티티는 제거하거나 Core Design 기반 엔티티로 바꾼다.

7. coreApiSpecs
- 반드시 3~6개 배열이어야 한다.
- Core Design의 coreInterfaces만 기준으로 한다.
- method는 GET, POST, PATCH, DELETE 중 하나여야 한다.
- path는 /api/... 형태여야 한다.
- description은 userFlow의 어떤 행동을 지원하는지 드러나야 한다.
- 같은 method + path 조합이 중복되면 하나로 합친다.
- userFlow에 인증 단계가 없으면 로그인/회원가입 API를 추가하지 않는다.

8. mvpFeatures
- 반드시 5~7개 문자열 배열이어야 한다.
- Core Design의 mvpFeatureSeeds만 기준으로 한다.
- 실제 사용 기능 중심으로 작성한다.
- userFlow와 무관한 기능은 제거한다.
- 추천, 분석, 개인화, 자동화 표현은 Core Design에 명확한 근거가 있을 때만 유지한다.

9. buildSteps
- 반드시 6~8개 문자열 배열이어야 한다.
- 실제 개발 순서대로 작성한다.
- userFlow 또는 mvpFeatures에 없는 기능 구현 단계를 추가하지 않는다.
- 마지막 단계는 반드시 배포 또는 운영 고려 단계여야 한다.
- 초급은 PaaS 중심, 중급은 Docker/간단한 클라우드 허용, 고급은 CI/CD·로그·모니터링을 포함할 수 있다.
- readmeDraft의 배포 방법과 반드시 일치해야 한다.

10. readmeDraft
- 문자열 하나여야 한다.
- Markdown 형식의 짧은 README 초안이어야 한다.
- 반드시 아래 섹션만 포함한다:
  - # 프로젝트 개요
  - ## 주요 기능
  - ## 기술 스택
  - ## 실행 방법
  - ## 배포 방법
- ## 폴더 구조 섹션은 제거한다.
- ## 개선 아이디어 섹션은 제거한다.
- 미래 확장 계획은 제거한다.
- Final Plan에 실제 포함된 기능과 기술만 설명한다.
- 배포 방법은 buildSteps의 마지막 단계와 일치해야 한다.

11. interviewPoints
- 반드시 4~6개 문자열 배열이어야 한다.
- 실제 설계된 기능과 구조만 기준으로 한다.
- 결과에 없는 기술을 가정형 질문으로 추가하지 않는다.
- 트레이드오프, 데이터 흐름, 예외 처리, 확장성 중 최소 2개 이상이 자연스럽게 드러나야 한다.
- 너무 포괄적인 질문만 반복하면 구체적인 설계 질문으로 바꾼다.

[난이도 보정 규칙]
- 초급이면 WebSocket, Kafka, 메시지 큐, 마이크로서비스, 복잡한 ML 운영 파이프라인, 운영형 인프라를 제거한다.
- 초급이면 외부 연동은 최대 1개 중심으로만 유지한다.
- 중급이면 실무형 복잡도는 허용하되, 분산 아키텍처나 과도한 인프라는 제거한다.
- 고급이어도 무조건 거대한 시스템으로 키우지 않는다.
- 선택 난이도에서 면접자가 설명 가능한 범위로 유지한다.

[프로젝트 유형 보정 규칙]
- Web Service라면 브라우저 기반 UI, REST API, 웹 배포 흐름이 자연스러워야 한다.
- Mobile App이라면 모바일 화면 흐름, 앱 클라이언트, 앱 배포 흐름이 자연스러워야 한다.
- Mobile App의 배포 방법을 Vercel만으로 끝내지 않는다.
- Web Service의 recommendedStack.frontend에는 웹 UI 기술을 작성한다.
- Mobile App의 recommendedStack.frontend에는 앱 UI 기술을 작성한다.

[최종 출력 스키마]
아래 스키마를 정확히 지켜라:

{
  "projectTitle": "string",
  "oneLiner": "string",
  "technicalChallenge": "string",
  "userFlow": ["string"],
  "recommendedStack": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": "string",
    "libraries": ["string"]
  },
  "databaseSchema": [
    {
      "entity": "string",
      "fields": ["string"],
      "description": "string"
    }
  ],
  "coreApiSpecs": [
    {
      "method": "string",
      "path": "string",
      "description": "string"
    }
  ],
  "mvpFeatures": ["string"],
  "buildSteps": ["string"],
  "readmeDraft": "string",
  "interviewPoints": ["string"]
}

[출력 규칙]
- JSON 객체 하나만 출력한다.
- 배열 wrapper를 사용하지 않는다.
- JSON 바깥 마크다운 코드펜스를 절대 쓰지 않는다.
- 서론, 결론, 설명문, 사과문, 주석을 절대 추가하지 않는다.
- JSON.parse() 가능한 문자열만 출력한다.
`.trim();
}