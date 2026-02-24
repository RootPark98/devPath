"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreditCTA() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/billing/credits")
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.ok) setBalance(j.data.balance);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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