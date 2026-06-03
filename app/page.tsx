import Link from "next/link";

const PREVIEW_DB = [
  { entity: "Order", fields: ["id", "userId", "riderId", "status", "estimatedAt"] },
  { entity: "Rider", fields: ["id", "name", "lat", "lng", "isAvailable"] },
  { entity: "TrackingEvent", fields: ["id", "orderId", "lat", "lng", "createdAt"] },
];

const PREVIEW_API = [
  { method: "POST", path: "/api/orders", desc: "주문 생성 및 배달기사 배정" },
  { method: "GET", path: "/api/orders/:id/track", desc: "실시간 배달 위치 조회" },
  { method: "PATCH", path: "/api/riders/location", desc: "배달기사 위치 업데이트" },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-green-500/10 text-green-400 border-green-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PATCH: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

const FEATURES = [
  {
    title: "DB 스키마",
    desc: "엔티티, 필드, 관계까지 설계된 실무형 데이터베이스 구조",
  },
  {
    title: "API 명세",
    desc: "메서드·경로·설명이 포함된 RESTful API 목록 전체",
  },
  {
    title: "README 초안",
    desc: "기술 스택부터 구현 단계까지 바로 복사해서 쓸 수 있는 문서",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-28 text-center">
        <p className="mb-8 inline-block rounded-full border border-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
          AI 프로젝트 설계 생성기
        </p>

        <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          토이 프로젝트 말고,
          <br />
          <span className="text-neutral-500">실무형 포트폴리오</span>
        </h1>

        <p className="mx-auto mb-10 max-w-sm text-base leading-relaxed text-neutral-400">
          언어와 난이도를 선택하면
          <br />
          DB 설계, API 명세, README까지
          <br />
          실무 수준의 프로젝트 설계를 즉시 생성합니다.
        </p>

        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100"
        >
          시작하기
          <span aria-hidden>→</span>
        </Link>
      </section>

      {/* ── Preview Window ── */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/50">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
            <span className="ml-3 font-mono text-xs text-neutral-500">
              실시간 배달 추적 플랫폼
            </span>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            {/* DB Schema */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                DB 스키마
              </p>
              <div className="space-y-2">
                {PREVIEW_DB.map((table) => (
                  <div
                    key={table.entity}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <p className="mb-2 text-sm font-semibold text-white">
                      {table.entity}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {table.fields.map((f) => (
                        <span
                          key={f}
                          className="rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-neutral-400"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Specs */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                API 명세
              </p>
              <div className="space-y-2">
                {PREVIEW_API.map((api, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <span
                      className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold ${METHOD_COLOR[api.method] ?? ""}`}
                    >
                      {api.method}
                    </span>
                    <div>
                      <p className="font-mono text-xs text-neutral-300">
                        {api.path}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {api.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <h2 className="mb-10 text-center text-2xl font-bold">
          한 번의 생성으로 받는 것들
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <p className="mb-2 font-semibold text-white">{f.title}</p>
              <p className="text-sm leading-relaxed text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-20 text-center">
          <h2 className="mb-3 text-3xl font-bold">지금 바로 시작해보세요</h2>
          <p className="mb-8 text-sm text-neutral-400">
            취준생, 부트캠프 수료생을 위한 실무형 포트폴리오 생성기
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100"
          >
            시작하기 →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="border-t border-white/[0.06] px-6 pb-10 pt-8 text-xs leading-6 text-neutral-500">
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">개인정보처리방침</Link>
            <Link href="/refund" className="hover:text-neutral-300 transition-colors">환불정책</Link>
          </div>
          <div className="mx-auto max-w-2xl text-left">
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <p>상호명: <span className="text-neutral-300">데브패스(DevPath)</span></p>
              <p>대표자명: <span className="text-neutral-300">박세진</span></p>
              <p>사업자등록번호: <span className="text-neutral-300">225-08-95005</span></p>
              <p>통신판매업 신고번호: <span className="text-neutral-300">2026-부산사하-0269</span></p>
              <p>사업장주소: <span className="text-neutral-300">부산광역시 사하구 하신중앙로 339, 1702호(하단동)</span></p>
              <p>전화번호: <span className="text-neutral-300">010-6625-8471</span></p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} DevPath</p>
        </div>
      </div>

    </div>
  );
}
