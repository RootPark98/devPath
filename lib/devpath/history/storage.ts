import { HISTORY_KEY, HISTORY_LIMIT, PlanHistoryItem } from "./model";

/**
 * localStorage I/O 전담 파일
 * 브라우저 전용 로직은 여기서만 다룬다.
 */

export function loadHistory(): PlanHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: PlanHistoryItem[]): PlanHistoryItem[] {
  const next = items.slice(0, HISTORY_LIMIT);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));

  return next;
}

export function clearHistoryStorage() {
  localStorage.removeItem(HISTORY_KEY);
}