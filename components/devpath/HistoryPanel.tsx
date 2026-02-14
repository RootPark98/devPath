"use client";

import type { PlanHistoryItem } from "@/lib/devpath/types";

/**
 * 최근 생성된 결과를 보여주는 패널
 * - 복원 기능
 * - 삭제 기능
 */

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
    return <div style={{ marginTop: 20, opacity: 0.6 }}>히스토리가 없습니다.</div>;
  }

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>최근 생성 히스토리</strong>
        <button onClick={onClear}>전체 삭제</button>
      </div>

      <ul style={{ marginTop: 10 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600 }}>{item.output.projectTitle}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {new Date(item.createdAt).toLocaleString()}
            </div>

            <div style={{ marginTop: 4 }}>
              <button onClick={() => onRestore(item)}>복원</button>
              <button onClick={() => onDelete(item.id)} style={{ marginLeft: 8 }}>
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
