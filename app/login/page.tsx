"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Top back */}
        <div className="mb-4">
          <Link
            href="/"
            className="text-sm dp-muted hover:text-black dark:hover:text-white transition"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        {/* Card */}
        <section className="dp-card">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">DevPath 로그인</h1>
            <p className="text-sm dp-muted">GitHub 또는 Google로 로그인하세요.</p>
          </div>

          <div className="mt-8 space-y-3">
            {/* GitHub (primary) */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full dp-btn"
            >
              GitHub로 로그인
            </button>

            {/* Google (secondary) */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full dp-btn"
            >
              Google로 로그인
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs dp-muted">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            안전한 OAuth 로그인
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Footer note */}
          <p className="text-center text-xs dp-muted">
            로그인하면 DevPath 이용 약관 및 개인정보 처리 방침에 동의하게 됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}