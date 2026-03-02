import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20">
      {/* Logo */}
      <header className="text-center">
        <h1 className="text-lg font-semibold tracking-tight">
          DevPath
        </h1>
      </header>

      {/* Hero */}
      <section className="mt-16 text-center space-y-6">
        <h2 className="text-4xl font-bold tracking-tight">
          프로젝트 설계, 바로 쓸 수 있게.
        </h2>

        <p className="text-sm dp-muted max-w-md mx-auto">
          구조화된 프로젝트 계획, 구현 단계, README까지 한 번에 생성하세요.
        </p>

        <div className="pt-4">
          <Link href="/app" className="dp-btn-primary px-6 py-3 text-base">
            시작하기
          </Link>
        </div>
      </section>

      {/* Minimal Feature Tease */}
      <section className="mt-20 grid gap-4 md:grid-cols-3">
        <div className="dp-card text-center">
          <div className="dp-card-title">구조화된 결과</div>
          <p className="mt-2 text-sm dp-muted">
            텍스트 덩어리가 아닌 문서형 카드 구성
          </p>
        </div>

        <div className="dp-card text-center">
          <div className="dp-card-title">바로 활용 가능</div>
          <p className="mt-2 text-sm dp-muted">
            README 복사 및 PDF/TXT 내보내기 지원
          </p>
        </div>

        <div className="dp-card text-center">
          <div className="dp-card-title">크레딧 기반</div>
          <p className="mt-2 text-sm dp-muted">
            필요한 만큼만 충전해서 사용
          </p>
        </div>
      </section>

      <footer className="mt-20 text-center text-xs dp-muted">
        © {new Date().getFullYear()} DevPath
      </footer>
    </main>
  );
}