"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            DevPath 로그인
          </h1>
          <p className="text-sm text-neutral-600">
            프로젝트 설계를 생성하려면 로그인하세요.
          </p>
        </div>

        {/* Login Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-neutral-50 active:bg-neutral-100"
          >
            GitHub로 로그인
          </button>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-neutral-50 active:bg-neutral-100"
          >
            Google로 로그인
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
          <div className="h-px flex-1 bg-neutral-200" />
          안전한 OAuth 로그인
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-500">
          로그인하면 DevPath 이용약관에 동의하게 됩니다.
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-600 underline hover:text-black"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}