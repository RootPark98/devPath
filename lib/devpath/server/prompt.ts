import type {
  Domain,
  GeneratePlanInput,
  Language,
  Level,
  ProjectType,
} from "@/lib/devpath/types";
import { DOMAIN_LABELS, PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";

function getDomainRule(domain: Domain): string {
  if (domain === "auto") {
    return `
[도메인 규칙]
- 도메인은 랜덤으로 고르지 않는다.
- 프로젝트 유형, 언어, 난이도, 선택 프레임워크에 가장 잘 맞는 도메인 하나를 스스로 선택한다.
- 흔한 CRUD 관리자 페이지처럼 보이지 않도록 실제 사용 맥락이 있는 시나리오를 선택한다.
`.trim();
  }

  return `
[도메인 규칙]
- 반드시 ${DOMAIN_LABELS[domain]} 도메인 안에서만 프로젝트를 설계한다.
- 다른 도메인으로 벗어나지 않는다.
- 같은 도메인 안에서도 흔한 CRUD 예제가 아니라 실제 사용 맥락이 있는 구체적인 시나리오를 선택한다.
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

function getLanguageInterpretationRule(
  projectType: ProjectType,
  language: Language,
  frameworks: string[]
): string {
  const selected = frameworks.join(", ");

  if (projectType === "web" && language === "Python") {
    return `
[언어 해석 규칙]
- 선택된 언어 "${language}"는 이 프로젝트의 주 구현 언어이며, Web Service에서는 백엔드 중심 언어로 해석한다.
- 사용자가 React/Next.js를 직접 선택하지 않았다면 frontend에 React, Redux, Next.js, Vue, Angular를 새로 추가하지 않는다.
- 이 경우 frontend는 Jinja2 Templates, HTMX, 서버 렌더링 기반 화면처럼 Python 백엔드와 자연스럽게 맞는 경량 UI로 구성한다.
- backend에는 FastAPI, Django, Flask 같은 Python 계열 기술만 사용한다.
- major framework를 임의로 추가하지 않는다.
- 현재 사용자가 선택한 프레임워크: ${selected || "선택 없음"}
`.trim();
  }

  if (projectType === "web" && language === "Java") {
    return `
[언어 해석 규칙]
- 선택된 언어 "${language}"는 이 프로젝트의 주 구현 언어이며, Web Service에서는 백엔드 중심 언어로 해석한다.
- 사용자가 별도 프론트엔드 프레임워크를 직접 선택하지 않았다면 frontend에 React, Next.js, Vue, Angular를 임의로 추가하지 않는다.
- 이 경우 frontend는 Thymeleaf, JSP, 서버 렌더링 기반 화면처럼 Java 백엔드와 자연스럽게 맞는 UI로 구성한다.
- backend에는 Spring Boot 등 Java 계열 기술만 사용한다.
`.trim();
  }

  if (projectType === "web" && language === "React/Next.js") {
    return `
[언어 해석 규칙]
- 선택된 언어/스택 "${language}"는 이 프로젝트의 프론트엔드 주 스택이다.
- frontend에는 React 또는 Next.js 계열 기술을 사용한다.
- backend는 Node.js, Next.js Route Handler, NestJS처럼 자연스럽게 연결되는 서버 기술로 작성한다.
- Python, Java 서버를 임의로 추가하지 않는다. 단, 사용자가 직접 선택한 경우는 예외다.
`.trim();
  }

  if (projectType === "mobile") {
    return `
[언어 해석 규칙]
- 선택된 언어/스택 "${language}"는 모바일 클라이언트의 주 스택이다.
- 다른 모바일 런타임을 섞지 않는다.
- 사용자가 선택하지 않은 대형 프레임워크를 임의로 추가하지 않는다.
`.trim();
  }

  if (projectType === "tool") {
    return `
[언어 해석 규칙]
- 선택된 언어 "${language}"는 도구의 주 실행 언어이자 핵심 런타임이다.
- 다른 언어 런타임을 주 구현 언어처럼 섞지 않는다.
- 선택 프레임워크가 있으면 우선 반영하되, 충돌하는 대형 프레임워크는 추가하지 않는다.
`.trim();
  }

  return `
[언어 해석 규칙]
- 선택된 언어/스택 "${language}"는 이 프로젝트의 주 구현 기술이다.
- 사용자가 선택하지 않은 대형 프레임워크를 임의로 추가하지 않는다.
- 선택 프레임워크가 있으면 가능한 한 우선 반영한다.
`.trim();
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
- 외부 API 연동 최대 1개

금지:
- WebSocket, 스트리밍, 채팅
- 메시지 큐, 이벤트 버스, Celery, Kafka
- Redis를 큐/워커 용도로 사용하는 구조
- 마이크로서비스
- 복잡한 외부 연동 2개 이상
- Docker + Nginx + Gunicorn + EC2 조합 같은 운영형 인프라
- 지속적인 추천 모델 개선, 고도화 파이프라인, 온라인 러닝 같은 운영형 ML 흐름

배포 규칙:
- Vercel, Render, Railway 등 간단한 PaaS 기반 배포를 우선한다.
- 환경 변수 설정, 기본 배포 흐름 정도만 포함한다.

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

배포 규칙:
- Docker 기반 배포 또는 간단한 클라우드 환경(AWS, GCP 등)을 포함할 수 있다.
- 그러나 인프라 설명은 짧고 학습 가능한 수준이어야 한다.

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
    body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

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
7. recommendedStack.backend, recommendedStack.database, coreApiSpecs는 항상 채운다.
8. coreApiSpecs는 비워두지 않는다. REST API가 아닌 경우에도 command/interface spec으로 작성한다.
9. "N/A", "없음", "미정", "기본 스택" 같은 placeholder 표현은 금지한다.
10. JSON 바깥에는 코드펜스를 쓰지 않는다.

${getDomainRule(body.domain)}

${getProjectTypeRule(body.projectType)}

${getLanguageInterpretationRule(
  body.projectType,
  body.language,
  body.frameworks
)}

${getDifficultyRule(body.level)}

[범위 제어 규칙]
- 초급과 중급에서는 핵심 기능 축을 과하게 늘리지 않는다.
- 하나의 프로젝트에 아래 기능 축을 3개 이상 동시에 넣지 않는다:
  - 추천/분석
  - 사용자 생성 콘텐츠 관리
  - 소셜 탐색/공유
  - 개인화 피드백 루프
  - 복잡한 운영 자동화
- 초급이라면 위 기능 축은 최대 2개까지만 허용한다.
- 초급이라면 "추천 + 사용자 플레이리스트 생성" 정도까지만 허용하고, 여기에 소셜 검색/공유/추천 개선까지 동시에 넣지 않는다.

[설계 순서 - 내부적으로만 따를 것]
1. 현실적인 사용자 문제를 하나 정한다.
2. 그 문제를 해결하는 서비스/앱/도구 시나리오를 정한다.
3. userFlow를 4~6단계로 쓴다.
4. userFlow에서 발생하는 데이터를 기준으로 databaseSchema를 만든다.
5. userFlow를 수행하기 위해 필요한 인터페이스를 coreApiSpecs로 정의한다.
6. 마지막으로 recommendedStack, mvpFeatures, buildSteps, readmeDraft, interviewPoints를 완성한다.

[정합성 규칙]
- 양면 마켓플레이스(이용자/제공자)가 포함된 서비스라면 userFlow에서 각 단계의 주어를 명확히 적는다.
- 예약자 흐름과 제공자 흐름을 섞을 경우, 실제 선행 조건이 충족되는 순서로만 작성한다.
- userFlow에 포함된 역할 수는 최대 2개까지만 허용한다.
- userFlow에 인증 단계가 없으면 로그인/회원가입 API를 coreApiSpecs에 넣지 않는다.
- userFlow에 없는 행동을 mvpFeatures나 coreApiSpecs에 새로 추가하지 않는다.
- userFlow에 등장한 핵심 행동(예: 알림, 리뷰, 수익 관리)은 databaseSchema, coreApiSpecs, mvpFeatures 중 적어도 2개 이상에 반드시 반영되어야 한다.
- 반영하지 못하는 행동은 userFlow에서 제거한다.
- mvpFeatures에 있는 기능은 반드시 userFlow의 단계와 연결되어야 한다.
- databaseSchema의 각 엔티티는 userFlow의 특정 단계와 연결되어야 한다.
- buildSteps의 마지막 배포 전략과 readmeDraft의 배포 방법은 같은 기술/플랫폼이어야 한다.
- buildSteps에는 userFlow 또는 mvpFeatures에 없는 기능 구현 단계를 추가하지 않는다.
- projectTitle, oneLiner, technicalChallenge, userFlow, mvpFeatures가 모두 같은 서비스를 설명해야 한다.
- interviewPoints는 실제로 설계된 기능과 구조만을 기반으로 작성한다.
- 결과에 없는 기술(예: Redis, Kafka, WebSocket)을 가정형 질문으로 새로 추가하지 않는다.

[필드별 출력 규칙]

1. projectTitle
- 짧지만 구체적인 프로젝트명으로 작성한다.
- 너무 일반적인 이름 금지. 예: "작업 관리 플랫폼", "데이터 시스템"

2. oneLiner
- 한 문장으로 작성한다.
- 사용자, 문제, 핵심 가치가 드러나야 한다.
- 추상적인 소개 금지
- oneLiner는 현재 설계에 실제로 포함된 기능만 기준으로 작성한다.
- 아직 구현되지 않은 추천, 조언, 개인화, 자동화 기능을 oneLiner에 추가하지 않는다.

3. technicalChallenge
- 1~2문장으로 작성한다.
- 실제 구현 중 부딪히는 핵심 기술 난제와 트레이드오프를 드러낸다.
- 너무 넓은 표현 금지
- 아래 중 최소 1개 이상 자연스럽게 드러나야 한다:
  - 실무 환경을 가정한 기술적 제약 사항
  - 실제 운영 중 발생할 수 있는 트러블슈팅 사례
- technicalChallenge는 현재 설계에 실제로 포함된 기능과 기술만 기준으로 작성한다.
- 미래 확장 계획, 장기적인 플랫폼 연동, 추상적인 확장성 일반론을 중심으로 쓰지 않는다.
- 데이터 모델, 권한 분기, 상태 갱신, 응답 구조 중 하나를 구체적으로 언급한다.

4. userFlow
- 반드시 4~6개 문자열 배열로 작성한다.
- 각 단계는 실제 사용 흐름의 짧고 명확한 한 문장이다.
- 구현 작업, 기술 선택, DB 설계 내용을 쓰지 않는다.
- 양면 서비스라면 각 단계에서 주어(예: 이용자, 제공자, 관리자)를 분명히 적는다.
- userFlow의 각 단계는 가능하면 coreApiSpecs의 최소 1개 인터페이스와 연결되어야 한다.
- 특히 업로드, 수정, 저장, 생성, 예약, 제출 같은 상태 변경 단계는 coreApiSpecs에 명시적으로 반영한다.

5. recommendedStack
- 항상 아래 형태를 유지한다.
  - frontend: 1개 이상
  - backend: 1개 이상
  - database: 정확히 1개
  - libraries: 2개 이상
- 모두 구체적인 기술명만 사용한다.
- 선택 프레임워크가 있으면 가능한 한 우선 반영한다.
- 사용자가 선택하지 않은 충돌하는 대형 프레임워크를 임의로 추가하지 않는다.
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
- 너무 뭉뚱그린 표현만 나열하지 않는다.

9. buildSteps
- 반드시 6~8개 문자열 배열로 작성한다.
- 실제 개발 순서대로 작성한다.
- 마지막 단계는 반드시 배포 또는 운영 고려 단계여야 한다.
- 선택된 난이도에 맞는 현실적인 배포 전략을 포함한다.
- 초급은 PaaS 중심, 중급은 Docker/간단한 클라우드 허용, 고급은 CI/CD·로그·모니터링을 포함할 수 있다.

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
- 선택 언어가 시스템의 주 구현 기술로 자연스럽게 반영되었는가?
- 사용자가 선택하지 않은 충돌하는 대형 프레임워크를 임의로 추가하지 않았는가?
- 난이도보다 과한 기술을 넣지 않았는가?
- userFlow는 4~6개인가?
- databaseSchema는 3~5개인가?
- coreApiSpecs는 3~6개인가?
- mvpFeatures는 5~7개인가?
- buildSteps는 6~8개인가?
- interviewPoints는 4~6개인가?
- 마지막 buildSteps와 readmeDraft의 배포 방법이 일치하는가?
- generic 엔티티가 없는가?
- userFlow와 무관한 기능/API/엔티티가 없는가?
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
