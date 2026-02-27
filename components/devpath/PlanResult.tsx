"use client";

import ReactMarkdown from "react-markdown";
import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";

export default function PlanResult(props: {
  plan: GeneratedPlan;
  input: { language: Language; level: Level; frameworks: string[] };
  onCopyAll: () => void;
  onCopyReadme: () => void;
}) {
  const { plan, input, onCopyAll, onCopyReadme } = props;

  return (
    <section className="mx-auto mt-6 max-w-5xl px-4 pb-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold">{plan.projectTitle}</h2>
            <p className="mt-1 text-sm text-neutral-600">{plan.oneLiner}</p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={onCopyAll}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 active:opacity-80"
            >
              전체 복사
            </button>
            <button
              onClick={onCopyReadme}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100"
            >
              README만 복사
            </button>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Chip label={`Language: ${input.language}`} />
          <Chip label={`Level: ${input.level}`} />
          {input.frameworks?.map((fw) => (
            <Chip key={fw} label={fw} />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* MVP */}
        <Card title="MVP 기능">
          <ul className="space-y-2 text-sm text-neutral-800">
            {plan.mvpFeatures.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Interview */}
        <Card title="면접 포인트">
          <ul className="space-y-2 text-sm text-neutral-800">
            {plan.interviewPoints.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Steps (span 2) */}
        <div className="md:col-span-2">
          <Card title="구현 단계">
            <ol className="space-y-3 text-sm text-neutral-800">
              {plan.buildSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* README (span 2) */}
        <div className="md:col-span-2">
          <Card title="README 미리보기" rightSlot={<CopyHint />}>
            <div className="overflow-hidden rounded-xl border bg-white">
              <div className="flex items-center justify-between border-b bg-neutral-50 px-4 py-2">
                <p className="text-xs font-medium text-neutral-600">README.md</p>
                <button
                  onClick={onCopyReadme}
                  className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                >
                  복사
                </button>
              </div>

              <div className="prose prose-sm max-w-none px-4 py-4">
                <ReactMarkdown>{plan.readmeDraft}</ReactMarkdown>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  children,
  rightSlot,
}: {
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
      {label}
    </span>
  );
}

function CopyHint() {
  return <span className="text-xs text-neutral-500">미리보기는 렌더링된 결과예요</span>;
}

// "use client";

// import ReactMarkdown from "react-markdown";
// import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";

// // 이 컴포넌트는 "결과 표시 전용"
// // 👉 로직 없음
// // 👉 전달받은 plan을 렌더링만 한다

// export default function PlanResult(props: {
//   plan: GeneratedPlan;
//   input: { language: Language; level: Level; frameworks: string[] };
//   onCopyAll: () => void;
//   onCopyReadme: () => void;
// }) {
//   const { plan, onCopyAll, onCopyReadme } = props;

//   return (
//     <div style={{ marginTop: 24 }}>
//       <button style={{ marginBottom: 12, padding: "8px 10px" }} onClick={onCopyAll}>
//         전체 복사
//       </button>

//       <h2>{plan.projectTitle}</h2>
//       <p>{plan.oneLiner}</p>

//       <h3 style={{ marginTop: 16 }}>MVP 기능</h3>
//       <ul>
//         {plan.mvpFeatures.map((f, i) => (
//           <li key={i}>{f}</li>
//         ))}
//       </ul>

//       <h3 style={{ marginTop: 16 }}>구현 단계</h3>
//       <ol>
//         {plan.buildSteps.map((s, i) => (
//           <li key={i}>{s}</li>
//         ))}
//       </ol>

//       <h3 style={{ marginTop: 16 }}>README</h3>
//       <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginTop: 8 }}>
//         <ReactMarkdown>{plan.readmeDraft}</ReactMarkdown>
//       </div>

//       <button style={{ marginTop: 8, padding: "8px 10px" }} onClick={onCopyReadme}>
//         README만 복사
//       </button>

//       <h3 style={{ marginTop: 16 }}>면접 포인트</h3>
//       <ul>
//         {plan.interviewPoints.map((p, i) => (
//           <li key={i}>{p}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
