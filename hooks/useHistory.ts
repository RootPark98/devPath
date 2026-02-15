"use client";

import { useEffect, useState } from "react";
import {
  PlanHistoryItem,
  loadHistory,
  saveHistory,
  clearHistoryStorage,
} from "@/lib/devpath/history";

/**
 * React 상태와 storage를 연결하는 훅
 * page.tsx는 이 훅만 사용하면 된다.
 */

export function useHistory() {
  const [history, setHistory] = useState<PlanHistoryItem[]>([]);

  // 최초 마운트 시 로드
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const add = (item: PlanHistoryItem) => {
    setHistory((prev) => {
      const next = saveHistory([item, ...prev]);
      return next;
    });
  };

  const remove = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveHistory(next);
      return next;
    });
  };

  const clear = () => {
    setHistory([]);
    clearHistoryStorage();
  };

  return {
    history,
    add,
    remove,
    clear,
  };
}