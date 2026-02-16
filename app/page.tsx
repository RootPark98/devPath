"use client";

import { useState } from "react";
import ProjectForm from "@/components/devpath/ProjectForm";
import PlanResult from "@/components/devpath/PlanResult";
import ErrorBanner from "@/components/devpath/ErrorBanner";
import HistoryPanel from "@/components/devpath/HistoryPanel";

import { copyToClipboard } from "@/lib/devpath/clipboard";
import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";
import { generatePlan, DevPathClientError } from "@/lib/devpath/client/generatePlan";
import { FRAMEWORKS_BY_LANGUAGE } from "@/lib/devpath/constants";

import { useHistory } from "@/hooks/useHistory";
import type { PlanHistoryItem } from "@/lib/devpath/history";

/**
 * Home은 프론트의 "컨트롤 타워"
 * - 상태 관리
 * - API 호출
 * - 히스토리 관리
 * - UI 컴포넌트 조립
 */

export default function Home() {
  // 입력 상태
  const [language, setLanguage] = useState<Language>("React/Next.js");
  const [level, setLevel] = useState<Level>("초급");
  const [frameworks, setFrameworks] = useState<string[]>([]);

  // UX 상태
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { history, add, remove, clear } = useHistory();

  // 언어 변경 시, 허용되지 않는 프레임워크 제거
  const handleLanguageChange = (next: Language) => {
    setLanguage(next);
    const nextSet = new Set(FRAMEWORKS_BY_LANGUAGE[next]);
    setFrameworks((prev) => prev.filter((f) => nextSet.has(f)));
  };

  // 프레임워크 토글
  const toggleFramework = (name: string) => {
    setFrameworks((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  // AI 호출
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
    const data = await generatePlan({ language, level, frameworks });

    setPlan(data);

    const item: PlanHistoryItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      input: { language, level, frameworks },
      output: data,
    };

    add(item);
    } catch (e: any) {
      // ✅ 이제부터 “문자열”이 아니라 “코드”로 분기 가능
      if (e instanceof DevPathClientError) {
        // (지금은 메시지만 노출) — 다음 단계에서 code별 UX를 강화하면 됨
        setError(e.message);
        return;
      }

      setError(e?.message ?? "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 히스토리 관련 핸들러
  // =========================

  const restoreHistory = (item: PlanHistoryItem) => {
    setLanguage(item.input.language);
    setLevel(item.input.level);
    setFrameworks(item.input.frameworks);
    setPlan(item.output);
    setError(null);
  };

  const fullCopyText =
    plan &&
    `
[입력]
- 언어/스택: ${language}
- 난이도: ${level}
- 프레임워크/라이브러리: ${frameworks.length ? frameworks.join(", ") : "(선택 없음)"}

[제목]
${plan.projectTitle}

[한 줄 소개]
${plan.oneLiner}

[MVP 기능]
${plan.mvpFeatures.join("\n")}

[구현 단계]
${plan.buildSteps.join("\n")}

[README]
${plan.readmeDraft}

[면접 포인트]
${plan.interviewPoints.join("\n")}
`.trim();

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>DevPath</h1>

      <ProjectForm
        language={language}
        level={level}
        frameworks={frameworks}
        loading={loading}
        onChangeLanguage={handleLanguageChange}
        onChangeLevel={setLevel}
        onToggleFramework={toggleFramework}
        onSubmit={handleSubmit}
      />

      {error && <ErrorBanner message={error} />}

      {plan && (
        <PlanResult
          plan={plan}
          input={{ language, level, frameworks }}
          onCopyAll={async () => {
            if (!fullCopyText) return;
            try {
              await copyToClipboard(fullCopyText);
              alert("복사 완료!");
            } catch {
              alert("복사 실패");
            }
          }}
          onCopyReadme={async () => {
            try {
              await copyToClipboard(plan.readmeDraft);
              alert("복사 완료!");
            } catch {
              alert("복사 실패");
            }
          }}
        />
      )}

      <HistoryPanel
        items={history}
        onRestore={restoreHistory}
        onDelete={remove}
        onClear={clear}
      />
    </main>
  );
}
