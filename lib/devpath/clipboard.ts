/**
 * 클립보드 복사 유틸
 * - 브라우저 전용 API 사용
 * - 서버에서 호출되면 안 됨
 */

export async function copyToClipboard(text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    throw new Error("Clipboard API not available");
  }

  await navigator.clipboard.writeText(text);
}