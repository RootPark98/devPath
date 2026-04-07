import Link from "next/link";

export const metadata = {
  title: "결제 정보 | DevPath",
  description: "DevPath 크레딧 상품 및 결제 정보 안내",
};

const PACKAGES = [
  {
    type: "starter",
    name: "Starter",
    credits: 50,
    price: 2900,
    description: "프로젝트 생성/재생성에 사용할 수 있는 기본 크레딧 패키지",
  },
  {
    type: "pro",
    name: "Pro",
    credits: 100,
    price: 4900,
    description: "더 넉넉하게 사용할 수 있는 크레딧 패키지",
  },
] as const;

function formatKRW(n: number) {
  return new Intl.NumberFormat("ko-KR").format(n);
}

export default function PaymentInfoPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">DevPath</p>
          <h1 className="text-3xl font-bold tracking-tight">결제 정보</h1>
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            DevPath는 개발자 취업 준비자를 위한 AI 기반 프로젝트 설계 서비스입니다.
            사용자는 크레딧을 충전한 뒤 프로젝트 생성 및 재생성 기능에 사용할 수 있습니다.
          </p>
        </div>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold">상품/서비스 안내</h2>
          <div className="space-y-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            <p>
              - 판매 상품: <strong>DevPath 크레딧 충전 상품</strong>
            </p>
            <p>
              - 서비스 형태: <strong>디지털 웹서비스(SaaS)</strong>
            </p>
            <p>
              - 이용 방식: <strong>결제 완료 후 크레딧 자동 반영</strong>
            </p>
            <p>
              - 실물 배송 여부: <strong>없음</strong>
            </p>
            <p>
              - 사용처: <strong>프로젝트 생성/재생성 기능 이용</strong>
            </p>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold">판매 중인 상품</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PACKAGES.map((p) => {
              const unit = Math.round(p.price / p.credits);

              return (
                <div
                  key={p.type}
                  className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"
                >
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <div className="mt-3 text-3xl font-bold">{p.credits} credits</div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <div className="text-lg font-semibold">₩{formatKRW(p.price)}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      약 ₩{formatKRW(unit)}/credit
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold">결제 및 환불 안내</h2>
          <div className="space-y-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            <p>
              - 결제수단: <strong>간편결제</strong>
            </p>
            <p>
              - 결제통화: <strong>KRW</strong>
            </p>
            <p>
              - 크레딧은 결제 완료 후 자동 반영됩니다.
            </p>
            <p>
              - 크레딧을 전혀 사용하지 않은 경우, 결제일로부터 7일 이내 이메일 문의 시 환불을 요청할 수 있습니다.
            </p>
            <p>
              - 크레딧을 일부 또는 전부 사용한 경우 환불은 불가합니다.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">문의 및 정책</h2>
          <div className="space-y-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            <p>환불 문의 이메일: devpath327@gmail.com</p>
            <p>
                <a
                    href="https://www.devpath.co.kr/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                >
                    환불정책
                </a>
            </p>

            <p>
                <a
                    href="https://www.devpath.co.kr/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                >
                    실제 구매 페이지
                </a>
                <span className="ml-1 text-neutral-500 dark:text-neutral-400">
                    (로그인 후 이용 가능)
                </span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}