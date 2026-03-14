"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";
import remarkBreaks from "remark-breaks";

function fixFolderTree(md: string) {
  return md.replace(
    /##\s*폴더 구조\s*\n([\s\S]*?)(\n##\s|$)/,
    (match, body, tail) => {
      const trimmed = String(body).trim();
      if (trimmed.startsWith("```")) return match;
      return `## 폴더 구조\n\n\`\`\`text\n${trimmed}\n\`\`\`\n${tail === "$" ? "" : tail}`;
    }
  );
}

export default function PlanResult(props: {
  plan: GeneratedPlan;
  input: { language: Language; level: Level; frameworks: string[] };
  onCopyAll: () => void;
  onCopyReadme: () => void;
}) {
  const { plan, input, onCopyAll, onCopyReadme } = props;

  return (
    <section id="plan-result" className="mx-auto mt-6 max-w-5xl px-4 pb-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold">{plan.projectTitle}</h2>
            <p className="mt-1 text-sm dp-muted">{plan.oneLiner}</p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button onClick={onCopyAll} className="dp-btn-primary">
              전체 복사
            </button>
            <button onClick={onCopyReadme} className="dp-btn">
              README만 복사
            </button>
          </div>
        </div>

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
        {/* Technical Challenge */}
        <Card title="기술적 난제">
          <p className="text-sm leading-relaxed">{plan.technicalChallenge}</p>
        </Card>

        {/* Recommended Stack */}
        <Card title="추천 기술 스택">
          <div className="space-y-4 text-sm">
            <StackGroup label="Frontend" items={plan.recommendedStack.frontend} />
            <StackGroup label="Backend" items={plan.recommendedStack.backend} />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide dp-muted">
                Database
              </p>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                {plan.recommendedStack.database}
              </span>
            </div>
            <StackGroup label="Libraries" items={plan.recommendedStack.libraries} />
          </div>
        </Card>

        {/* Database Schema */}
        <Card title="데이터베이스 설계">
          <div className="space-y-3">
            {plan.databaseSchema.map((item, i) => (
              <div
                key={`${item.entity}-${i}`}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold">{item.entity}</h4>
                </div>
                <p className="mt-1 text-xs dp-muted">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.fields.map((field, idx) => (
                    <Chip key={`${field}-${idx}`} label={field} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Core API Specs */}
        <Card title="핵심 API 설계">
          <div className="space-y-3">
            {plan.coreApiSpecs.map((api, i) => (
              <div
                key={`${api.method}-${api.path}-${i}`}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    {api.method}
                  </span>
                  <code className="text-sm font-medium">{api.path}</code>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{api.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* MVP */}
        <Card title="MVP 기능">
          <ul className="space-y-2 text-sm">
            {plan.mvpFeatures.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-50" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Interview */}
        <Card title="면접 포인트">
          <ul className="space-y-2 text-sm">
            {plan.interviewPoints.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-50" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Steps */}
        <div className="md:col-span-2">
          <Card title="구현 단계">
            <ol className="space-y-3 text-sm">
              {plan.buildSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-xs font-semibold dark:border-neutral-800">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* README */}
        <div className="md:col-span-2">
          <Card title="README 미리보기" rightSlot={<CopyHint />}>
            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-950/40">
                <p className="text-xs font-medium dp-muted">README.md</p>

                <button onClick={onCopyReadme} className="dp-btn">
                  복사
                </button>
              </div>

              <div className="prose prose-sm max-w-none px-4 py-4 dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {fixFolderTree(plan.readmeDraft)}
                </ReactMarkdown>
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
    <section className="dp-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="dp-card-title">{title}</h3>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
      {label}
    </span>
  );
}

function CopyHint() {
  return <span className="text-xs dp-muted">미리보기는 렌더링된 결과예요</span>;
}

function StackGroup({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide dp-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Chip key={`${label}-${item}-${i}`} label={item} />
        ))}
      </div>
    </div>
  );
}