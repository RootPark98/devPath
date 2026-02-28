// "use client";

// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import { useMe } from "@/hooks/useMe";

// type Props = {
//   title?: string;
//   className?: string;
// };

// export default function AuthHeader({ title = "DevPath", className }: Props) {
//   const { me, loadingMe } = useMe();

//   return (
//     <header
//       className={[
//         "sticky top-0 z-50 w-full",
//         "border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60",
//         className ?? "",
//       ].join(" ")}
//     >
//       <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
//         {/* Left: Brand */}
//         <div className="flex min-w-0 items-center gap-3">
//           <h1 className="truncate text-lg font-semibold tracking-tight">
//             {title}
//           </h1>
//         </div>

//         {/* Right: Auth */}
//         {!loadingMe && me?.authenticated ? (
//           <div className="flex items-center gap-2">
//             {/* User label */}
//             <span className="hidden max-w-[220px] truncate text-sm text-neutral-600 sm:inline">
//               {me.user?.name ?? me.user?.email ?? "로그인됨"}
//             </span>

//             {/* (Optional 자리) 크레딧 배지 넣기 좋은 위치 */}
//             {/* <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
//               12 credits
//             </span> */}

//             <button
//               onClick={() => signOut({ callbackUrl: "/" })}
//               className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
//             >
//               로그아웃
//             </button>
//           </div>
//         ) : (
//           <Link
//             href="/login"
//             className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
//           >
//             로그인
//           </Link>
//         )}
//       </div>
//     </header>
//   );
// }
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useMe } from "@/hooks/useMe";
import { DEVPATH_EVENTS } from "@/lib/devpath/events";

type Props = {
  title?: string;
  className?: string;
};

export default function AuthHeader({ title = "DevPath", className }: Props) {
  const { me, loadingMe } = useMe();

  const [balance, setBalance] = useState<number | null>(null);

  const refreshCredits = useCallback(async () => {
    try {
      const r = await fetch("/api/billing/credits", { cache: "no-store" });
      const j = await r.json().catch(() => null);
      if (j?.ok) setBalance(j.data.balance);
    } catch {
      // ignore
    }
  }, []);

  // 로그인 상태일 때만 잔고 조회 + 이벤트로 갱신
  useEffect(() => {
    if (loadingMe) return;
    if (!me?.authenticated) {
      setBalance(null);
      return;
    }

    refreshCredits();

    const onRefresh = () => refreshCredits();
    window.addEventListener(DEVPATH_EVENTS.creditsUpdated, onRefresh);
    return () => window.removeEventListener(DEVPATH_EVENTS.creditsUpdated, onRefresh);
  }, [loadingMe, me?.authenticated, refreshCredits]);

  const lowBalance = balance !== null && balance <= 5;

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        {/* Left: Brand */}
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>

        {/* Right: Auth + Credits */}
        {!loadingMe && me?.authenticated ? (
          <div className="flex items-center gap-2">
            {/* Credits badge */}
            <div
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                lowBalance ? "border-red-200 bg-red-50 text-red-600" : "bg-white text-neutral-800",
              ].join(" ")}
              title={lowBalance ? "크레딧이 거의 소진되었습니다" : "현재 크레딧 잔고"}
            >
              <span className="text-neutral-500">Credits</span>
              <span className={lowBalance ? "text-red-600" : "text-black"}>
                {balance === null ? "…" : balance.toLocaleString()}
              </span>
            </div>

            {/* Top-up */}
            <Link
              href="/billing"
              className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 active:opacity-80"
            >
              충전
            </Link>

            {/* User (hide on small) */}
            <span className="hidden max-w-[220px] truncate text-sm text-neutral-600 sm:inline">
              {me.user?.name ?? me.user?.email ?? "로그인됨"}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}