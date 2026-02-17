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
        marginTop: 16,
        padding: 12,
        border: "1px solid #ffb4b4",
        borderRadius: 8,
        background: "#fff5f5",
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
