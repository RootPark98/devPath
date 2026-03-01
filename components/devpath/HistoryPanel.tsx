"use client";

import type { PlanHistoryItem } from "@/lib/devpath/types";

export default function HistoryPanel({
  items,
  onRestore,
  onDelete,
  onClear,
}: {
  items: PlanHistoryItem[];
  onRestore: (item: PlanHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}) {
  const scrollToResult = () => {
    // restore로 상태 바뀐 뒤 자연스럽게 이동
    requestAnimationFrame(() => {
      document.getElementById("plan-result")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (!items.length) {
    return (
      <div className="mt-6 dp-card">
        <div className="text-sm dp-muted">히스토리가 없습니다.</div>
      </div>
    );
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">최근 생성 히스토리</h3>
          <p className="text-xs dp-muted">이전 결과를 빠르게 복원할 수 있어요.</p>
        </div>

        <button onClick={onClear} className="dp-btn">
          전체 삭제
        </button>
      </div>

      {/* List */}
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item.id} className="dp-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {item.output.projectTitle}
                </div>
                <div className="mt-1 text-xs dp-muted">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => {
                    onRestore(item);
                    scrollToResult();
                  }}
                  className="dp-btn-primary"
                >
                  복원
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="
                    inline-flex items-center justify-center
                    rounded-xl border px-3 py-2 text-sm font-medium
                    text-red-600 hover:bg-red-50 active:bg-red-100
                    dark:border-neutral-800 dark:hover:bg-red-950/30 dark:active:bg-red-950/40
                  "
                >
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}