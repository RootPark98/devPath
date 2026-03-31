import type { GeneratePlanInput, Domain, Level, ProjectType } from "@/lib/devpath/types";
import { DOMAIN_LABELS, PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";

function getDomainRule(domain: Domain): string {
  if (domain === "auto") {
    return `
[도메인 규칙]
- 도메인은 랜덤으로 고르지 않는다.
- 프로젝트 유형, 언어, 난이도, 선택 프레임워크에 가장 잘 맞는 도메인 하나를 스스로 선택한다.
- 단, 흔한 CRUD 관리자 페이지처럼 보이지 않도록 실제 사용 맥락이 있는 시나리오를 선택한다.
`.trim();
  }

  return `
[도메인 규칙]
- 반드시 ${DOMAIN_LABELS[domain]} 도메인 안에서만 프로젝트를 설계한다.
- 다른 도메인으로 벗어나지 않는다.
- 같은 도메인 안에서도 흔한 CRUD 예제가 아니라, 실제 사용 맥락이 드러나는 구체적인 시나리오를 선택한다.
`.trim();
}

function getProjectTypeRule(projectType: ProjectType): string {
  switch (projectType) {
    case "web":
      return `
[프로젝트 유형 규칙: Web Service]
- 브라우저 기반 사용자 UI가 반드시 존재해야 한다.
- userFlow는 웹 화면 기준의 실제 사용자 행동 흐름이어야 한다.
- coreApiSpecs는 REST API 형식으로 작성한다.
- recommendedStack.frontend에는 웹 UI 기술을 작성한다.
- recommendedStack.backend에는 서버 기술을 작성한다.
- database는 실제 서비스 데이터 저장에 적합한 기술 하나를 작성한다.
- buildSteps와 readmeDraft의 배포 방법은 웹 서비스 기준으로 작성한다.
`.trim();

    case "mobile":
      return `
[프로젝트 유형 규칙: Mobile App]
- 모바일 앱 화면 중심의 실제 사용 흐름이어야 한다.
- 오프라인 대응, 로컬 캐싱, 푸시/알림, 백그라운드 동기화 중 최소 1개 이상 반드시 반영한다.
- coreApiSpecs는 앱이 호출하는 인터페이스 형식으로 작성한다.
- recommendedStack.frontend에는 앱 UI 기술을 작성한다.
- recommendedStack.backend에는 서버 기술을 작성한다.
- database는 모바일 앱 + 서버 구조에서 현실적으로 사용할 수 있는 기술 하나를 작성한다.
- 배포 방법은 Expo/EAS, TestFlight, Play Console, App Store Connect 같은 앱 배포 흐름을 반영한다.
- Vercel만으로 끝나는 배포 설명은 금지한다.
`.trim();

    case "tool":
      return `
[프로젝트 유형 규칙: Developer Tool]
- 일반 소비자용 서비스처럼 꾸미지 않는다.
- 인터페이스는 CLI, SDK, VSCode Extension, GitHub App, 챗옵스 봇 중 최소 1개 이상으로 명확해야 한다.
- recommendedStack.frontend에는 실제 인터페이스를 작성한다. 예: "CLI Interface", "VSCode Extension UI"
- recommendedStack.backend에는 실행 런타임 또는 처리 계층을 작성한다. 예: "Node.js Runtime", "Python Worker"
- database는 설정, 캐시, 실행 기록, 결과 메타데이터 등을 저장하는 실제 저장소 기술 하나를 작성한다.
- REST API가 없으면 coreApiSpecs는 아래 형식으로 작성한다:
  - method: "COMMAND"
  - path: 실제 명령어 또는 인터페이스 시그니처
- userFlow는 입력 → 실행 → 처리 → 결과 확인 흐름이 분명해야 한다.
`.trim();
  }
}

function getDifficultyRule(level: Level): string {
  switch (level) {
    case "초급":
      return `
[난이도 규칙: 초급]
목표:
- 단일 애플리케이션 구조 안에서 핵심 데이터 흐름을 설명할 수 있어야 한다.
- 구조는 단순하지만 실제 서비스처럼 보여야 한다.

허용:
- 단일 서버
- 기본 인증
- 기본 CRUD + 검색/필터링
- 간단한 상태 관리
- 기본적인 예외 처리

금지:
- WebSocket, 스트리밍, 채팅
- 메시지 큐, 이벤트 버스
- 마이크로서비스
- 복잡한 외부 연동 2개 이상
- 대규모 분산 시스템

technicalChallenge는 아래 중 하나를 중심으로 작성한다:
- 데이터 모델링
- 상태 관리
- API 응답 구조
- 기본 에러 처리
`.trim();

    case "중급":
      return `
[난이도 규칙: 중급]
목표:
- 실제 서비스에서 자주 나오는 구조/성능 문제 일부를 해결할 수 있어야 한다.

필수:
- 아래 중 최소 2개 이상 반드시 포함한다.
  - 캐싱 전략
  - 상태 관리 라이브러리
  - 페이지네이션 또는 무한 스크롤
  - 낙관적 업데이트 또는 재시도 처리
  - API 모킹 또는 테스트
  - 렌더링/쿼리 성능 최적화

금지:
- 마이크로서비스
- 과도한 인프라 설계
- 복잡한 분산 아키텍처

technicalChallenge는 아래 중 하나 이상을 반드시 포함한다:
- 캐싱 전략
- 상태 관리 구조
- API 성능 개선
- 데이터 흐름 최적화
`.trim();

    case "고급":
      return `
[난이도 규칙: 고급]
목표:
- 실무 수준의 설계 판단과 운영 고려가 드러나야 한다.

필수:
- 아래 중 최소 2개 이상 반드시 포함한다.
  - 인증/인가
  - 배포 자동화 또는 CI/CD
  - 로그 수집 또는 모니터링
  - 성능 병목 분석
  - 대용량 데이터 처리 전략
  - 장애 대응 또는 재시도 전략

허용:
- 실시간 처리
- 비동기 작업 큐
- 이벤트 기반 처리

주의:
- 고급이라고 해서 무조건 거대한 시스템으로 만들지 않는다.
- 학습 가능한 범위 안에서 현실적인 복잡도를 유지한다.

technicalChallenge는 아래 수준으로 작성한다:
- 동시성 제어
- 확장성 설계
- 장애 대응 전략
- 성능 병목 해결
`.trim();
  }
}

export function buildPrompt(body: GeneratePlanInput): string {
  const frameworksLine =
    body.frameworks.length > 0
      ? body.frameworks.join(", ")
      : "선택 없음";

  const projectTypeLabel = PROJECT_TYPE_LABELS[body.projectType];
  const domainLabel = DOMAIN_LABELS[body.domain];

  return `
너는 개발자 취준생을 위한 실무형 포트폴리오 프로젝트 설계자다.

목표:
- 단순 토이 프로젝트가 아니라, 실제 면접에서 설명 가능한 실무형 프로젝트 설계를 만든다.
- 결과물은 반드시 하나의 일관된 시스템이어야 한다.
- 데이터 흐름, 상태 변화, 예외 처리, 유지보수 포인트가 자연스럽게 드러나야 한다.
- 출력은 오직 JSON.parse() 가능한 순수 JSON 객체 하나만 반환한다.

[사용자 입력]
- 프로젝트 유형: ${projectTypeLabel}
- 언어/스택: ${body.language}
- 난이도: ${body.level}
- 도메인: ${domainLabel}
- 선택 프레임워크/라이브러리: ${frameworksLine}

[최상위 원칙]
1. 단순 게시판, 메모 앱, Todo, 블로그 클론, 기본 CRUD 관리자 페이지를 만들지 않는다.
2. userFlow에 없는 기능, 엔티티, API를 추가하지 않는다.
3. generic 엔티티명(Project, Activity, Item, Data, Result, Entity)을 단독으로 사용하지 않는다.
4. 모든 기술 선택은 구체적이어야 한다. "기본 백엔드", "일반적인 라이브러리", "적절한 DB" 같은 표현은 금지한다.
5. 모든 문자열 값은 한국어로 작성한다. 단, 기술명과 고유명사는 영어 유지 가능하다.
6. AI, 추천, 분석, 생성 같은 표현을 쓰면 반드시 그에 맞는 외부 AI API 또는 명확한 규칙 기반 처리 로직이 설계에 반영되어야 한다.
7. 결과는 재미보다 완성도가 우선이지만, 동시에 포트폴리오로 눈에 띄는 구체적인 서비스 시나리오여야 한다.
8. recommendedStack.backend, recommendedStack.database, coreApiSpecs는 항상 채운다.
9. coreApiSpecs는 비워두지 않는다. REST API가 아닌 경우에도 command/interface spec으로 작성한다.
10. "N/A", "없음", "미정", "기본 스택" 같은 placeholder 표현은 금지한다.

${getDomainRule(body.domain)}

${getProjectTypeRule(body.projectType)}

${getDifficultyRule(body.level)}

[설계 순서 - 내부적으로만 따를 것]
1. 현실적인 사용자 문제를 하나 정한다.
2. 그 문제를 해결하는 서비스/앱/도구 시나리오를 정한다.
3. userFlow를 4~6단계로 쓴다.
4. userFlow에서 발생하는 데이터를 기준으로 databaseSchema를 만든다.
5. userFlow를 수행하기 위해 필요한 인터페이스를 coreApiSpecs로 정의한다.
6. 마지막으로 recommendedStack, mvpFeatures, buildSteps, readmeDraft, interviewPoints를 완성한다.

[공통 설계 규칙]
- projectTitle은 짧지만 구체적인 서비스명이어야 한다.
- oneLiner는 "누가 무엇을 왜 쓰는지"가 드러나는 한 문장이어야 한다.
- technicalChallenge는 실제 구현 중 부딪히는 핵심 기술 난제와 트레이드오프를 1~2문장으로 구체적으로 써야 한다.
- userFlow는 실제 사용 순서여야 하며 구현 항목 목록처럼 쓰면 안 된다.
- databaseSchema는 userFlow 단계에서 필요한 데이터만 담아야 한다.
- coreApiSpecs는 userFlow를 수행하기 위해 실제 호출되거나 실행되는 인터페이스만 담아야 한다.
- mvpFeatures는 userFlow를 실제 기능으로 바꾼 목록이어야 한다.
- buildSteps는 실제 개발 순서여야 한다.
- readmeDraft는 buildSteps의 마지막 배포 전략과 일치해야 한다.
- interviewPoints는 "왜 이렇게 설계했는가"를 설명할 수 있는 질문이어야 한다.
- 전체 설계는 하나의 일관된 제품처럼 보여야 한다.

[필드별 출력 규칙]

1. projectTitle
- 짧지만 구체적인 프로젝트명으로 작성한다.
- 너무 일반적인 이름 금지. 예: "작업 관리 플랫폼", "데이터 시스템"

2. oneLiner
- 한 문장으로 작성한다.
- 사용자, 문제, 핵심 가치가 드러나야 한다.
- 추상적인 소개 금지. 예: "효율적인 서비스를 제공하는 플랫폼"

3. technicalChallenge
- 1~2문장으로 작성한다.
- 실제 구현 중 부딪히는 핵심 기술 난제와 트레이드오프를 드러낸다.
- 너무 넓은 표현 금지. 예: "성능 최적화가 중요하다"
- 아래 중 최소 1개 이상 자연스럽게 드러나야 한다:
  - 실무 환경을 가정한 기술적 제약 사항
  - 실제 운영 중 발생할 수 있는 트러블슈팅 사례

4. userFlow
- 반드시 4~6개 문자열 배열로 작성한다.
- 각 단계는 실제 사용 흐름의 짧고 명확한 한 문장이다.
- 구현 작업, 기술 선택, DB 설계 내용을 쓰지 않는다.
- 잘못된 예:
  - "JWT 인증 구현"
  - "REST API 개발"
  - "DB 모델링"

5. recommendedStack
- 항상 아래 형태를 유지한다.
  - frontend: 1개 이상
  - backend: 1개 이상
  - database: 정확히 1개
  - libraries: 2개 이상
- 모두 구체적인 기술명만 사용한다.
- "N/A", "없음", "기본 스택" 금지
- 선택 프레임워크가 있으면 가능한 한 자연스럽게 반영한다.
- Developer Tool에서는 frontend에 실제 인터페이스를 적는다. 예: "CLI Interface", "VSCode Extension UI"

6. databaseSchema
- 반드시 3~5개 엔티티 배열로 작성한다.
- 각 엔티티는 반드시 아래 형태를 따른다:
  - entity: 도메인 기반 이름
  - fields: 3개 이상
  - description: 해당 엔티티가 userFlow에서 왜 필요한지 설명
- entity 이름은 "Project", "Activity", "Item", "Data", "Entity", "Result" 단독 사용 금지
- userFlow에 등장하지 않는 데이터는 만들지 않는다.

7. coreApiSpecs
- 반드시 3~6개 배열로 작성한다.
- Web/Mobile에서는 REST API 중심으로 작성한다.
  - method: GET, POST, PATCH, DELETE 중 하나
  - path: /api/... 형태
- Developer Tool에서 REST가 없으면 아래 방식 허용:
  - method: COMMAND
  - path: 실제 명령어 또는 인터페이스 시그니처
- description은 userFlow의 어떤 행동을 지원하는지 드러나야 한다.
- 같은 method + path 조합을 중복해서 쓰지 않는다.

8. mvpFeatures
- 반드시 5~7개 문자열 배열로 작성한다.
- 실제 사용 기능 중심으로 작성한다.
- "로그인", "CRUD", "대시보드"처럼 너무 뭉뚱그린 표현만 나열하지 않는다.

9. buildSteps
- 반드시 6~8개 문자열 배열로 작성한다.
- 실제 개발 순서대로 작성한다.
- 마지막 단계는 반드시 배포 또는 운영 고려 단계여야 한다.
- 선택된 난이도에 맞는 현실적인 배포 전략을 포함한다.
- Mobile App의 배포 단계에는 Expo/EAS, TestFlight, Play Console, App Store Connect 중 최소 1개 이상이 들어가야 한다.
- 고급 난이도라면 마지막 단계에 CI/CD, 로그, 모니터링 중 최소 1개 이상이 반영되어야 한다.

10. readmeDraft
- 문자열 하나로 작성한다.
- 실제 README 초안처럼 Markdown 형식으로 작성한다.
- 반드시 아래 섹션을 포함한다:
  - # 프로젝트 개요
  - ## 주요 기능
  - ## 기술 스택
  - ## 실행 방법
  - ## 배포 방법
  - ## 폴더 구조
  - ## 개선 아이디어
- "## 폴더 구조" 섹션에는 반드시 트리 구조 코드블록을 포함한다.
- 코드블록 언어는 text 또는 bash를 사용한다.
- 트리는 최소 8줄 이상 작성하고, \`├──\`, \`└──\`, \`│\` 문자를 사용한다.
- readmeDraft의 "배포 방법"은 buildSteps의 마지막 단계와 일치해야 한다.
- README는 너무 길게 늘어놓지 말고, 바로 복붙 가능한 실용적인 초안으로 작성한다.

11. interviewPoints
- 반드시 4~6개 문자열 배열로 작성한다.
- 면접에서 실제로 받을 만한 설계 질문이어야 한다.
- "왜 이 기술을 선택했는가?" 같은 너무 포괄적인 질문만 반복하지 않는다.
- 트레이드오프, 데이터 흐름, 예외 처리, 확장성 중 최소 2개 이상이 자연스럽게 드러나야 한다.

[자기 점검 - 출력에는 포함하지 말 것]
- userFlow는 4~6개인가?
- databaseSchema는 3~5개인가?
- coreApiSpecs는 3~6개인가?
- mvpFeatures는 5~7개인가?
- buildSteps는 6~8개인가?
- interviewPoints는 4~6개인가?
- 마지막 buildSteps와 readmeDraft의 배포 방법이 일치하는가?
- generic 엔티티가 없는가?
- userFlow와 무관한 기능/API/엔티티가 없는가?
- 프로젝트 유형과 난이도가 입력과 일치하는가?
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
- 마크다운 코드펜스를 절대 쓰지 않는다.
- 서론, 결론, 설명문, 사과문, 주석을 절대 추가하지 않는다.
- JSON.parse() 가능한 문자열만 출력한다.
`.trim();
}