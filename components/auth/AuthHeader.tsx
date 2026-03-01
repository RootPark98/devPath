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
    } catch {}
  }, []);

  useEffect(() => {
    if (loadingMe) return;

    if (!me?.authenticated) {
      setBalance(null);
      return;
    }

    refreshCredits();

    const onRefresh = () => refreshCredits();
    window.addEventListener(DEVPATH_EVENTS.creditsUpdated, onRefresh);

    return () => {
      window.removeEventListener(DEVPATH_EVENTS.creditsUpdated, onRefresh);
    };
  }, [loadingMe, me?.authenticated, refreshCredits]);

  const lowBalance = balance !== null && balance <= 5;

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b",
        "bg-white/85 backdrop-blur",
        "border-neutral-200",
        "dark:bg-neutral-950/70 dark:border-neutral-800",
        className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:opacity-80 transition"
        >
          {title}
        </Link>

        {/* Right */}
        {!loadingMe && me?.authenticated ? (
          <div className="flex items-center gap-2">
            {/* Credits badge */}
            <Link
              href="/billing"
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                "border-neutral-200 bg-white text-neutral-900",
                "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
                lowBalance
                  ? "border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
                  : "",
              ].join(" ")}
              title={
                lowBalance
                  ? "크레딧이 거의 소진되었습니다"
                  : "현재 크레딧 잔고"
              }
            >
              Credits
              <span>
                {balance === null ? "…" : balance.toLocaleString()}
              </span>
            </Link>

            {/* User */}
            <span className="hidden max-w-[200px] truncate text-sm dp-muted sm:inline">
              {me.user?.name ?? me.user?.email ?? "로그인됨"}
            </span>

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="dp-btn"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link href="/login" className="dp-btn">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}