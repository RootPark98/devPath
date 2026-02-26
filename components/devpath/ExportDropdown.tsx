"use client";

import { useState } from "react";

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
  readmeText,
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

  const disabled = !fullText?.trim();

  return (
    <div style={{ position: "relative" }}>
      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "white",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        내보내기 ▾
      </button>

      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            width: 220,
            border: "1px solid #eee",
            borderRadius: 12,
            background: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          <button
            style={{ width: "100%", padding: 12, textAlign: "left", border: 0, background: "white" }}
            onClick={async () => {
              setOpen(false);
              await onCopyAll();
            }}
          >
            전체 복사
          </button>

          <button
            style={{ width: "100%", padding: 12, textAlign: "left", border: 0, background: "white" }}
            onClick={async () => {
              setOpen(false);
              await onCopyReadme();
            }}
          >
            README만 복사
          </button>

          <div style={{ height: 1, background: "#f2f2f2" }} />

          <button
            style={{ width: "100%", padding: 12, textAlign: "left", border: 0, background: "white" }}
            onClick={() => {
              setOpen(false);
              downloadTextFile(`${title || "devpath-plan"}.txt`, fullText);
            }}
          >
            TXT 다운로드
          </button>

          <button
            style={{ width: "100%", padding: 12, textAlign: "left", border: 0, background: "white" }}
            onClick={async () => {
              setOpen(false);
              await downloadPdf(title, fullText);
            }}
          >
            PDF 다운로드
          </button>
        </div>
      )}
    </div>
  );
}