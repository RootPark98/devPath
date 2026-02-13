"use client";

import ReactMarkdown from "react-markdown";
import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";

// 이 컴포넌트는 "결과 표시 전용"
// 👉 로직 없음
// 👉 전달받은 plan을 렌더링만 한다

export default function PlanResult(props: {
  plan: GeneratedPlan;
  input: { language: Language; level: Level; frameworks: string[] };
  onCopyAll: () => void;
  onCopyReadme: () => void;
}) {
  const { plan, onCopyAll, onCopyReadme } = props;

  return (
    <div style={{ marginTop: 24 }}>
      <button style={{ marginBottom: 12, padding: "8px 10px" }} onClick={onCopyAll}>
        전체 복사
      </button>

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

      <h3 style={{ marginTop: 16 }}>README</h3>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginTop: 8 }}>
        <ReactMarkdown>{plan.readmeDraft}</ReactMarkdown>
      </div>

      <button style={{ marginTop: 8, padding: "8px 10px" }} onClick={onCopyReadme}>
        README만 복사
      </button>

      <h3 style={{ marginTop: 16 }}>면접 포인트</h3>
      <ul>
        {plan.interviewPoints.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
