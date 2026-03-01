"use client";

import { useEffect, useRef, useState } from "react";

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function downloadPdf(title: string, text: string) {
  const res = await fetch("/api/devpath/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text }),
  });
  if (!res.ok) throw new Error("PDF 생성 실패");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title || "devpath-plan"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ExportDropdown({
  title,
  fullText,
  readmeText, // (현재 드롭다운에서는 직접 사용 안 하지만 props 유지)
  onCopyAll,
  onCopyReadme,
}: {
  title: string;
  fullText: string;
  readmeText: string;
  onCopyAll: () => Promise<void>;
  onCopyReadme: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const disabled = !fullText?.trim();

  // ✅ outside click 닫기 + ESC 닫기
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={[
          disabled ? "opacity-60 cursor-not-allowed" : "",
          "dp-btn",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        내보내기 <span className="text-xs">▾</span>
      </button>

      {open && !disabled && (
        <div
          role="menu"
          className="
            absolute right-0 mt-2 w-56 overflow-hidden
            rounded-2xl border bg-white shadow-lg
            border-neutral-200
            dark:border-neutral-800 dark:bg-neutral-950
            z-50
          "
        >
          <MenuButton
            onClick={async () => {
              close();
              await onCopyAll();
            }}
          >
            전체 복사
          </MenuButton>

          <MenuButton
            onClick={async () => {
              close();
              await onCopyReadme();
            }}
          >
            README만 복사
          </MenuButton>

          <div className="h-px bg-neutral-100 dark:bg-neutral-900" />

          <MenuButton
            onClick={() => {
              close();
              downloadTextFile(`${title || "devpath-plan"}.txt`, fullText);
            }}
          >
            TXT 다운로드
          </MenuButton>

          <MenuButton
            onClick={async () => {
              close();
              await downloadPdf(title, fullText);
            }}
          >
            PDF 다운로드
          </MenuButton>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="
        w-full px-4 py-3 text-left text-sm font-medium
        text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100
        dark:text-neutral-100 dark:hover:bg-neutral-900/60 dark:active:bg-neutral-900
      "
    >
      {children}
    </button>
  );
}