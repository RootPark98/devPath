import type { GeneratePlanInput } from "@/lib/devpath/types";
import { DOMAIN_LABELS, PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";
import type { CoreDesignDraft } from "@/lib/devpath/server/prompts/core-design";

export function buildFinalPlanPrompt(
  body: GeneratePlanInput,
  coreDesign: CoreDesignDraft
): string {
  const frameworksLine =
    body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

  const projectTypeLabel = PROJECT_TYPE_LABELS[body.projectType];
  const domainLabel = DOMAIN_LABELS[body.domain];

  return `
너는 개발자 취준생을 위한 실무형 포트폴리오 프로젝트 설계서를 작성하는 편집자다.

이번 단계의 목표:
- 새로운 프로젝트를 다시 기획하지 않는다.
- 아래 Core Design을 기준으로 최종 프로젝트 설계 JSON을 작성한다.
- Core Design에 없는 기능, 역할, 엔티티, API, 기술 스택, 확장 계획을 새로 추가하지 않는다.
- 모든 최종 필드는 Core Design의 내용을 보기 좋게 정리하고 구체화하는 용도다.

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

[Core Design]
${JSON.stringify(coreDesign, null, 2)}

[최상위 원칙]
1. Core Design을 source of truth로 사용한다.
2. projectTitle은 Core Design의 projectTitle을 유지하거나 더 자연스럽게 다듬는 수준만 허용한다.
3. oneLiner는 Core Design의 targetUser, problem, serviceConcept만 기준으로 작성한다.
4. technicalChallenge는 Core Design의 mainTechnicalChallenge만 기준으로 작성한다.
5. userFlow는 Core Design의 coreUserFlow를 4~6개 문자열 배열로 변환한다.
6. recommendedStack은 Core Design의 stackDirection만 기준으로 작성한다.
7. databaseSchema는 Core Design의 coreEntities만 기준으로 작성한다.
8. coreApiSpecs는 Core Design의 coreInterfaces만 기준으로 작성한다.
9. mvpFeatures는 Core Design의 mvpFeatureSeeds만 기준으로 작성한다.
10. readmeDraft와 interviewPoints는 최종 설계 본문에 실제 포함된 내용만 기준으로 작성한다.
11. Core Design의 excludedIdeas에 있는 기능은 절대 최종 결과에 추가하지 않는다.
12. "N/A", "없음", "미정", "기본 스택", "적절한 DB" 같은 placeholder 표현은 금지한다.

[정합성 규칙]
- userFlow에 없는 기능을 mvpFeatures, coreApiSpecs, databaseSchema에 추가하지 않는다.
- coreApiSpecs는 userFlow의 실제 행동을 지원해야 한다.
- databaseSchema의 각 엔티티는 userFlow의 특정 단계와 연결되어야 한다.
- mvpFeatures의 각 기능은 userFlow 중 최소 1개 단계와 연결되어야 한다.
- oneLiner, technicalChallenge, interviewPoints, readmeDraft는 실제 설계에 포함된 기능과 기술만 기준으로 작성한다.
- 결과에 없는 기술을 interviewPoints에 가정형 질문으로 추가하지 않는다.
- buildSteps에는 userFlow 또는 mvpFeatures에 없는 기능 구현 단계를 추가하지 않는다.
- buildSteps의 마지막 배포 전략과 readmeDraft의 배포 방법은 같은 기술/플랫폼이어야 한다.
- 추천, 매칭, 개인화, 조언, 분석, 자동화 표현은 Core Design에 명확한 근거가 있을 때만 사용한다.
- 근거가 부족하면 검색, 필터링, 요약, 분류, 조회, 가이드 같은 더 단순한 표현으로 낮춘다.

[필드별 출력 규칙]

1. projectTitle
- 짧지만 구체적인 프로젝트명으로 작성한다.
- 너무 일반적인 이름 금지. 예: "작업 관리 플랫폼", "데이터 시스템"
- Core Design의 서비스 맥락을 벗어나지 않는다.

2. oneLiner
- 반드시 1문장, 50자 이내로 작성한다.
- "누가 + 무엇을 + 어떻게" 구조로 작성한다.
- 접속사(~하고, ~하며, ~하면서)로 문장을 이어붙이지 않는다.
- 사용자, 핵심 기능 하나만 담는다. 부가 기능은 넣지 않는다.
- 추상적인 소개, 구현되지 않은 기능 금지.

3. technicalChallenge
- 1~2문장으로 작성한다.
- Core Design의 mainTechnicalChallenge.topic, reason, tradeOff를 자연스럽게 반영한다.
- 실제 구현 중 부딪히는 핵심 기술 난제와 트레이드오프를 드러낸다.
- 너무 넓은 표현 금지.
- 데이터 모델, 권한 분기, 상태 갱신, API 응답 구조 중 하나를 구체적으로 언급한다.
- 미래 확장 계획이나 추상적인 확장성 일반론 중심으로 쓰지 않는다.

4. userFlow
- 반드시 4~6개 문자열 배열로 작성한다.
- Core Design의 coreUserFlow를 사용자 관점의 짧고 명확한 문장으로 변환한다.
- 구현 작업, 기술 선택, DB 설계 내용을 쓰지 않는다.
- 양면 서비스라면 각 단계에서 주어를 분명히 적는다.
- Core Design에 없는 단계를 추가하지 않는다.

5. recommendedStack
- 항상 아래 형태를 유지한다.
  - frontend: 1개 이상 배열
  - backend: 1개 이상 배열
  - database: 정확히 1개 문자열
  - libraries: 2개 이상 배열
- Core Design의 stackDirection만 기준으로 작성한다.
- 모두 구체적인 기술명만 사용한다.
- 사용자가 선택하지 않은 충돌하는 대형 프레임워크를 임의로 추가하지 않는다.

6. databaseSchema
- 반드시 3~5개 엔티티 배열로 작성한다.
- Core Design의 coreEntities만 기준으로 작성한다.
- 각 엔티티는 반드시 아래 형태를 따른다:
  - entity: 도메인 기반 이름
  - fields: 3개 이상
  - description: 해당 엔티티가 userFlow에서 왜 필요한지 설명
- entity 이름은 "Project", "Activity", "Item", "Data", "Entity", "Result" 단독 사용 금지.
- userFlow에 등장하지 않는 데이터는 만들지 않는다.
- description에 (F1), (F2), (F3) 같은 flow ID 참조 표기를 넣지 않는다.
- description은 자연스러운 한국어 문장으로만 작성한다.

7. coreApiSpecs
- 반드시 3~6개 배열로 작성한다.
- Core Design의 coreInterfaces만 기준으로 작성한다.
- Web/Mobile에서는 REST API 중심으로 작성한다.
  - method: GET, POST, PATCH, DELETE 중 하나
  - path: /api/... 형태
- description은 userFlow의 어떤 행동을 지원하는지 드러나야 한다.
- 같은 method + path 조합을 중복해서 쓰지 않는다.

8. mvpFeatures
- 반드시 5~7개 문자열 배열로 작성한다.
- Core Design의 mvpFeatureSeeds만 기준으로 작성한다.
- 실제 사용 기능 중심으로 작성한다.
- 너무 뭉뚱그린 표현만 나열하지 않는다.
- Core Design에 없는 기능을 추가하지 않는다.

9. buildSteps
- 반드시 6~8개 문자열 배열로 작성한다.
- 실제 개발 순서대로 작성한다.
- 마지막 단계는 반드시 배포 또는 운영 고려 단계여야 한다.
- 선택된 난이도에 맞는 현실적인 배포 전략을 포함한다.
- 초급은 PaaS 중심, 중급은 Docker/간단한 클라우드 허용, 고급은 CI/CD·로그·모니터링을 포함할 수 있다.
- Core Design에 없는 기능 구현 단계를 추가하지 않는다.

10. readmeDraft
- 문자열 하나로 작성한다.
- 실제 README 초안처럼 Markdown 형식으로 작성한다.
- README는 설계서 보조 요약용이므로 과도하게 길게 작성하지 않는다.
- 반드시 아래 섹션만 포함한다:
  - # 프로젝트 개요
  - ## 주요 기능
  - ## 기술 스택
  - ## 실행 방법
  - ## 배포 방법
- ## 폴더 구조 섹션은 작성하지 않는다.
- ## 개선 아이디어 섹션은 작성하지 않는다.
- 코드블록은 꼭 필요한 경우가 아니면 사용하지 않는다.
- 실행 방법은 3~5줄 정도의 짧은 절차로 정리한다.
- 배포 방법은 buildSteps의 마지막 단계와 일치해야 한다.
- 폴더 구조, 세부 디렉터리 트리, 미래 확장 계획은 readmeDraft에 넣지 않는다.

11. interviewPoints
- 반드시 4~6개 문자열 배열로 작성한다.
- 면접에서 실제로 받을 만한 설계 질문이어야 한다.
- 너무 포괄적인 질문만 반복하지 않는다.
- 트레이드오프, 데이터 흐름, 예외 처리, 확장성 중 최소 2개 이상이 자연스럽게 드러나야 한다.
- 결과에 실제로 포함된 기술과 기능만 기준으로 작성한다.
- 결과에 없는 기술을 가정형 질문으로 새로 추가하지 않는다.

[자기 점검 - 출력에는 포함하지 말 것]
- Core Design에 없는 기능을 추가하지 않았는가?
- Core Design의 excludedIdeas를 최종 결과에 넣지 않았는가?
- userFlow는 4~6개인가?
- databaseSchema는 3~5개인가?
- coreApiSpecs는 3~6개인가?
- mvpFeatures는 5~7개인가?
- buildSteps는 6~8개인가?
- interviewPoints는 4~6개인가?
- 마지막 buildSteps와 readmeDraft의 배포 방법이 일치하는가?
- generic 엔티티가 없는가?
- readmeDraft에 폴더 구조와 개선 아이디어를 넣지 않았는가?
- 모든 값이 비어 있지 않은가?

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