"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DEVPATH_EVENTS } from "@/lib/devpath/events";

export default function CreditCTA() {
  const [balance, setBalance] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/billing/credits", { cache: "no-store" });
      const j = await r.json().catch(() => null);
      if (j?.ok) setBalance(j.data.balance);
    } catch {}
  }, []);

  useEffect(() => {
    refresh();

    const onRefresh = () => refresh();
    window.addEventListener(DEVPATH_EVENTS.creditsUpdated, onRefresh);

    return () => {
      window.removeEventListener(DEVPATH_EVENTS.creditsUpdated, onRefresh);
    };
  }, [refresh]);

  const lowBalance = balance !== null && balance <= 5;

  return (
    <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Available Credits
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                lowBalance ? "text-red-500" : "text-black"
              }`}
            >
              {balance === null ? "…" : balance.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500">credits</span>
          </div>

          {lowBalance && (
            <p className="mt-1 text-xs text-red-500">
              크레딧이 거의 소진되었습니다.
            </p>
          )}
        </div>

        {/* Right */}
        <Link
          href="/billing"
          className="
            inline-flex items-center gap-2
            rounded-xl bg-black px-4 py-2
            text-sm font-semibold text-white
            hover:opacity-90 active:opacity-80
            transition
          "
        >
          ⚡ 충전하기
        </Link>
      </div>
    </div>
  );
}