export const metadata = {
  title: "개인정보처리방침 | DevPath",
  description: "DevPath 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">DevPath</p>
          <h1 className="text-3xl font-bold tracking-tight">개인정보처리방침</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            시행일: 2026-03-26
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert leading-relaxed space-y-6 [&>h2]:mt-8 [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-semibold [&>p]:mt-2">
          <h2>1. 수집하는 개인정보 항목</h2>
          <p>서비스는 다음과 같은 개인정보를 수집할 수 있습니다.</p>
          <ul>
            <li>로그인 정보: 이름, 이메일 주소, 프로필 이미지</li>
            <li>서비스 이용 정보: 생성한 프로젝트 결과, 히스토리, 피드백</li>
            <li>결제 관련 정보: 결제 상태, 결제 식별자, 충전 크레딧 정보</li>
            <li>기술적 정보: 접속 로그, 기기 및 브라우저 정보, 오류 기록</li>
          </ul>

          <h2>2. 개인정보의 수집 및 이용 목적</h2>
          <ul>
            <li>회원 식별 및 로그인 처리</li>
            <li>프로젝트 설계 생성 결과 제공</li>
            <li>결제 처리 및 크레딧 관리</li>
            <li>서비스 개선 및 오류 대응</li>
            <li>문의 및 환불 요청 처리</li>
          </ul>

          <h2>3. 개인정보의 보관 및 이용 기간</h2>
          <p>
            개인정보는 수집 및 이용 목적이 달성될 때까지 보관합니다.
            다만 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
          </p>

          <h2>4. 개인정보의 제3자 제공</h2>
          <p>
            서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
            다만 법령에 근거가 있거나 이용자의 동의가 있는 경우에 한해 제공할 수 있습니다.
          </p>

          <h2>5. 개인정보 처리 위탁</h2>
          <p>서비스 운영을 위해 아래와 같은 외부 서비스를 이용할 수 있습니다.</p>
          <ul>
            <li>인증 제공자: 소셜 로그인 제공 업체</li>
            <li>결제 서비스 제공자: PortOne 및 연계 결제 사업자</li>
            <li>클라우드 및 인프라 서비스 제공자</li>
          </ul>

          <h2>6. 이용자의 권리</h2>
          <p>
            이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 등을 요청할 수 있습니다.
            관련 요청은 서비스 내 문의 채널을 통해 접수할 수 있습니다.
          </p>

          <h2>7. 개인정보 보호를 위한 조치</h2>
          <p>
            서비스는 개인정보 보호를 위해 합리적인 수준의 보안 조치를 적용하며,
            인증 및 결제와 관련된 민감 정보는 직접 저장하지 않거나 최소한으로 처리합니다.
          </p>

          <h2>8. 쿠키 및 로그 정보</h2>
          <p>
            서비스는 로그인 유지, 보안, 이용 분석 등을 위해 쿠키 또는 유사한 기술을 사용할 수 있습니다.
          </p>

          <h2>9. 문의</h2>
          <p>
            개인정보와 관련한 문의는 서비스 내 안내된 문의 채널을 통해 요청할 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}