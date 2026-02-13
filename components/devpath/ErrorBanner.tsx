"use client";

// 에러 UI만 담당하는 순수 프레젠테이션 컴포넌트
// 👉 역할: 에러 메시지를 화면에 보여주는 것만

export default function ErrorBanner({ message }: { message: string }) {
  return <p style={{ marginTop: 16, color: "crimson" }}>에러: {message}</p>;
}