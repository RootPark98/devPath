export const metadata = {
  title: "환불정책 | DevPath",
  description: "DevPath 환불정책",
};

export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">DevPath</p>
          <h1 className="text-3xl font-bold tracking-tight">환불정책</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            시행일: 2026-03-26
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert leading-relaxed space-y-6 [&>h2]:mt-8 [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-semibold [&>p]:mt-2">
          <h2>1. 기본 원칙</h2>
          <p>
            DevPath는 디지털 서비스 및 크레딧 기반 기능을 제공하므로,
            결제 및 사용 여부에 따라 환불 가능 범위가 달라질 수 있습니다.
          </p>

          <h2>2. 미사용 크레딧 결제</h2>
          <p>
            결제 후 충전된 크레딧을 전혀 사용하지 않은 경우, 결제일로부터 7일 이내에 환불을 요청할 수 있습니다.
          </p>

          <h2>3. 일부 사용한 경우</h2>
          <p>
            일부 크레딧을 사용한 경우, 이미 사용된 크레딧에 대해서는 환불이 제한될 수 있습니다.
            남은 크레딧 또는 개별 사정에 따라 환불 가능 여부를 검토할 수 있습니다.
          </p>

          <h2>4. 전부 사용한 경우</h2>
          <p>
            충전된 크레딧을 모두 사용한 경우, 원칙적으로 환불이 어렵습니다.
          </p>

          <h2>5. 서비스 오류 또는 장애</h2>
          <p>
            서비스의 오류, 결제 이상, 중복 결제, 정상적인 결과 제공 실패 등 서비스 측 사유가 확인되는 경우,
            환불 또는 크레딧 재지급이 이루어질 수 있습니다.
          </p>

          <h2>6. 환불 요청 방법</h2>
          <p>
            환불 요청은 서비스 내 문의 채널 또는 별도로 안내된 고객지원 경로를 통해 접수할 수 있습니다.
            요청 시 결제 정보 확인이 필요할 수 있습니다.
          </p>

          <h2>7. 환불 처리 기간</h2>
          <p>
            환불 요청이 승인된 경우, 영업일 기준 3~5일 이내 처리될 수 있습니다.
            카드사 및 결제수단에 따라 실제 반영 시점은 달라질 수 있습니다.
          </p>

          <h2>8. 기타</h2>
          <p>
            본 환불정책에 명시되지 않은 사항은 관련 법령 및 서비스 운영 정책에 따라 처리됩니다.
          </p>
        </div>
      </div>
    </main>
  );
}