import type {
  Domain,
  Language,
  Level,
  ProjectType,
} from "@/lib/devpath/types";
import { DOMAIN_LABELS } from "@/lib/devpath/constants";

export function getDomainRule(domain: Domain): string {
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

export function getProjectTypeRule(projectType: ProjectType): string {
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

    default:
      return `
[프로젝트 유형 규칙]
- 선택된 프로젝트 유형에 맞는 사용자 중심 서비스 구조만 설계한다.
- userFlow, recommendedStack, coreApiSpecs, buildSteps는 프로젝트 유형과 일치해야 한다.
`.trim();
  }
}

export function getLanguageInterpretationRule(
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

  return `
[언어 해석 규칙]
- 선택된 언어/스택 "${language}"는 이 프로젝트의 주 구현 기술이다.
- 사용자가 선택하지 않은 대형 프레임워크를 임의로 추가하지 않는다.
- 선택 프레임워크가 있으면 가능한 한 우선 반영한다.
`.trim();
}

export function getDifficultyRule(level: Level): string {
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

    default:
      return `
[난이도 규칙]
- 선택된 난이도에 맞는 현실적인 복잡도를 유지한다.
- 과한 기술 과시는 금지한다.
- 구현 범위는 설명 가능한 수준으로 제한한다.
`.trim();
  }
}

export function getUniversalGuardRules(): string {
  return `
[범용 현실성 규칙]
- 선택된 난이도에서 설명하기 어려운 구조보다, 단순하지만 일관된 구조를 우선한다.
- 고위험 전문 판단(의료, 법률, 정신건강 진단/치료, 투자 판단, 위기 개입)을 대체하거나 직접 제공하는 서비스를 기본 시나리오로 선택하지 않는다.
- "추천", "매칭", "개인화", "조언", "분석", "자동화"라는 표현을 사용할 때는 해당 기능의 입력 데이터, 처리 로직, 결과가 userFlow, databaseSchema, coreApiSpecs, mvpFeatures 중 최소 2개 이상에서 드러나야 한다.
- 위 조건을 만족하지 못하면 "검색", "필터링", "요약", "분류", "조회", "가이드"처럼 더 단순하고 정확한 표현으로 낮춘다.
- 외부 연동(AI API, 지도 API, 결제, 푸시 알림, 외부 데이터 연동)은 프로젝트 핵심 가치에 직접 기여하는 것 위주로 최대 1개 중심만 강하게 사용한다.
- 초급에서는 AI 분석, 전문가 연결, 예약/스케줄링, 실시간 처리, 푸시 알림을 한 프로젝트의 핵심 루프로 동시에 묶지 않는다.
- 두 가지 설계가 모두 가능할 때는 더 단순하고 설명 가능한 쪽을 선택한다.
`.trim();
}