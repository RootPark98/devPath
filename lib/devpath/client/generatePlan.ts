import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";
import { readApiResponse } from "@/lib/devpath/client/errors";

/**
 * 클라이언트에서 /api/generate 호출 캡슐화
 * - page.tsx는 네트워크 상세를 몰라도 됨
 * - 이후 플랜 제한/로그/공통 에러 처리 정책을 여기서 통제
 */

export type GeneratePlanInput = {
  language: Language;
  level: Level;
  frameworks: string[];
};

export async function generatePlan(input: GeneratePlanInput): Promise<GeneratedPlan> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return readApiResponse<GeneratedPlan>(res);
}
