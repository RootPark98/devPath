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
    credits: 50,
    price: 2900,
    highlight: false,
  },
  {
    type: "pro" as const,
    name: "Pro",
    badge: "추천",
    desc: "가장 많이 선택하는 패키지",
    credits: 100,
    price: 4900,
    highlight: true,
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
      {/* 🔙 Back */}
      <div className="mb-6">
        <Link href="/app" className="text-sm dp-muted hover:text-black dark:hover:text-white transition">
          ← 홈으로 돌아가기
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">크레딧 구매</h1>
        <p className="text-sm dp-muted">
          필요한 만큼 충전하고, 프로젝트 설계를 계속 생성하세요.
        </p>
      </div>

      {/* Notice */}
      <section className="dp-card mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">결제 안내</p>
            <p className="mt-1 text-xs dp-muted">
              결제 완료 후 크레딧은 자동 반영됩니다. 반영이 늦으면 메인 상단 배지에서 잔고를 확인해 주세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
              카드 결제
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
              KRW
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
              자동 적립
            </span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {PACKAGES.map((p) => {
          const unit = Math.round(p.price / p.credits);

          return (
            <section
              key={p.type}
              className={[
                "dp-card",
                p.highlight ? "ring-1 ring-black dark:ring-white" : "",
              ].join(" ")}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">{p.name}</h2>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        p.highlight
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
                      ].join(" ")}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs dp-muted">{p.desc}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-5">
                <div className="text-3xl font-bold">{p.credits} credits</div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-lg font-semibold">₩{formatKRW(p.price)}</div>
                  <div className="text-xs dp-muted">약 ₩{formatKRW(unit)}/credit</div>
                </div>

                <div className="mt-1 text-xs dp-muted">
                  프로젝트 생성/재생성에 사용됩니다.
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5">
                <BuyCreditsButton
                  packageType={p.type}
                  label={p.highlight ? "가장 인기 — 구매하기" : "구매하기"}
                />
              </div>

              {/* Perks */}
              <ul className="mt-5 space-y-1 text-xs dp-muted">
                <li>• 결제 후 자동 적립</li>
                <li>• 언제든 재충전 가능</li>
                <li>• 히스토리/복원 기능과 함께 사용</li>
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}