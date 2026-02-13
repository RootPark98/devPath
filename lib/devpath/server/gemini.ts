/**
 * Gemini 호출 레이어
 * - 네트워크/레이트리밋 문제(429)를 route.ts 밖으로 격리
 * - timeout(AbortController) + 429 재시도(backoff) 정책을 한 곳에서 관리
 */

type GeminiOptions = {
  apiKey: string;
  prompt: string;
  temperature?: number;
  timeoutMs?: number;   // 각 시도별 타임아웃
  maxRetries429?: number; // 429 재시도 횟수(2면 총 3회 시도)
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function callGeminiGenerateContent(opts: GeminiOptions): Promise<Response> {
  const {
    apiKey,
    prompt,
    temperature = 0.4,
    timeoutMs = 15000,
    maxRetries429 = 2,
  } = opts;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    apiKey;

  // 429 재시도 루프 (attempt: 0=최초, 1..=재시도)
  for (let attempt = 0; attempt <= maxRetries429; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature,
          },
        }),
      });

      clearTimeout(timeoutId);

      // 429면 backoff 후 재시도
      if (resp.status === 429 && attempt < maxRetries429) {
        const delay = 1000 * Math.pow(2, attempt); // 1s → 2s
        await sleep(delay);
        continue;
      }

      return resp;
    } catch (err: any) {
      clearTimeout(timeoutId);

      // 타임아웃(AbortError)을 route에서 구분 처리할 수 있게 throw
      if (err?.name === "AbortError") {
        const e = new Error("TIMEOUT");
        (e as any).code = "TIMEOUT";
        throw e;
      }

      // 그 외 네트워크/런타임 에러
      throw err;
    }
  }

  // 여기로 오면 안 오지만 타입상 안전장치
  throw new Error("UNREACHABLE");
}
