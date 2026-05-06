/**
 * Claude 응답 파싱 레이어
 * - 기존 safeParseGeminiJson과 동일한 인터페이스
 * - Claude 응답 구조에서 텍스트 추출 후 JSON 파싱
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

/**
 * Claude API 응답 body에서 텍스트 추출
 * Gemini: json.candidates[0].content.parts[0].text
 * Claude: json.content[0].text
 */
export function extractClaudeText(json: any): string {
  return json?.content?.[0]?.text ?? "";
}

/**
 * 기존 safeParseGeminiJson과 동일하게 사용 가능
 */
export function safeParseClaudeJson(rawText: string): unknown {
  const cleaned = stripCodeFences(rawText);
  const jsonLike = extractLikelyJson(cleaned);

  try {
    const parsed = JSON.parse(jsonLike);
    return Array.isArray(parsed) ? parsed[0] ?? null : parsed;
  } catch {}

  const fallback = extractLikelyJson(cleaned);
  const parsed2 = JSON.parse(fallback);
  return Array.isArray(parsed2) ? parsed2[0] ?? null : parsed2;
}