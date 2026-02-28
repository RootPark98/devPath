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
  if (!items.length) {
    return (
      <div className="mt-6 rounded-2xl border bg-white p-5 text-sm text-neutral-500 shadow-sm">
        히스토리가 없습니다.
      </div>
    );
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">최근 생성 히스토리</h3>
          <p className="text-xs text-neutral-500">이전 결과를 빠르게 복원할 수 있어요.</p>
        </div>

        <button
          onClick={onClear}
          className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
        >
          전체 삭제
        </button>
      </div>

      {/* List */}
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {item.output.projectTitle}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => {
                    onRestore(item);
                    // 상태 반영/리렌더 다음 프레임에 스크롤
                    requestAnimationFrame(() => {
                      document.getElementById("plan-result")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    });
                  }}                  
                  className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 active:opacity-80"
                >
                  복원
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-xl border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100"
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