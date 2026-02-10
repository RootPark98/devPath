"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/hello");
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>DevPath Day 1</h1>

      <button onClick={handleClick}>
        서버에 요청 보내기
      </button>

      {message && (
        <p style={{ marginTop: "20px" }}>
          서버 응답: {message}
        </p>
      )}
    </main>
  );
}
