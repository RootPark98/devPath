🚀 DevPath (데브패스)
AI 기반 주니어 개발자 전용 프로젝트 로드맵 생성 서비스

주니어 프론트엔드 개발자가 프로젝트를 시작할 때 겪는 "무엇을, 어떻게 만들어야 할까?"라는 고민을 AI(Gemini)를 통해 해결합니다. 사용자의 기술 스택과 목표에 맞춘 MVP(최소 기능 제품) 기획과 구현 로드맵을 즉시 제공합니다.

🛠 Tech Stack
Framework: Next.js 16 (App Router)

Language: TypeScript

Authentication: NextAuth.js (Google / Github)

Database: Prisma (ORM) & PostgreSQL

AI Engine: Google Gemini Pro API

Styling: Tailwind CSS

State Management: React Context API & Custom Hooks

🏗 Project Structure
프로젝트는 유지보수와 확장성을 고려하여 API 레이어와 UI 컴포넌트가 명확히 분리된 계층형 구조를 따릅니다.

Plaintext
```text
.
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # Backend API Endpoints (Auth, AI, User)
│   └── (pages)/          # UI Layouts & View Components
├── components/           # UI Components (Common, Business Logic)
├── lib/                  # 핵심 로직 및 유틸리티
│   ├── devpath/          # API Client & Business Services (Gemini 연동 등)
│   ├── auth/             # NextAuth Configuration
│   └── prisma.ts         # Prisma Client Instance
├── prisma/               # Database Schema (User, Plan, Payment)
├── types/                # TypeScript Interface & Type Definitions
└── constants/            # API Response Codes & Static Data
```

✨ Key Logic & Workflows
🔐 Secure Authentication Flow (인증 흐름)
NextAuth.js를 기반으로 소셜 로그인과 유저 세션을 안전하게 관리합니다.

로그인 요청: 유저가 Google 또는 Github 로그인을 시도합니다.

OAuth 인증: 선택한 공급자(Provider)를 통해 인증이 완료되면, NextAuth 콜백 함수가 실행됩니다.

사용자 확인 및 저장: Prisma를 통해 기존 가입 여부를 확인하고, 신규 유저일 경우 DB(User Table)에 자동으로 프로필을 생성합니다.

세션 발급: 서버 측에서 JWT 또는 데이터베이스 세션을 생성하여 브라우저에 전달합니다.

인가 가드(Authorization): 미들웨어 및 서버 컴포넌트에서 세션 유무를 판단하여 서비스 접근 권한을 제어합니다.

💳 PortOne Payment Flow (결제 프로세스 - 준비 중)
PortOne(포트원) V2 SDK를 통합하여 안정적인 결제 환경을 구축할 예정입니다.

결제 요청: 클라이언트에서 결제 금액과 주문 정보를 포함하여 PortOne SDK를 호출합니다.

결제창 팝업: 카드사, 간편결제 등 유저가 선택한 수단으로 인증을 진행합니다.

클라이언트 완료: 결제 완료 후 반환된 paymentId를 백엔드 API로 전달합니다.

Webhook 및 검증:

백엔드에서 PortOne 서버로 결제 내역 조회를 요청합니다.

실제 DB상의 주문 금액과 결제된 금액이 일치하는지 위변조 여부를 검증합니다.

최종 처리: 검증이 완료되면 Payment 테이블에 이력을 기록하고, 유저에게 프로젝트 생성 권한을 부여합니다.

🤖 AI Roadmap Generation (AI 로드맵 생성)
입력 데이터 수집: 유저로부터 기술 스택, 프로젝트 난이도, 선호하는 주제를 입력받습니다.

프롬프트 튜닝: Gemini Pro API가 이해하기 쉬운 구조화된 JSON 요청 포맷으로 변환합니다.

비동기 처리: AI의 응답을 파싱하여 실무 중심의 MVP 기능 리스트와 단계별 구현 가이드를 화면에 렌더링합니다.

🎨 Architecture Features
Custom Client Wrapper: fetch를 추상화한 클라이언트 레이어를 두어 API 통신 시 일관된 에러 처리와 인터셉터 로직을 수행합니다.

Component Modularity: UI 요소(Common)와 서비스 로직(DevPath)을 분리하여 재사용성과 가독성을 높였습니다.

Type Safety: API 요청/응답 전문에 TypeScript Interface를 적용하여 런타임 안정성을 확보했습니다.