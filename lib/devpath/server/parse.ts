/**
 * 파싱 레이어
 * - Gemini가 "JSON만" 준다고 해도 흔들릴 수 있어서 방어
 * - 코드펜스 제거, JSON 영역 추출, 배열 wrapper 보정
 */

function stripCodeFences(text: string) {
  return String(text ?? "").replace(/```(?:json)?/gi, "").trim();
}

function extractLikelyJson(text: string) {
  const s = String(text ?? "").trim();

  const firstObj = s.indexOf("{");
  const lastObj = s.lastIndexOf("}");
  if (firstObj >= 0 && lastObj > firstObj) return s.slice(firstObj, lastObj + 1);

  const firstArr = s.indexOf("[");
  const lastArr = s.lastIndexOf("]");
  if (firstArr >= 0 && lastArr > firstArr) return s.slice(firstArr, lastArr + 1);

  return s;
}

export function safeParseGeminiJson(rawText: string): unknown {
  const cleaned = stripCodeFences(rawText);
  const jsonLike = extractLikelyJson(cleaned);

  // 1차 시도: 잘라낸 JSON 영역
  try {
    const parsed = JSON.parse(jsonLike);
    return Array.isArray(parsed) ? parsed[0] ?? null : parsed;
  } catch {}

  // 2차 시도: cleaned 전체에서 다시 추출
  const fallback = extractLikelyJson(cleaned);
  const parsed2 = JSON.parse(fallback);
  return Array.isArray(parsed2) ? parsed2[0] ?? null : parsed2;
}
