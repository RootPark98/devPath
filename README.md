DevPath

«개발자 취업준비생을 위한 AI 기반 포트폴리오 프로젝트 설계 서비스»

DevPath는 사용자의 프로젝트 유형, 개발 언어, 수준, 관심 분야와 프레임워크를 바탕으로 실무형 프로젝트 설계안을 생성합니다.

단순한 프로젝트 아이디어뿐만 아니라 사용자 흐름, 데이터베이스 구조, API 명세, MVP 기능, 구현 단계와 면접 포인트를 함께 제공합니다.

🔗 "서비스 바로가기" (https://devpath.co.kr)

---

주요 기능

- 프로젝트 유형·언어·난이도·관심 분야 기반 설계안 생성
- Claude API를 활용한 2단계 프로젝트 생성
- AI 응답 JSON 파싱, 형식 보정 및 스키마 검증
- Google OAuth 로그인 및 데이터베이스 세션 관리
- 사용자별 프로젝트 생성 기록 저장·조회·삭제
- 생성 결과 피드백 및 PDF 내보내기
- 크레딧 기반 프로젝트 생성
- PortOne 결제 및 웹훅 처리

---

기술 스택

구분| 기술
Frontend / Backend| Next.js App Router, TypeScript, React
Database| PostgreSQL, Prisma
Authentication| NextAuth, Google OAuth
AI| Claude API
Payment| PortOne
Styling| Tailwind CSS
Deployment| Vercel

---

핵심 구현

AI 생성 파이프라인

핵심 프로젝트 설계를 먼저 생성한 뒤, 해당 결과를 기준으로 최종 설계안을 확장하는 2단계 파이프라인을 구성했습니다.

AI 응답은 바로 반환하지 않고 JSON 파싱, 필드 보정과 최종 스키마 검증을 거쳐 처리합니다.

Core Design 생성
        ↓
필수 필드 검증
        ↓
Final Plan 생성
        ↓
형식 보정 및 스키마 검증

크레딧 관리

현재 크레딧 잔액과 변경 이력을 각각 "CreditBalance", "CreditLedger"로 분리했습니다.

AI 호출 전 크레딧을 차감하고, 생성에 실패하면 트랜잭션을 통해 환불 이력 생성과 잔액 복구를 함께 처리합니다.

결제 처리

PortOne 결제를 연동하고 결제 요청과 상태를 "PaymentIntent"로 관리합니다.

웹훅 수신 시 실제 결제 금액을 서버에서 다시 확인하며, 웹훅 고유번호를 저장해 동일한 결제 이벤트가 중복 처리되지 않도록 구성했습니다.

사용자별 접근 제어

클라이언트에서 전달한 사용자 정보를 신뢰하지 않고, 서버에서 확인한 데이터베이스 세션의 사용자 ID를 기준으로 생성 기록과 결제 데이터를 처리합니다.

---

시스템 구조
```mermaid
flowchart TD

Next.js Client
      ↓
Next.js API Routes
      ├─ NextAuth
      ├─ Claude API
      ├─ PortOne API
      └─ Credit / History Logic
      ↓
Prisma
      ↓
PostgreSQL
```


---

개발 정보

- 개발 기간: 2026.02 ~ 2026.05
- 개발 형태: 개인 프로젝트
- 담당 범위: 기획, 화면 개발, 서버 API, 데이터베이스, 인증, 결제, 배포
- 운영 상태: 개발 및 배포 완료, 서비스 유지 중
