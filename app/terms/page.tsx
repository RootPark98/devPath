export const metadata = {
  title: "이용약관 | DevPath",
  description: "DevPath 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">DevPath</p>
          <h1 className="text-3xl font-bold tracking-tight">이용약관</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            시행일: 2026-03-26
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert leading-relaxed space-y-6 [&>h2]:mt-8 [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-semibold [&>p]:mt-2">
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 DevPath(이하 &quot;서비스&quot;)가 제공하는 AI 기반 프로젝트 설계 생성 서비스의
            이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>

          <h2>제2조 (서비스 내용)</h2>
          <p>서비스는 이용자가 입력한 조건을 바탕으로 프로젝트 설계, README 초안, 기술 스택 제안 등 다양한 개발 보조 결과물을 제공합니다.</p>
          <ul>
            <li>AI 기반 프로젝트 설계 결과 생성</li>
            <li>생성 결과 저장 및 히스토리 복원</li>
            <li>결제를 통한 크레딧 충전 및 사용</li>
            <li>기타 서비스 운영에 필요한 부가 기능</li>
          </ul>

          <h2>제3조 (회원가입 및 로그인)</h2>
          <p>
            이용자는 서비스가 제공하는 로그인 방식(예: 소셜 로그인)을 통해 회원가입 또는 로그인을 할 수 있습니다.
            이용자는 본인의 정확한 정보를 제공해야 하며, 타인의 정보를 도용하여 가입해서는 안 됩니다.
          </p>

          <h2>제4조 (크레딧 및 결제)</h2>
          <p>
            서비스 내 일부 기능은 유료로 제공되며, 이용자는 결제를 통해 크레딧을 충전할 수 있습니다.
            충전된 크레딧은 서비스 내 기능 이용 시 차감될 수 있습니다.
          </p>
          <ul>
            <li>크레딧의 사용 조건 및 차감 기준은 서비스 내 안내를 따릅니다.</li>
            <li>결제 완료 후 크레딧은 즉시 또는 검증 완료 후 지급될 수 있습니다.</li>
            <li>결제 및 환불에 관한 상세 내용은 환불정책 페이지를 따릅니다.</li>
          </ul>

          <h2>제5조 (이용자의 의무)</h2>
          <ul>
            <li>서비스를 부정한 방법으로 이용해서는 안 됩니다.</li>
            <li>타인의 계정 또는 결제수단을 무단으로 사용해서는 안 됩니다.</li>
            <li>서비스 운영을 방해하거나 법령에 위반되는 행위를 해서는 안 됩니다.</li>
          </ul>

          <h2>제6조 (서비스 제공의 변경 및 중단)</h2>
          <p>
            서비스는 운영상, 기술상 필요에 따라 일부 기능을 변경하거나 중단할 수 있습니다.
            다만 이용자에게 중대한 영향을 미치는 경우, 가능한 범위에서 사전 공지합니다.
          </p>

          <h2>제7조 (면책)</h2>
          <p>
            서비스가 제공하는 AI 생성 결과는 참고용이며, 정확성, 완전성, 특정 목적에의 적합성을 보장하지 않습니다.
            이용자는 생성 결과를 검토한 후 자신의 책임 하에 사용해야 합니다.
          </p>

          <h2>제8조 (지식재산권)</h2>
          <p>
            서비스 자체에 대한 저작권 및 관련 권리는 DevPath에 귀속됩니다.
            다만, 이용자가 입력한 내용 및 이를 바탕으로 생성된 결과물의 활용 책임은 이용자에게 있습니다.
          </p>

          <h2>제9조 (계정 제한 및 해지)</h2>
          <p>
            이용자가 본 약관 또는 관련 법령을 위반하는 경우, 서비스는 사전 통지 후 계정 이용을 제한하거나 해지할 수 있습니다.
          </p>

          <h2>제10조 (문의)</h2>
          <p>
            서비스 이용 중 문의가 필요한 경우, 서비스 내 안내된 문의 채널을 통해 요청할 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}