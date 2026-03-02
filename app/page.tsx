// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          DevPath
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="dp-btn">로그인</Link>
          <Link href="/app" className="dp-btn-primary">시작하기</Link>
        </div>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            프로젝트 설계, 문서처럼 “바로 쓸 수 있게”
          </h1>
          <p className="text-sm dp-muted">
            DevPath는 프로젝트 구조, MVP, 구현 단계, README까지 한 번에 생성해줍니다.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link href="/app" className="dp-btn-primary">무료로 시작하기</Link>
            <Link href="/billing" className="dp-btn">크레딧 구매</Link>
          </div>

          <p className="text-xs dp-muted">
            로그인 후 사용 가능합니다.
          </p>
        </div>

        <div className="dp-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="dp-card-title">예시 결과</h3>
            <span className="text-xs dp-muted">문서형 카드</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="font-semibold">프로젝트 개요</div>
              <div className="mt-1 dp-muted">
                간단한 한 줄 설명 + 핵심 목표
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="font-semibold">구현 단계</div>
              <div className="mt-1 dp-muted">
                1) 세팅 → 2) 핵심 기능 → 3) 배포
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="font-semibold">README</div>
              <div className="mt-1 dp-muted">
                그대로 복사/다운로드 가능한 템플릿
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="dp-card">
          <div className="dp-card-title">구조화된 결과</div>
          <p className="mt-2 text-sm dp-muted">텍스트 덩어리 대신 카드/섹션으로 제공합니다.</p>
        </div>
        <div className="dp-card">
          <div className="dp-card-title">다음 행동 유도</div>
          <p className="mt-2 text-sm dp-muted">README 복사/Export/깃헙 적용까지 흐름이 이어집니다.</p>
        </div>
        <div className="dp-card">
          <div className="dp-card-title">크레딧 기반</div>
          <p className="mt-2 text-sm dp-muted">남은 크레딧을 확인하고 필요한 만큼 충전합니다.</p>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs dp-muted">
        © {new Date().getFullYear()} DevPath
      </footer>
    </main>
  );
}