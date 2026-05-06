/**
 * Claude API 호출 레이어
 * - 기존 callGeminiGenerateContent를 대체
 * - Anthropic Messages API 사용
 */

type CallClaudeParams = {
  apiKey: string;
  prompt: string;
  temperature: number;
  timeoutMs: number;
  maxRetries429?: number;
};

export async function callClaudeGenerateContent(
  params: CallClaudeParams
): Promise<Response> {
  const { apiKey, prompt, temperature, timeoutMs, maxRetries429 = 2 } = params;

  let lastResp: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries429; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          temperature,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (resp.status === 429 && attempt < maxRetries429) {
        lastResp = resp;
        // 429면 잠깐 기다렸다가 재시도
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }

      return resp;
    } catch (e: any) {
      clearTimeout(timer);

      if (e?.name === "AbortError") {
        const err: any = new Error("TIMEOUT");
        err.code = "TIMEOUT";
        throw err;
      }

      throw e;
    }
  }

  return lastResp!;
}