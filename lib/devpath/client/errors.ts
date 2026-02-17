import type { ApiResponse, DevPathErrorCode } from "@/lib/devpath/api";

export class DevPathClientError extends Error {
  code: DevPathErrorCode;
  status?: number;
  detail?: unknown;

  constructor(
    code: DevPathErrorCode,
    message: string,
    opts?: { status?: number; detail?: unknown }
  ) {
    super(message);
    this.name = "DevPathClientError";
    this.code = code;
    this.status = opts?.status;
    this.detail = opts?.detail;
  }
}

/**
 * fetch 응답에서 ApiResponse<T>를 안전하게 읽어 DevPathClientError로 통일
 */
export async function readApiResponse<T>(res: Response): Promise<T> {
  let payload: ApiResponse<T>;

  try {
    payload = (await res.json()) as ApiResponse<T>;
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

  if (payload.ok) return payload.data;

  throw new DevPathClientError(payload.code, payload.message, {
    status: res.status,
    detail: payload.detail,
  });
}
