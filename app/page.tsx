import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20">
      {/* Logo */}
      <header className="text-center">
        <h1 className="text-lg font-semibold tracking-tight">
          DevPathtest
        </h1>
      </header>

      {/* Hero */}
      <section className="mt-16 text-center space-y-6">
        <h2 className="text-4xl font-bold tracking-tight leading-tight">
          토이 프로젝트 말고,
          <br />
          <span className="text-neutral-400">
            실무형 포트폴리오를 만드세요.
          </span>
        </h2>

        <p className="text-sm dp-muted max-w-lg mx-auto leading-relaxed">
          DevPath는 단순 아이디어가 아니라
          <br />
          실제 서비스 수준의 프로젝트 설계를 생성합니다.
          <br />
          DB 구조, API, 구현 단계, README까지 한 번에 제공합니다.
        </p>

        <div className="pt-4">
          <Link href="/app" className="dp-btn-primary px-6 py-3 text-base">
            시작하기
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-20 space-y-6">
        <h3 className="text-center text-lg font-semibold">
          이렇게 만들어집니다
        </h3>

        <div className="grid gap-4 md:grid-cols-3 text-center">
          <div className="dp-card">
            <div className="dp-card-title">입력</div>
            <p className="mt-2 text-sm dp-muted">
              언어, 난이도, 스택 선택
            </p>
          </div>

          <div className="dp-card">
            <div className="dp-card-title">생성</div>
            <p className="mt-2 text-sm dp-muted">
              AI가 실무형 프로젝트 설계 생성
            </p>
          </div>

          <div className="dp-card">
            <div className="dp-card-title">바로 활용</div>
            <p className="mt-2 text-sm dp-muted">
              README, 구조, API까지 그대로 사용
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 grid gap-4 md:grid-cols-3">
        <div className="dp-card text-center">
          <div className="dp-card-title">실무형 설계</div>
          <p className="mt-2 text-sm dp-muted">
            CRUD 토이가 아닌 실제 문제 해결 중심 프로젝트
          </p>
        </div>

        <div className="dp-card text-center">
          <div className="dp-card-title">구조화된 결과</div>
          <p className="mt-2 text-sm dp-muted">
            DB, API, 흐름까지 연결된 설계 문서
          </p>
        </div>

        <div className="dp-card text-center">
          <div className="dp-card-title">바로 사용 가능</div>
          <p className="mt-2 text-sm dp-muted">
            README 복사 및 포트폴리오 활용 가능
          </p>
        </div>
      </section>

      <footer className="mt-20 text-center text-xs dp-muted space-y-3">
        <div className="flex justify-center gap-4">
          <Link href="/terms" className="hover:underline">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/refund" className="hover:underline">
            환불정책
          </Link>
        </div>

        <div>
          © {new Date().getFullYear()} DevPath
        </div>
      </footer>
    </main>
  );
}