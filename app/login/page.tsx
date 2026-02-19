"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ maxWidth: 520, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>DevPath 로그인</h1>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        GitHub 또는 Google로 로그인하세요.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}
        >
          GitHub로 로그인
        </button>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}
        >
          Google로 로그인
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        <Link href="/" style={{ textDecoration: "underline" }}>
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}