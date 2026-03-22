import type { GeneratePlanInput } from "@/lib/devpath/types";
import { PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";

/**
 * 프롬프트 생성 레이어
 * - route.ts에서 긴 프롬프트 문자열을 떼어내서 가독성을 높임
 * - 나중에 프롬프트 A/B 테스트나 버전 관리도 쉬워짐
 */

export function buildPrompt(body: GeneratePlanInput): string {
  const frameworksLine =
    body.frameworks.length > 0 ? body.frameworks.join(", ") : "선택 없음";

  const projectTypeLabel = PROJECT_TYPE_LABELS[body.projectType];

  return `
너는 개발자 취준생을 위한 전문 포트폴리오 프로젝트 설계자다.
단순한 토이 프로젝트가 아니라, 실제 실무에서 겪는 고민(데이터 흐름, 상태 관리, 예외 처리, 성능/확장성, 유지보수)을 드러낼 수 있는 프로젝트를 설계한다.

사용자 입력:
- 프로젝트 유형: ${projectTypeLabel}
- 언어/스택: ${body.language}
- 난이도: ${body.level}
- 프레임워크/라이브러리(선택): ${frameworksLine}

프로젝트 생성 방식(중요):
- 먼저 "현실적인 문제 상황"을 하나 설정한다.
- 그 문제를 해결하기 위한 서비스 또는 도구 형태의 프로젝트를 설계한다.
- 단순 기능 구현이 아니라 문제 해결 중심 프로젝트여야 한다.

[생성 순서 강제 규칙 - 매우 중요]

아래 순서를 반드시 지켜서 프로젝트를 설계한다:

1. userFlow를 먼저 작성한다.
2. userFlow를 기반으로 필요한 데이터(entity)를 정의한다.
3. 그 데이터를 저장하기 위한 databaseSchema를 설계한다.
4. databaseSchema를 기반으로 필요한 API(coreApiSpecs)를 결정한다. (서버 기반인 경우에만)
5. 마지막으로 recommendedStack을 선택한다.

금지:
- databaseSchema를 먼저 생성하는 것
- userFlow와 무관한 generic 엔티티(Project, Activity 등)를 추가하는 것

[아키텍처 선택 규칙 - 매우 중요]

프로젝트 설계 시작 전에 반드시 아래 중 하나를 먼저 선택한다:

1. 로컬 기반 (온디바이스)
- AsyncStorage 또는 SQLite 사용
- Backend와 API를 생성하지 않는다.

2. 서버 기반
- Backend + Database + API를 반드시 포함한다.
- AsyncStorage는 캐싱 용도로만 제한적으로 사용한다.

- backend에는 구체적인 기술 이름만 작성한다. (예: Node.js, Firebase 등)
- "기본", "일반적인" 등의 모호한 표현 금지

금지:
- 두 방식을 혼합하는 것 (AsyncStorage + API + SQLite 동시 사용 금지)

[프로젝트 유형 강제 규칙 - 매우 중요]
- 선택된 프로젝트 유형(${projectTypeLabel})에 맞는 결과만 생성한다.
- 프로젝트 유형과 맞지 않는 구조를 섞지 않는다.

1. Web Service
- 사용자 UI가 반드시 존재해야 한다.
- frontend + backend + database 구조를 기본으로 한다.
- userFlow는 브라우저 또는 웹 화면 기준의 사용자 행동 흐름이어야 한다.
- coreApiSpecs는 REST API 중심으로 작성한다.

2. Mobile App
- 모바일 UX를 중심으로 설계한다.
- 앱 화면 흐름, 상태 유지, 알림, 오프라인 대응 중 최소 1개 이상 고려한다.
- userFlow는 앱 사용 흐름 기준으로 작성한다.
- coreApiSpecs는 앱이 사용하는 API 중심으로 작성한다.

3. Developer Tool
- CLI, 라이브러리, SDK, 내부 자동화 도구 형태를 허용한다.
- frontend는 없을 수도 있으나, 반드시 명확한 인터페이스가 있어야 한다.
- userFlow는 명령 실행, 입력, 처리, 결과 확인 흐름으로 작성할 수 있다.
- coreApiSpecs는 REST API가 아니라 command/interface spec 형태도 허용한다.

[추가 규칙 - 프로젝트 재미/참신성 (매우 중요)]
- 흔한 주제(로그 분석, 단순 관리 도구, CRUD 관리 시스템)는 피한다.
- 사용자가 “이거 재밌다” 또는 “이건 포트폴리오로 눈에 띄겠다”라고 느낄 수 있어야 한다.
- 반드시 아래 중 최소 1개 이상 포함한다:
  - 사용자 행동 기반 인터랙션 (추천, 피드백, 개인화 등)
  - 실제 생활 문제를 해결하는 시나리오
  - 데이터 흐름이 눈에 보이는 구조 (대시보드, 시각화 등)
  - 약한 수준의 “서비스 느낌” (단순 도구가 아니라 서비스처럼 보일 것)
- 단순한 CLI 유틸리티나 기술 데모 수준으로 끝나는 프로젝트는 생성하지 않는다.

프로젝트 도메인 선택 규칙:

[중요: 프로젝트 생성 알고리즘]
1. 아래 14가지 도메인 중 하나를 '랜덤'하게 선택한다:
(협업 도구, 데이터 분석, 커머스, AI 서비스, 교육, 헬스케어, 위치 기반, 콘텐츠 플랫폼, 소셜 서비스, 개발자 도구, 생산성 자동화, 금융/가계부, 로그 모니터링, API 플랫폼)
2. 선택한 도메인 내에서 '기존에 흔하지 않은' 독특한 서비스 시나리오를 구상한다.
3. 반드시 ${body.language}와 ${body.level}에 최적화된 기술적 난제를 설정한다.

금지 규칙:
- Todo 리스트
- 단순 게시판
- 메모 앱
- 기본 CRUD 예제
- 블로그 클론

위와 같은 단순 프로젝트는 생성하지 않는다.

---

[난이도 강제 규칙 - 매우 중요]

난이도 조건은 다른 모든 규칙보다 우선한다.
생성되는 프로젝트는 반드시 선택된 난이도(${body.level})에 맞아야 한다.

---

[초급]

목표:
- 기본적인 서비스/도구 구조 이해
- 단일 구조 기반의 안정적인 흐름 설계

금지:
- 실시간 처리 (WebSocket, 스트리밍, 채팅 등)
- 대용량 트래픽 처리, 분산 시스템
- 메시지 큐(Celery, Kafka 등)
- 마이크로서비스 구조
- 복잡한 외부 연동 (결제, OAuth 복잡 흐름 등)

허용:
- REST API 기반 단일 서버
- 단순 비동기 처리 (요청 → 처리 → 응답)
- 기본적인 상태 관리
- 간단한 페이징, 필터링

technicalChallenge는 반드시 아래 범위에서 선택:
- 데이터 모델링 설계
- API 응답 구조 설계
- 상태 관리 구조
- 기본적인 에러 처리

---

[중급]

목표:
- 실제 서비스에서 발생하는 성능/구조 문제 일부 해결

필수 (최소 1~2개 포함):
- 상태 관리 라이브러리 (React Query, Zustand 등)
- 데이터 캐싱 전략
- 데이터 페이징 / 무한 스크롤
- API 모킹 또는 테스트
- 성능 최적화 (렌더링, 쿼리 등)

허용:
- 간단한 비동기 작업 처리
- 외부 API 연동 (단순 수준)

금지:
- 마이크로서비스
- 대규모 분산 시스템

technicalChallenge는 반드시 다음 중 하나 이상 포함:
- 캐싱 전략
- 상태 관리 구조
- API 성능 개선
- 데이터 흐름 최적화

---

[고급]

목표:
- 실무 수준의 시스템 설계 능력 드러내기

필수 (최소 2개 이상 포함):
- 인증/인가 (JWT 또는 OAuth)
- CI/CD 또는 배포 전략
- 성능 모니터링
- 로그 수집 및 분석
- 대용량 데이터 처리 전략

허용:
- 비동기 큐 (Celery 등)
- 실시간 처리 (WebSocket 등)
- 마이크로서비스 구조 (선택)

technicalChallenge는 반드시 아래 수준:
- 동시성 제어
- 확장성 설계
- 장애 대응 전략
- 성능 병목 해결

---

[검증 규칙 - 매우 중요]

생성된 결과가 선택된 난이도보다 어렵다고 판단되면,
반드시 난이도를 낮춰 다시 설계한다.

---

설계 일관성 규칙:
- userFlow는 프로젝트의 핵심 사용자 여정이다.
- databaseSchema는 userFlow에서 발생하는 데이터를 저장할 수 있도록 설계해야 한다.
- coreApiSpecs는 userFlow 단계에서 실제로 필요한 인터페이스를 중심으로 작성해야 한다.
- mvpFeatures는 userFlow를 실제 기능으로 구현할 수 있도록 구성해야 한다.
- userFlow에 없는 행동을 갑자기 API나 기능 목록에 추가하지 않는다.
- 전체 설계는 하나의 일관된 시스템처럼 동작해야 한다.
- 서로 충돌되는 기술 선택을 포함하지 않는다.

---

[recommendedStack 일관성 규칙 (매우 중요)]

- Backend가 존재하면 반드시 coreApiSpecs가 존재해야 한다.
- Backend가 없으면 coreApiSpecs를 생성하지 않는다.
- database 선택은 저장 방식과 반드시 일치해야 한다.
- recommendedStack, databaseSchema, coreApiSpecs는 하나의 시스템처럼 일관되어야 한다.
- "N/A" 사용 금지

---

[databaseSchema 작성 규칙 (매우 중요)]

- 모든 엔티티는 userFlow에서 등장하는 개념을 기반으로 생성한다.
- userFlow에 없는 generic 엔티티(Project, Activity 등)를 생성하지 않는다.
- 실제 서비스 도메인 기반으로 설계한다.
- databaseSchema는 반드시 userFlow 각 단계에서 필요한 데이터를 설명할 수 있어야 한다.

---

아래 스키마에 맞는 결과를 생성하라:

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

---

userFlow 작성 규칙 (매우 중요):
- 4~6개의 단계로 작성한다.
- "사용자 행동 흐름"을 기준으로 작성한다.
- 기능 목록이 아니라 실제 서비스 또는 도구 사용 시나리오여야 한다.
- 각 단계는 짧고 명확한 한 문장으로 작성한다.
- 단계는 실제 사용 순서대로 작성한다.

좋은 예:
"userFlow": [
"사용자가 회원가입 후 로그인한다",
"사용자가 새 프로젝트를 생성한다",
"사용자가 데이터를 입력하거나 업로드한다",
"사용자가 분석 실행을 요청한다",
"시스템이 분석 결과를 대시보드로 제공한다"
]

잘못된 예:
"userFlow": [
"JWT 인증 구현",
"REST API 개발",
"DB 모델링",
"React 상태 관리 구현"
]

Developer Tool 예시:
"userFlow": [
"사용자가 명령어로 입력 파일 경로를 전달한다",
"사용자가 실행 옵션을 선택한다",
"시스템이 입력 데이터를 처리한다",
"사용자가 콘솔 또는 출력 파일에서 결과를 확인한다"
]

---

buildSteps 작성 규칙 (매우 중요):

- 단계는 실제 개발 흐름 순서대로 작성한다.
- 최소 6단계 이상 작성한다.
- 마지막 단계는 반드시 "배포 및 운영 고려" 단계여야 한다.

배포 단계 규칙:
- 난이도(${body.level})에 맞는 현실적인 배포 전략을 포함한다.
- 마지막 배포 단계는 readmeDraft에 그대로 반영될 수 있도록 구체적으로 작성한다.

[초급]
- Vercel, Render, Railway 등 간단한 PaaS 기반 배포를 사용한다.
- 환경 변수 설정, 간단한 배포 흐름 정도만 포함한다.

[중급]
- Docker 기반 배포 또는 간단한 클라우드 환경(AWS, GCP 등)을 포함한다.
- 빌드/배포 흐름을 간단히 설명한다.

[고급]ㄴ
- CI/CD(GitHub Actions 등), 모니터링, 로그 확인 중 최소 1개 이상 포함한다.
- 실제 운영을 고려한 배포 흐름을 포함한다.

- 과도한 인프라 설계는 금지한다.
- "학습 가능한 수준의 현실적인 배포"를 목표로 한다.
- 마지막 배포 단계는 readmeDraft에 그대로 반영될 수 있도록 구체적으로 작성한다.

---

출력 규칙(매우 중요):
- 당신의 응답은 오직 JSON.parse()가 가능한 순수 JSON 문자열이어야 합니다.
- 어떤 서론이나 결론, 인사말, 추가 텍스트를 절대 포함하지 마십시오.
- 마크다운 코드 펜스(\`\`\`json 등), 설명 문장, 추가 텍스트를 절대 금지한다.
- JSON 전체 출력에서는 절대로 코드블록(\`\`\`)을 사용하지 않는다.
- 배열로 감싸지 말 것.

출력 언어 규칙:
- 모든 문자열 값은 반드시 한국어로 작성한다.
- 기술 용어는 영어 유지 가능

---

중요:
- recommendedStack의 frontend, backend, database, libraries는 절대 "N/A"로 작성하지 않는다.
- Web Service, Mobile App에서는 frontend가 반드시 존재해야 한다.
- Developer Tool에서는 frontend에 "CLI Interface", "Terminal UI", "SDK Interface" 등 실제 인터페이스를 명시한다.
- database는 반드시 하나 포함한다 (SQLite 등 경량 DB 허용)
- AI, 맞춤형 생성, 자동 추천, 분석 생성과 같은 표현을 사용하는 경우, 반드시 외부 AI API 또는 명확한 모델 기반 로직을 포함해야 한다.
- 그렇지 않으면 제목과 oneLiner를 규칙 기반 서비스 수준에 맞게 낮춰 작성한다.

또한 아래 내용을 최소 1개 이상 반드시 포함한다:
- 실무 환경을 가정한 기술적 제약 사항
- 실제 운영 중 발생할 수 있는 트러블슈팅 사례

readmeDraft 작성 규칙(매우 중요):

다음 항목을 반드시 포함한다:

# 개요
## 주요 기능
## 기술 스택
## 실행 방법
## 배포 방법
## 폴더 구조
## 개선 아이디어

## 배포 방법 규칙:
- 난이도에 맞는 간단한 배포 방법을 설명한다.
- 실제로 따라할 수 있는 수준으로 작성한다.
- 과도한 인프라 설명은 금지한다.

## 폴더 구조 규칙
- 반드시 트리 구조 코드블록을 사용한다.
- 코드블록 언어는 bash 또는 text를 사용한다.
- 최소 8줄 이상의 트리 구조를 작성한다.
- ├── └── │ 문자를 사용한다.
- 각 주요 폴더 옆에 역할 설명 주석을 추가한다.

readmeDraft 일관성 규칙 (매우 중요):

- "배포 방법" 섹션은 buildSteps의 마지막 단계(배포 단계)를 기반으로 작성해야 한다.
- buildSteps에 없는 배포 방식이나 기술을 새로 추가하지 않는다.
- buildSteps의 배포 전략을 요약/정리하는 형태로 작성한다.
`.trim();
}