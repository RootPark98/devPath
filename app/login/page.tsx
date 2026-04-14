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
            href="/app"
            className="text-sm dp-muted hover:text-black dark:hover:text-white transition"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        {/* Card */}
        <section className="dp-card">
          {/* Title */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              DevPath 시작하기
            </h1>
            <p className="text-sm dp-muted">
              로그인 후 바로 프로젝트 설계를 생성할 수 있어요.
            </p>
          </div>

          {/* Google Login */}
          <div className="mt-8">
            <button
              onClick={() => signIn("google", { callbackUrl: "/app" })}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <GoogleIcon />
              Google로 시작하기
            </button>
          </div>

          {/* Footer note */}
          {/* <p className="text-center text-xs dp-muted">
            로그인하면 DevPath 이용 약관 및 개인정보 처리 방침에 동의하게 됩니다.
          </p> */}
        </section>
      </div>
    </main>
  );
}

/* Google SVG */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.82 2.73 30.27 0 24 0 14.64 0 6.54 5.48 2.69 13.44l7.98 6.2C12.5 13.5 17.8 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.23 5.46-4.75 7.14l7.3 5.66C43.98 37.6 46.5 31.6 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.67 28.64a14.5 14.5 0 010-9.28l-7.98-6.2a24 24 0 000 21.68l7.98-6.2z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.3-5.66c-2.03 1.36-4.64 2.18-8.61 2.18-6.2 0-11.5-4-13.33-9.64l-7.98 6.2C6.54 42.52 14.64 48 24 48z"
      />
    </svg>
  );
}