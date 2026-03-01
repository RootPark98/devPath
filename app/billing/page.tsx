import Link from "next/link";
import { BuyCreditsButton } from "@/components/billing/BuyCreditsButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

const PACKAGES = [
  {
    type: "starter" as const,
    name: "Starter",
    badge: "입문",
    desc: "가볍게 체험/1~2개 프로젝트",
    credits: 100,
    price: 5900, // TODO: 서버와 반드시 일치시켜야 함
    highlight: false,
  },
  {
    type: "pro" as const,
    name: "Pro",
    badge: "추천",
    desc: "가장 많이 선택하는 패키지",
    credits: 400,
    price: 19000, // TODO
    highlight: true,
  },
  {
    type: "max" as const,
    name: "Max",
    badge: "가성비",
    desc: "장기적으로 꾸준히 사용할 때",
    credits: 1000,
    price: 39000, // TODO
    highlight: false,
  },
];

function formatKRW(n: number) {
  return new Intl.NumberFormat("ko-KR").format(n);
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/credit");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* 🔙 Top back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-black transition"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">크레딧 구매</h1>
        <p className="text-sm text-neutral-600">
          필요한 만큼 충전하고, 프로젝트 설계를 계속 생성하세요.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">결제 안내</p>
            <p className="mt-1 text-xs text-neutral-600">
              결제 완료 후 크레딧은 자동으로 반영됩니다. (대기 화면에서 확인 가능)
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
            <span className="rounded-full bg-neutral-100 px-3 py-1">카드 결제</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1">KRW</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1">자동 적립</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PACKAGES.map((p) => {
          const unit = Math.round(p.price / p.credits); // 1 credit 당 원가(대략)
          return (
            <section
              key={p.type}
              className={[
                "rounded-2xl border bg-white p-5 shadow-sm",
                p.highlight ? "border-black shadow-md" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">{p.name}</h2>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        p.highlight ? "bg-black text-white" : "bg-neutral-100 text-neutral-700",
                      ].join(" ")}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">{p.desc}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-3xl font-bold">{p.credits} credits</div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-lg font-semibold">₩{formatKRW(p.price)}</div>
                  <div className="text-xs text-neutral-500">
                    약 ₩{formatKRW(unit)}/credit
                  </div>
                </div>

                <div className="mt-1 text-xs text-neutral-500">
                  프로젝트 생성/재생성에 사용됩니다.
                </div>
              </div>

              <div className="mt-5">
                <BuyCreditsButton
                  packageType={p.type}
                  label={p.highlight ? "가장 인기 — 구매하기" : "구매하기"}
                />
              </div>

              <ul className="mt-5 space-y-1 text-xs text-neutral-600">
                <li>• 결제 후 자동 적립</li>
                <li>• 언제든 재충전 가능</li>
                <li>• 히스토리/복원 기능과 함께 사용</li>
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-6 text-xs text-neutral-500">
        * 가격/크레딧 수량은 서버 결제 준비 API 설정과 일치해야 합니다.
      </div>
    </main>
  );
}