"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

import type { GeneratedPlan, PlanInput } from "@/lib/devpath/types";

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
  input: PlanInput;
  onCopyAll: () => void;
  onCopyReadme: () => void;
}) {
  const { plan, input, onCopyAll, onCopyReadme } = props;
  const userFlow = Array.isArray(plan.userFlow) ? plan.userFlow : [];

  return (
    <section id="plan-result" className="mx-auto mt-6 max-w-6xl px-4 pb-16">
      <header id="overview" className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
              DevPath Generated Plan
            </div>

            <h2 className="text-3xl font-bold tracking-tight">{plan.projectTitle}</h2>
            <p className="max-w-3xl text-sm leading-relaxed dp-muted">{plan.oneLiner}</p>
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

        <div className="flex flex-wrap gap-2">
          <Chip label={`Language: ${input.language}`} />
          <Chip label={`Level: ${input.level}`} />
          {input.frameworks?.map((fw) => (
            <Chip key={fw} label={fw} />
          ))}
        </div>
      </header>

      <SectionNav />

      <div className="mt-8 space-y-6">
        <Card id="flow" title="사용자 흐름" subtitle="이 서비스가 실제로 어떻게 사용되는지 보여주는 핵심 시나리오입니다.">
          {userFlow.length > 0 ? (
            <Timeline steps={userFlow} />
          ) : (
            <EmptyState text="사용자 흐름 정보가 아직 없습니다." />
          )}
        </Card>

        <Card id="challenge" title="기술적 난제" subtitle="이 프로젝트가 포트폴리오로서 가치 있는 이유를 보여주는 핵심 문제입니다.">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
            <p className="text-sm leading-7">{plan.technicalChallenge}</p>
          </div>
        </Card>

        <Card id="architecture" title="Architecture" subtitle="사용자 흐름을 구현하기 위해 필요한 기술 스택, 데이터 구조, API 설계를 정리했습니다.">
          <div className="space-y-8">
            <div>
              <SectionLabel>Stack</SectionLabel>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <SubCard title="Frontend">
                  <TagList items={plan.recommendedStack.frontend} />
                </SubCard>

                <SubCard title="Backend">
                  <TagList items={plan.recommendedStack.backend} />
                </SubCard>

                <SubCard title="Database">
                  <div className="flex flex-wrap gap-2">
                    <Chip label={plan.recommendedStack.database} />
                  </div>
                </SubCard>

                <SubCard title="Libraries">
                  <TagList items={plan.recommendedStack.libraries} />
                </SubCard>
              </div>
            </div>

            <Divider />

            <div>
              <SectionLabel>Database Schema</SectionLabel>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {plan.databaseSchema.map((item, i) => (
                  <SubCard key={`${item.entity}-${i}`} title={item.entity}>
                    <p className="text-sm leading-relaxed dp-muted">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.fields.map((field, idx) => (
                        <FieldChip key={`${field}-${idx}`} label={field} />
                      ))}
                    </div>
                  </SubCard>
                ))}
              </div>
            </div>

            <Divider />

            <div>
              <SectionLabel>Core API Specs</SectionLabel>
              <div className="mt-4 space-y-3">
                {plan.coreApiSpecs.map((api, i) => (
                  <div
                    key={`${api.method}-${api.path}-${i}`}
                    className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <MethodBadge method={api.method} />
                      <code className="rounded-md bg-neutral-100 px-2 py-1 text-sm font-medium dark:bg-neutral-800">
                        {api.path}
                      </code>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">{api.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <section id="implementation" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card title="MVP 기능" subtitle="최소 기능 범위 안에서도 기술적 설계 의도를 드러낼 수 있어야 합니다.">
            <BulletList items={plan.mvpFeatures} />
          </Card>

          <Card title="면접 포인트" subtitle="실무형 프로젝트로 설명할 때 바로 연결될 수 있는 질문들입니다.">
            <BulletList items={plan.interviewPoints} />
          </Card>
        </section>

        <Card title="구현 단계" subtitle="실제 개발 흐름에 맞춰 어떤 순서로 구현할지 정리했습니다.">
          <StepList items={plan.buildSteps} />
        </Card>

        <Card id="readme" title="README 미리보기" subtitle="GitHub에 바로 붙여 넣을 수 있는 형태의 초안입니다." rightSlot={<CopyHint />}>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
              <p className="text-xs font-medium dp-muted">README.md</p>

              <button onClick={onCopyReadme} className="dp-btn">
                복사
              </button>
            </div>

            <div className="prose prose-sm max-w-none px-5 py-5 dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {fixFolderTree(plan.readmeDraft)}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function SectionNav() {
  const items = [
    { href: "#overview", label: "Overview" },
    { href: "#flow", label: "User Flow" },
    { href: "#challenge", label: "Challenge" },
    { href: "#architecture", label: "Architecture" },
    { href: "#implementation", label: "Implementation" },
    { href: "#readme", label: "README" },
  ];

  return (
    <nav className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white/85 px-3 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="flex min-w-max gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function Card({
  id,
  title,
  subtitle,
  children,
  rightSlot,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          {subtitle ? <p className="text-sm dp-muted">{subtitle}</p> : null}
        </div>
        {rightSlot}
      </div>

      {children}
    </section>
  );
}

function SubCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-neutral-100">
        {children}
      </h4>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />;
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
      {label}
    </span>
  );
}

function FieldChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:text-neutral-200">
      {label}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="rounded-md bg-neutral-900 px-2 py-1 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
      {method}
    </span>
  );
}

function CopyHint() {
  return <span className="text-xs dp-muted">미리보기는 렌더링된 결과예요</span>;
}

function Timeline({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={`${step}-${i}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
              {i + 1}
            </div>
            {i !== steps.length - 1 ? (
              <div className="mt-1 h-8 w-px bg-neutral-300 dark:bg-neutral-700" />
            ) : null}
          </div>

          <div className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/40">
            <p className="text-sm leading-relaxed">{step}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StepList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-4 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-xs font-semibold dark:border-neutral-800">
            {i + 1}
          </span>
          <div className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <span className="leading-relaxed">{item}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <Chip key={`${item}-${i}`} label={item} />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-5 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
      {text}
    </div>
  );
}