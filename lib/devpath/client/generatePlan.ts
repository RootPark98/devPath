import type { ApiResponse, DevPathErrorCode } from "@/lib/devpath/api";
import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";

/**
 * 클라이언트에서 /api/generate 호출을 캡슐화하는 레이어
 * - page.tsx는 네트워크 상세를 몰라도 됨
 * - 이후 플랜 제한, 로깅, 공통 에러 처리, 재시도 정책을 여기서 통제
 */

export type GeneratePlanInput = {
  language: Language;
  level: Level;
  frameworks: string[];
};

export class DevPathClientError extends Error {
  code: DevPathErrorCode;
  status?: number;
  detail?: unknown;

  constructor(code: DevPathErrorCode, message: string, opts?: { status?: number; detail?: unknown }) {
    super(message);
    this.name = "DevPathClientError";
    this.code = code;
    this.status = opts?.status;
    this.detail = opts?.detail;
  }
}

export async function generatePlan(input: GeneratePlanInput): Promise<GeneratedPlan> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  // 서버는 항상 ApiResponse 형태로 주는 것이 목표지만,
  // 네트워크/프록시 등으로 JSON 자체가 깨질 수도 있으니 방어
  let payload: ApiResponse<GeneratedPlan>;
  try {
    payload = (await res.json()) as ApiResponse<GeneratedPlan>;
  } catch {
    throw new DevPathClientError("INTERNAL_ERROR", "서버 응답을 해석하지 못했습니다.", {
      status: res.status,
    });
  }

  if (!payload || typeof payload !== "object" || !("ok" in payload)) {
    throw new DevPathClientError("INTERNAL_ERROR", "서버 응답 형식이 올바르지 않습니다.", {
      status: res.status,
      detail: payload,
    });
  }

  if (payload.ok) {
    return payload.data;
  }

  // 에러는 code 기반으로 던짐 → page에서 UX 분기 가능
  throw new DevPathClientError(payload.code, payload.message, {
    status: res.status,
    detail: payload.detail,
  });
}
