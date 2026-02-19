"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useMe } from "@/hooks/useMe";

type Props = {
  title?: string;
  className?: string;
};

export default function AuthHeader({ title = "DevPath", className }: Props) {
  const { me, loadingMe } = useMe();

  return (
    <div
      className={className}
      style={{
        position: "sticky",          // ✅ 상단 고정
        top: 0,
        zIndex: 50,
        background: "white",         // ✅ 스크롤 시 내용 겹침 방지
        borderBottom: "1px solid #eee",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        color: "#000",
      }}
    >
      <h1 style={{ margin: 0 }}>{title}</h1>

      {!loadingMe && me?.authenticated ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ opacity: 0.8 }}>
            {me.user?.name ?? me.user?.email ?? "로그인됨"}
          </span>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <Link href="/login" style={{ textDecoration: "underline", color: "#000" }}>
          로그인
        </Link>
      )}
    </div>
  );
}
