/**
 * API 응답 계약(Contract) 정의
 * - 프론트/서버가 동일하게 사용
 * - 제품화(수익화)에서 "에러 코드 기반 UX"의 기반이 됨
 */

export type DevPathErrorCode =
  | "INVALID_INPUT"
  | "MISSING_API_KEY"
  | "RATE_LIMIT"
  | "TIMEOUT"
  | "UPSTREAM_ERROR"
  | "PARSE_ERROR"
  | "SCHEMA_ERROR"
  | "INTERNAL_ERROR";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  code: DevPathErrorCode;
  message: string;
  // 필요하면 디버그용으로만 사용(운영에서는 숨기는 걸 추천)
  detail?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
