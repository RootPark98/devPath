import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 pt-8 text-xs leading-6 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      <div className="space-y-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/terms" className="hover:underline">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/refund" className="hover:underline">
            환불정책
          </Link>
        </div>

        <div className="mx-auto max-w-2xl text-left">
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <p>
              상호명:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                데브패스(DevPath)
              </span>
            </p>
            <p>
              대표자명:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                박세진
              </span>
            </p>
            <p>
              사업자등록번호:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                225-08-95005
              </span>
            </p>
            <p>
              통신판매업 신고번호:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                2026-부산사하-0269
              </span>
            </p>
            <p>
              사업장주소:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                부산광역시 사하구 하신중앙로 339, 1702호(하단동)
              </span>
            </p>
            <p>
              전화번호:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                010-6625-8471
              </span>
            </p>
          </div>
        </div>

        <div>© {new Date().getFullYear()} DevPath</div>
      </div>
    </footer>
  );
}