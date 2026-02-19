"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlanHistoryItem } from "@/lib/devpath/history";
import { readApiResponse } from "@/lib/devpath/client/errors";

type HistoryRow = {
  id: string;
  input: any;
  output: any;
  createdAt: string; // JSON 응답이라 string
};

function mapRow(row: HistoryRow): PlanHistoryItem {
  return {
    id: row.id,
    createdAt: new Date(row.createdAt).getTime(),
    input: row.input,
    output: row.output,
  };
}

export function useHistory(enabled: boolean) {
  const [items, setItems] = useState<PlanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/history", { method: "GET", cache: "no-store" });
      const rows = await readApiResponse<HistoryRow[]>(res);
      setItems(rows.map(mapRow));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const remove = useCallback(
  async (id: string) => {
    if (!enabled) return;

    // optimistic
    setItems((prev) => prev.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });

      // 서버가 JSON 계약으로 준다는 가정
      const json = await res.json().catch(() => null);

      // ✅ status + json 둘 다 체크
      if (!res.ok || !json?.ok) {
        await refresh(); // 실패면 롤백(동기화)
      }
    } catch (e) {
      console.error("fetch error:", e);
      await refresh(); // ✅ 네트워크/예외도 롤백
    }
  },
  [enabled, refresh]
);

  const clear = useCallback(async () => {
    if (!enabled) return;

    setItems([]);

    const res = await fetch("/api/history", { method: "DELETE" });
    if (!res.ok) {
      await refresh();
      return;
    }

    const json = await res.json().catch(() => null);
    if (!json?.ok) {
      await refresh();
    }
  }, [enabled, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh, remove, clear };
}
