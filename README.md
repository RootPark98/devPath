DevPath

AI 기반 포트폴리오 프로젝트 설계 도구
GitHub OAuth 로그인 + 세션 기반 인증 구조를 갖춘 확장형 웹 애플리케이션

📌 소개

DevPath는 개발자의 기술 스택과 난이도를 기반으로
AI가 포트폴리오 프로젝트 아이디어, MVP 기능, 구현 단계, README 초안까지 생성해주는 서비스입니다.

단순한 프롬프트 앱이 아니라,

인증 기반 구조

API 응답 계약 통일

클라이언트 API 레이어 분리

확장 가능한 SaaS 아키텍처

를 목표로 설계되었습니다.

🧱 기술 스택

Next.js (App Router)

TypeScript

NextAuth (GitHub OAuth)

JWT 기반 세션 전략

Gemini API

🔐 인증 구조
로그인 흐름

클라이언트에서 signIn("github") 호출

NextAuth가 GitHub OAuth 페이지로 리다이렉트

로그인 성공 후 callback 처리

NextAuth가 JWT 세션 생성

HttpOnly 쿠키를 브라우저에 저장

/api/me 요청 시 세션 복원

인증 확인 방식

DevPath는 useSession() 대신
별도의 /api/me 엔드포인트를 통해 로그인 여부를 확인합니다.

이 방식의 장점:

API 응답 형식 통일

향후 plan / quota / role 확장 대비

클라이언트 로직 단순화

응답 예시:

{
  "ok": true,
  "data": {
    "authenticated": true,
    "user": { ... }
  }
}

📦 API 응답 계약 (Contract)

모든 API는 아래 형식을 따릅니다.

성공
{
  "ok": true,
  "data": { ... }
}

실패
{
  "ok": false,
  "code": "UNAUTHENTICATED",
  "message": "로그인이 필요합니다.",
  "detail": ...
}

🧠 클라이언트 API 레이어 구조

모든 fetch 요청은 공통 응답 파서를 통해 처리됩니다.

readApiResponse()의 역할:

JSON 파싱 오류 처리

응답 계약 형식 검사

ok:false → DevPathClientError 변환

ok:true → data만 반환

예시:

const data = await generatePlan();


에러는 항상 동일한 타입으로 처리됩니다:

catch (e) {
  if (e.code === "UNAUTHENTICATED") {
    // 로그인 필요 처리
  }
}

🏗️ 프로젝트 구조
app/
  api/
    auth/[...nextauth]/route.ts
    generate/route.ts
    me/route.ts

components/devpath/
  ProjectForm.tsx
  PlanResult.tsx
  ErrorBanner.tsx
  HistoryPanel.tsx

hooks/
  useHistory.ts
  useMe.ts

lib/
  authOptions.ts
  devpath/
    api.ts
    client/
    history/
    types.ts

🔄 세션 유지 방식

JWT 기반 세션 전략

HttpOnly 쿠키 사용

브라우저 새로고침 후에도 로그인 유지

/api/me를 통한 서버 측 세션 복원

🚀 향후 확장 계획

유저별 사용량 제한 (quota)

FREE / PRO 플랜 구조

서버 측 인증 가드 강화

사용자별 히스토리 서버 저장

결제 연동

🛠️ 환경 변수
GITHUB_ID=...
GITHUB_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=...

🎯 설계 목표

DevPath는 단순한 AI 생성 도구가 아니라,

인증 기반 서비스 구조

API 계약 통일

클라이언트/서버 책임 분리

확장 가능한 SaaS 구조

를 지향합니다.