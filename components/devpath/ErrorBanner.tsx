"use client";

type Props = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
};

export default function ErrorBanner({
  title = "오류",
  message,
  actionLabel,
  onAction,
  disabled,
}: Props) {
  return (
    <div
      style={{
        background: "#ffecec",
        border: "1px solid #f5c2c2",
        padding: "12px 16px",
        borderRadius: 8,
        marginBottom: 16,
        color: "#000",   // ✅ 추가
      }}
    >
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{message}</div>

      {actionLabel && onAction && (
        <div style={{ marginTop: 10 }}>
          <button onClick={onAction} disabled={disabled}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
