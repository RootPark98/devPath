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
            시행일: 2026-04-13
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert leading-relaxed space-y-6 [&>h2]:mt-8 [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-semibold [&>p]:mt-2 [&>ul]:mt-2 [&>ul]:list-disc [&>ul]:pl-6">
          <h2>1. 기본 원칙</h2>
          <p>
            DevPath는 서비스 내 디지털 기능 이용을 위해 포인트를 충전하여 사용하는
            형태의 서비스를 제공합니다. 충전된 포인트는 DevPath 내 서비스 이용에만
            사용할 수 있으며, 현금으로 교환되거나 사용자 간 양도될 수 없습니다.
            qqqq
          </p>

          <h2>2. 포인트의 사용 용도</h2>
          <p>
            충전된 포인트는 DevPath 내에서 프로젝트 설계 생성 등 회사가 제공하는
            유료 기능 이용 시 차감되는 방식으로 사용됩니다. 포인트는 다른 사용자에게
            판매, 대여, 양도할 수 없습니다.
          </p>

          <h2>3. 포인트 이용기간 및 환불가능기간</h2>
          <p>
            충전된 포인트의 이용기간과 환불가능기간은 각 결제 시점으로부터
            <strong> 1년 이내</strong>입니다. 해당 기간이 지난 포인트는 이용 또는
            환불이 제한될 수 있습니다.
          </p>

          <h2>4. 환불 가능 기준</h2>
          <p>
            사용자는 충전된 포인트에 대해 환불을 요청할 수 있으며, 회사는 결제 내역,
            포인트 사용 내역, 잔여 포인트 등을 확인한 후 환불 가능 여부를 판단합니다.
          </p>
          <ul>
            <li>
              충전 후 전혀 사용하지 않은 포인트는 환불가능기간 내 환불 요청이 가능합니다.
            </li>
            <li>
              충전된 포인트를 일부 또는 모두 사용한 경우에는 환불이 제한될 수 있습니다.
            </li>
          </ul>

          <h2>5. 환불 방법</h2>
          <p>
            환불은 반드시 <strong>해당 결제가 이루어졌던 동일한 결제수단</strong>으로
            진행됩니다. 별도의 계좌 송금, 현금 지급, 타인 명의 수단으로의 환불은
            불가합니다.
          </p>

          <h2>6. 환불이 제한될 수 있는 경우</h2>
          <ul>
            <li>포인트를 이미 사용한 경우</li>
            <li>환불가능기간(결제 시점부터 1년)을 경과한 경우</li>
            <li>관련 법령 또는 결제사 정책상 환불이 제한되는 경우</li>
            <li>부정 이용, 약관 위반 또는 비정상 결제가 확인되는 경우</li>
          </ul>

          <h2>7. 서비스 오류 또는 중복 결제</h2>
          <p>
            서비스 장애, 결제 오류, 중복 결제, 정상적인 기능 제공 실패 등 회사의
            책임 있는 사유가 확인되는 경우 회사는 환불, 재충전 또는 그에 준하는
            적절한 조치를 취할 수 있습니다.
          </p>

          <h2>8. 환불 요청 방법</h2>
          <p>
            환불 요청은 아래 이메일을 통해 접수할 수 있으며, 회사는 본인 확인 및
            결제 내역 확인을 위해 추가 정보를 요청할 수 있습니다.
          </p>
          <p>이메일: devpath327@gmail.com</p>

          <h2>9. 환불 처리 기간</h2>
          <p>
            환불이 승인된 경우 영업일 기준 3~5일 이내 환불 절차가 진행될 수 있습니다.
            다만 실제 환불 반영 시점은 카드사, 간편결제사, 은행 등 결제수단 처리
            일정에 따라 달라질 수 있습니다.
          </p>

          <h2>10. 기타</h2>
          <p>
            본 환불정책에 명시되지 않은 사항은 관련 법령, 결제사 정책, DevPath
            이용약관 및 운영정책에 따라 처리됩니다.
          </p>
        </div>
      </div>
    </main>
  );
}