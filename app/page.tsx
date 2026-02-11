"use client";

import { useState } from "react";

type GeneratedPlan = {
  projectTitle: string;
  oneLiner: string;
  mvpFeatures: string[];
  buildSteps: string[];
  readmeDraft: string;
  interviewPoints: string[];
};

export default function Home() {
  const [stack, setStack] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stack, level }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "요청 실패");
      }

      const data: GeneratedPlan = await res.json();
      setPlan(data);
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>DevPath Day 3</h1>

      <div style={{ marginTop: 12 }}>
        <label>개발 스택</label>
        <input
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="ex) React, Next.js"
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>난이도</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="ex) 초급"
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </div>

      <button
        style={{ marginTop: 16 }}
        onClick={handleSubmit}
        disabled={loading || !stack || !level}
      >
        {loading ? "생성 중..." : "프로젝트 설계 생성"}
      </button>

      {error && (
        <p style={{ marginTop: 16, color: "crimson" }}>에러: {error}</p>
      )}

      {plan && (
        <div style={{ marginTop: 24 }}>
          <h2>{plan.projectTitle}</h2>
          <p>{plan.oneLiner}</p>

          <h3 style={{ marginTop: 16 }}>MVP 기능</h3>
          <ul>
            {plan.mvpFeatures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: 16 }}>구현 단계</h3>
          <ol>
            {plan.buildSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          <h3 style={{ marginTop: 16 }}>README 초안</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{plan.readmeDraft}</pre>

          <h3 style={{ marginTop: 16 }}>면접 포인트</h3>
          <ul>
            {plan.interviewPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
