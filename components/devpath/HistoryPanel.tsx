"use client";

import { useState } from "react";
import type { PlanHistoryItem } from "@/lib/devpath/types";

type ConfirmState =
  | {
      type: "delete";
      targetId: string;
      title: string;
      description: string;
      confirmText: string;
    }
  | {
      type: "clear";
      title: string;
      description: string;
      confirmText: string;
    }
  | null;

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
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const scrollToResult = () => {
    requestAnimationFrame(() => {
      document.getElementById("plan-result")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmState({
      type: "delete",
      targetId: id,
      title: "히스토리를 삭제할까요?",
      description: "삭제된 히스토리는 되돌릴 수 없습니다.",
      confirmText: "삭제하기",
    });
  };

  const openClearConfirm = () => {
    setConfirmState({
      type: "clear",
      title: "전체 히스토리를 삭제할까요?",
      description: "전체 삭제 후에는 복구할 수 없습니다.",
      confirmText: "전체 삭제",
    });
  };

  const closeConfirm = () => setConfirmState(null);

  const handleConfirm = () => {
    if (!confirmState) return;

    if (confirmState.type === "delete") {
      onDelete(confirmState.targetId);
    }

    if (confirmState.type === "clear") {
      onClear();
    }

    closeConfirm();
  };

  if (!items.length) {
    return (
      <div className="mt-6 dp-card">
        <div className="text-sm dp-muted">히스토리가 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">최근 생성 히스토리</h3>
            <p className="text-xs dp-muted">이전 결과를 빠르게 복원할 수 있어요.</p>
          </div>

          <button onClick={openClearConfirm} className="dp-btn">
            전체 삭제
          </button>
        </div>

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
                    onClick={() => openDeleteConfirm(item.id)}
                    className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 dark:border-neutral-800 dark:hover:bg-red-950/30 dark:active:bg-red-950/40"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ConfirmModal
        open={!!confirmState}
        title={confirmState?.title ?? ""}
        description={confirmState?.description ?? ""}
        confirmText={confirmState?.confirmText ?? "확인"}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm leading-relaxed dp-muted">{description}</p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="dp-btn">
            취소
          </button>

          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:opacity-80"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}