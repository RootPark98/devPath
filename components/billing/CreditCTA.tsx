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

  return (
    <div className="mb-4 flex items-center justify-between rounded-md border p-3">
      <div className="text-sm">
        잔고: <b>{balance === null ? "…" : balance.toLocaleString()}</b>
      </div>
      <Link href="/billing" className="rounded-md border px-3 py-2 text-sm">
        크레딧 충전
      </Link>
    </div>
  );
}