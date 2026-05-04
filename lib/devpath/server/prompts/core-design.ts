import type { GeneratePlanInput } from "@/lib/devpath/types";
import { DOMAIN_LABELS, PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";
import {
  getDomainRule,
  getProjectTypeRule,
  getLanguageInterpretationRule,
  getDifficultyRule,
  getUniversalGuardRules,
} from "@/lib/devpath/server/prompts/rules";

export type CoreDesignDraft = {
  projectTitle: string;
  targetUser: string;
  problem: string;
  serviceConcept: string;
  projectType: string;
  domain: string;
  difficulty: string;
  roles: string[];
  coreUserFlow: Array<{
    id: string;
    actor: string;
    action: string;
    dataCreatedOrUpdated: string;
    expectedResult: string;
  }>;
  coreEntities: Array<{
    name: string;
    purpose: string;
    keyFields: string[];
    linkedFlowIds: string[];
  }>;
  coreInterfaces: Array<{
    method: "GET" | "POST" | "PATCH" | "DELETE";
    path: string;
    purpose: string;
    linkedFlowIds: string[];
  }>;
  mvpFeatureSeeds: string[];
  stackDirection: {
    frontend: string[];
    backend: string[];
    database: string;
    libraries: string[];
  };
  mainTechnicalChallenge: {
    topic: string;
    reason: string;
    tradeOff: string;
  };
  excludedIdeas: string[];
};

export function buildCoreDesignPrompt(body: GeneratePlanInput): string {
  const frameworksLine =
    body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

  const projectTypeLabel = PROJECT_TYPE_LABELS[body.projectType];
  const domainLabel = DOMAIN_LABELS[body.domain];

  return `
너는 개발자 취준생을 위한 실무형 포트폴리오 프로젝트 설계자다.

이번 단계의 목표:
- 최종 설계서를 바로 작성하지 않는다.
- README, 면접 질문, 빌드 순서, 최종 소개 문구를 작성하지 않는다.
- 먼저 하나의 일관된 프로젝트가 되기 위한 "핵심 설계 원본(Core Design)"만 만든다.
- 이 Core Design은 이후 최종 JSON 생성의 기준 자료가 된다.

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

[이번 단계에서 절대 하지 말 것]
- readmeDraft를 작성하지 않는다.
- interviewPoints를 작성하지 않는다.
- buildSteps를 작성하지 않는다.
- 최종 mvpFeatures 문장을 완성하려고 하지 않는다.
- 추상적인 서비스 소개문을 길게 쓰지 않는다.
- 아직 설계되지 않은 추천, 분석, 개인화, 자동화 기능을 추가하지 않는다.

[핵심 목표]
- 단순 토이 프로젝트가 아니라 실제 면접에서 설명 가능한 실무형 프로젝트 시나리오를 만든다.
- 하나의 사용자 문제, 하나의 서비스 맥락, 하나의 데이터 흐름이 자연스럽게 연결되어야 한다.
- userFlow, entity, interface가 서로 추적 가능해야 한다.
- 모든 entity와 interface는 coreUserFlow의 특정 단계와 연결되어야 한다.
- 프로젝트는 선택된 web/mobile 유형에 반드시 맞아야 한다.

[최상위 원칙]
1. 단순 게시판, 메모 앱, Todo, 블로그 클론, 기본 CRUD 관리자 페이지를 만들지 않는다.
2. 흔한 CRUD라도 실제 사용 맥락과 상태 변화가 있는 구체적인 시나리오로 바꾼다.
3. generic 엔티티명(Project, Activity, Item, Data, Result, Entity)을 단독으로 사용하지 않는다.
4. 모든 기술 선택은 구체적인 기술명으로 작성한다.
5. "N/A", "없음", "미정", "기본 스택", "적절한 DB" 같은 placeholder 표현은 금지한다.
6. AI, 추천, 분석, 생성 같은 표현을 쓰면 외부 AI API 또는 명확한 규칙 기반 처리 로직이 설계에 반영되어야 한다.
7. 역할은 최대 2개까지만 허용한다.
8. 초급과 중급에서는 핵심 기능 축을 과하게 늘리지 않는다.

${getDomainRule(body.domain)}

${getProjectTypeRule(body.projectType)}

${getLanguageInterpretationRule(
  body.projectType,
  body.language,
  body.frameworks
)}

${getDifficultyRule(body.level)}

${getUniversalGuardRules()}

[Core Design 작성 순서]
1. 실제 사용자 문제를 하나 정한다.
2. 그 문제를 해결하는 서비스/앱 시나리오를 정한다.
3. 사용자 역할을 1~2개로 제한한다.
4. coreUserFlow를 4~6단계로 작성한다.
5. 각 flow 단계에서 생성/수정/조회되는 데이터를 명확히 적는다.
6. flow에서 필요한 coreEntities를 3~5개 만든다.
7. flow를 수행하기 위한 coreInterfaces를 3~6개 만든다.
8. 최종 설계에서 사용할 수 있는 mvpFeatureSeeds를 5~7개 만든다.
9. 선택 언어/스택과 난이도에 맞는 stackDirection을 정한다.
10. 실제 구현 중 가장 설명 가치가 큰 mainTechnicalChallenge를 하나 정한다.
11. 이번 설계에서 의도적으로 제외한 과한 아이디어를 excludedIdeas에 적는다.

[coreUserFlow 규칙]
- 반드시 4~6개 배열로 작성한다.
- 각 단계는 실제 사용자 행동이어야 한다.
- 구현 작업, DB 설계, 기술 선택을 action에 쓰지 않는다.
- id는 "F1", "F2", "F3" 형식으로 작성한다.
- actor는 roles에 포함된 값 중 하나여야 한다.
- dataCreatedOrUpdated에는 해당 단계에서 생성, 수정, 조회, 저장되는 핵심 데이터를 쓴다.
- 상태 변경이 없는 조회 단계라도 어떤 데이터를 조회하는지 명확히 쓴다.

[coreEntities 규칙]
- 반드시 3~5개 배열로 작성한다.
- name은 도메인 맥락이 드러나는 구체적인 이름이어야 한다.
- keyFields는 3개 이상 작성한다.
- linkedFlowIds는 coreUserFlow의 id만 사용한다.
- linkedFlowIds가 비어 있는 entity는 금지한다.
- userFlow에 근거가 없는 entity는 만들지 않는다.

[coreInterfaces 규칙]
- 반드시 3~6개 배열로 작성한다.
- method는 GET, POST, PATCH, DELETE 중 하나만 사용한다.
- path는 반드시 /api/... 형태로 작성한다.
- linkedFlowIds는 coreUserFlow의 id만 사용한다.
- linkedFlowIds가 비어 있는 interface는 금지한다.
- 같은 method + path 조합을 중복하지 않는다.
- 인증 flow가 없으면 로그인/회원가입 API를 넣지 않는다.

[mvpFeatureSeeds 규칙]
- 반드시 5~7개 배열로 작성한다.
- 최종 mvpFeatures의 재료가 되는 짧은 기능 문장으로 작성한다.
- coreUserFlow와 무관한 기능을 넣지 않는다.
- "추천", "분석", "개인화", "자동화"라는 표현은 근거가 있을 때만 사용한다.

[stackDirection 규칙]
- frontend는 1개 이상 배열로 작성한다.
- backend는 1개 이상 배열로 작성한다.
- database는 정확히 1개 기술명으로 작성한다.
- libraries는 2개 이상 배열로 작성한다.
- 선택 프레임워크가 있으면 가능한 한 우선 반영한다.
- 사용자가 선택하지 않은 충돌하는 대형 프레임워크를 임의로 추가하지 않는다.
- web/mobile 프로젝트 유형과 일치해야 한다.

[mainTechnicalChallenge 규칙]
- topic은 구체적인 기술 주제 하나로 작성한다.
- reason은 왜 이 프로젝트에서 그 문제가 중요한지 설명한다.
- tradeOff는 구현 중 고민할 선택지나 균형점을 설명한다.
- 실제 coreUserFlow, coreEntities, coreInterfaces 중 최소 1개 이상과 연결되는 내용이어야 한다.
- 미래 확장 계획이나 추상적인 확장성 일반론을 중심으로 쓰지 않는다.

[excludedIdeas 규칙]
- 반드시 2~4개 배열로 작성한다.
- 이 프로젝트에서 일부러 제외한 과한 기능이나 위험한 방향을 적는다.
- 예: "초급 범위를 넘는 실시간 채팅은 제외한다."
- 예: "의학적 판단을 대신하는 AI 진단 기능은 제외한다."

[자기 점검 - 출력에는 포함하지 말 것]
- projectType이 web/mobile 규칙과 일치하는가?
- 선택 언어/스택이 자연스럽게 반영되었는가?
- 난이도보다 과한 기술이 들어가지 않았는가?
- roles는 1~2개인가?
- coreUserFlow는 4~6개인가?
- coreEntities는 3~5개인가?
- coreInterfaces는 3~6개인가?
- 모든 entity와 interface가 flow id에 연결되는가?
- userFlow에 없는 기능이 mvpFeatureSeeds에 들어가지 않았는가?
- AI/추천/분석/개인화 표현을 썼다면 근거 데이터와 처리 방식이 있는가?
- excludedIdeas가 실제로 범위 제어에 도움이 되는가?

아래 스키마를 정확히 지켜라:

{
  "projectTitle": "string",
  "targetUser": "string",
  "problem": "string",
  "serviceConcept": "string",
  "projectType": "string",
  "domain": "string",
  "difficulty": "string",
  "roles": ["string"],
  "coreUserFlow": [
    {
      "id": "string",
      "actor": "string",
      "action": "string",
      "dataCreatedOrUpdated": "string",
      "expectedResult": "string"
    }
  ],
  "coreEntities": [
    {
      "name": "string",
      "purpose": "string",
      "keyFields": ["string"],
      "linkedFlowIds": ["string"]
    }
  ],
  "coreInterfaces": [
    {
      "method": "string",
      "path": "string",
      "purpose": "string",
      "linkedFlowIds": ["string"]
    }
  ],
  "mvpFeatureSeeds": ["string"],
  "stackDirection": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": "string",
    "libraries": ["string"]
  },
  "mainTechnicalChallenge": {
    "topic": "string",
    "reason": "string",
    "tradeOff": "string"
  },
  "excludedIdeas": ["string"]
}

[출력 규칙]
- JSON 객체 하나만 출력한다.
- 배열 wrapper를 사용하지 않는다.
- JSON 바깥 마크다운 코드펜스를 절대 쓰지 않는다.
- 서론, 결론, 설명문, 사과문, 주석을 절대 추가하지 않는다.
- JSON.parse() 가능한 문자열만 출력한다.
`.trim();
}