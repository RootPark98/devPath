import Link from "next/link";
import { BuyCreditsButton } from "@/components/billing/BuyCreditsButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const PACKAGES = [
  {
    type: "starter" as const,
    name: "Starter",
    credits: 50,
    price: 2900,
    highlight: false,
  },
  {
    type: "pro" as const,
    name: "Pro",
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
  const authenticated = !!session;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link
          href={authenticated ? "/app" : "/"}
          className="text-sm dp-muted hover:text-black dark:hover:text-white transition"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">크레딧 구매</h1>
        <p className="text-sm dp-muted">
          필요한 만큼 충전하고, 프로젝트 설계를 계속 생성하세요.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href="https://www.devpath.co.kr/payment-info"
            className="text-neutral-600 underline underline-offset-4 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            결제 정보 보기
          </a>
          <a
            href="https://www.devpath.co.kr/refund"
            className="text-neutral-600 underline underline-offset-4 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            환불정책 보기
          </a>
        </div>
      </div>

      {!authenticated && (
        <section className="dp-card mt-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold">로그인 안내</p>
            <p className="text-xs dp-muted">
              실제 크레딧 결제는 로그인 후 진행할 수 있습니다.
            </p>
            <div className="text-xs dp-muted">
              로그인 후 충전된 크레딧은 DevPath 내 프로젝트 설계 생성 시 사용됩니다.
            </div>
          </div>
        </section>
      )}

      <section className="dp-card mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">결제 안내</p>
            <p className="mt-1 text-xs dp-muted">
              결제 완료 후 크레딧은 자동 반영됩니다. 충전된 크레딧은 DevPath 내 프로젝트 설계 생성 시 차감되어 사용됩니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
              KRW
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
              자동 적립
            </span>
          </div>
        </div>
      </section>

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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">{p.name}</h2>
                  </div>
                </div>
              </div>

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

              <div className="mt-5">
                <BuyCreditsButton
                  packageType={p.type}
                  authenticated={authenticated}
                  label={authenticated ? "구매하기" : "로그인 후 구매"}
                />
              </div>

              <ul className="mt-5 space-y-1 text-xs dp-muted">
                <li>• 결제 후 자동 적립</li>
                <li>• 언제든 재충전 가능</li>
                <li>• 프로젝트 설계 생성 시 차감</li>
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}