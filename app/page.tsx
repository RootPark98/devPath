"use client";

import { useState } from "react";

type FormData = {
  stack: string;
  level: string;
}

export default function Home() {
  const [stack, setStack] = useState("");
  const [level, setLevel] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stack,
        level,
      }),
    });

    const data = await res.json();
    setResult(data.message);
  };
  
  return (
    <main style={{ padding: "40px", maxWidth: "500px" }}>
      <h1>DevPath Day 2</h1>

      <div>
        <label>개발 스택</label>
        <input
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="ex) React"
        />
      </div>

      <div style={{ marginTop: "10px"}}>
        <label>난이도</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="ex) 초급"
        />
      </div>

      <button style={{ marginTop: "20px" }} onClick={handleSubmit}>
        서버로 보내기
      </button>

      {
        result && (
          <p style={{ marginTop: "20px" }}>
            서버 응답: {result}
          </p>
        )
      }
    </main>
  );
}
