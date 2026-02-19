import { NextResponse } from "next/server";
import type { ApiResponse, DevPathErrorCode } from "@/lib/devpath/api";

export function apiOk<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { ok: true, data };
  return NextResponse.json(body, { status });
}

export function apiErr(
  code: DevPathErrorCode,
  message: string,
  status = 400,
  detail?: unknown
) {
  const body: ApiResponse<never> = { ok: false, code, message, detail };
  return NextResponse.json(body, { status });
}