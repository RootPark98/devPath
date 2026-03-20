"use client";

import { useMemo, useState } from "react";

import AuthHeader from "@/components/auth/AuthHeader";

import ProjectForm from "@/components/devpath/ProjectForm";
import PlanResult from "@/components/devpath/PlanResult";
import ErrorBanner from "@/components/devpath/ErrorBanner";
import HistoryPanel from "@/components/devpath/HistoryPanel";
import ExportDropdown from "@/components/devpath/ExportDropdown";

import type {
  GeneratedPlan,
  Language,
  Level,
  PlanInput,
  ProjectType,
} from "@/lib/devpath/types";
import type { PlanHistoryItem } from "@/lib/devpath/history";
import type { DevPathErrorCode } from "@/lib/devpath/api";

import {
  DEFAULT_LANGUAGE_BY_PROJECT_TYPE,
  LANGUAGES_BY_PROJECT_TYPE,
  PROJECT_TYPE_LABELS,
  getFrameworkOptions,
} from "@/lib/devpath/constants";
import { copyToClipboard } from "@/lib/devpath/clipboard";
import { DEVPATH_EVENTS } from "@/lib/devpath/events";

import { useHistory } from "@/hooks/useHistory";
import { useMe } from "@/hooks/useMe";

import { generatePlan } from "@/lib/devpath/client/generatePlan";
import { DevPathClientError } from "@/lib/devpath/client/errors";

export default function Home() {
  // 입력 상태
  const [projectType, setProjectType] = useState<ProjectType>("web");
  const [language, setLanguage] = useState<Language>(
    DEFAULT_LANGUAGE_BY_PROJECT_TYPE.web
  );
  const [level, setLevel] = useState<Level>("초급");
  const [frameworks, setFrameworks] = useState<string[]>([]);

  // UX 상태
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [planInput, setPlanInput] = useState<PlanInput | null>(null);
  const [error, setError] = useState<{ code?: DevPathErrorCode; message: string } | null>(null);

  // 인증 상태
  const { me, loadingMe } = useMe();
  const authenticated = !loadingMe && !!me?.authenticated;

  // history state
  const {
    items: historyItems,
    loading: historyLoading,
    refresh: refreshHistory,
    remove: removeHistory,
    clear: clearHistory,
  } = useHistory(authenticated);

  const currentLanguages = useMemo(
    () => LANGUAGES_BY_PROJECT_TYPE[projectType],
    [projectType]
  );

  const currentFrameworkOptions = useMemo(
    () => getFrameworkOptions(projectType, language),
    [projectType, language]
  );

  const handleProjectTypeChange = (next: ProjectType) => {
    setProjectType(next);

    const nextLanguage = DEFAULT_LANGUAGE_BY_PROJECT_TYPE[next];
    setLanguage(nextLanguage);
    setFrameworks([]);
  };

  const handleLanguageChange = (next: Language) => {
    setLanguage(next);
    const nextSet = new Set(getFrameworkOptions(projectType, next));
    setFrameworks((prev) => prev.filter((f) => nextSet.has(f)));
  };

  const toggleFramework = (name: string) => {
    setFrameworks((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!authenticated) return;

    setLoading(true);
    setError(null);
    setPlan(null);
    setPlanInput(null);

    try {
      const payload: PlanInput = {
        projectType,
        language,
        level,
        frameworks,
      };

      const { input, output } = await generatePlan(payload);

      setPlan(output);
      setPlanInput(input);

      await refreshHistory();

      window.dispatchEvent(new Event(DEVPATH_EVENTS.creditsUpdated));
    } catch (e: any) {
      if (e instanceof DevPathClientError) {
        setError({ code: e.code, message: e.message });
      } else {
        setError({ message: e?.message ?? "알 수 없는 오류" });
      }
    } finally {
      setLoading(false);
    }
  };

  const restoreHistory = (item: PlanHistoryItem) => {
    const restoredInput: PlanInput = {
      projectType: item.input.projectType ?? "web",
      language: item.input.language,
      level: item.input.level,
      frameworks: item.input.frameworks ?? [],
    };

    setProjectType(restoredInput.projectType);
    setLanguage(restoredInput.language);
    setLevel(restoredInput.level);
    setFrameworks(restoredInput.frameworks);

    setPlan(item.output);
    setPlanInput(restoredInput);
    setError(null);
  };

  const fullCopyText =
    plan &&
    `
[입력]
- 프로젝트 유형: ${PROJECT_TYPE_LABELS[planInput?.projectType ?? projectType]}
- 언어/스택: ${planInput?.language ?? language}
- 난이도: ${planInput?.level ?? level}
- 프레임워크/라이브러리: ${
      (planInput?.frameworks?.length ?? frameworks.length)
        ? (planInput?.frameworks ?? frameworks).join(", ")
        : "(선택 없음)"
    }

[제목]
${plan.projectTitle}

[한 줄 소개]
${plan.oneLiner}

[기술적 난제]
${plan.technicalChallenge}

[사용자 흐름]
${(plan.userFlow ?? [])
  .map((step, index) => `${index + 1}. ${step}`)
  .join("\n")}

[추천 기술 스택]
- Frontend: ${plan.recommendedStack.frontend.join(", ")}
- Backend: ${plan.recommendedStack.backend.join(", ")}
- Database: ${plan.recommendedStack.database}
- Libraries: ${plan.recommendedStack.libraries.join(", ")}

[데이터베이스 설계]
${plan.databaseSchema
  .map(
    (t) =>
      `- ${t.entity} (${t.description})\n  fields: ${t.fields.join(", ")}`
  )
  .join("\n")}

[핵심 API 설계]
${plan.coreApiSpecs
  .map(
    (api) =>
      `- ${api.method} ${api.path}\n  ${api.description}`
  )
  .join("\n")}

[MVP 기능]
${plan.mvpFeatures.map((feature) => `- ${feature}`).join("\n")}

[구현 단계]
${plan.buildSteps
  .map((step, index) => `${index + 1}. ${step}`)
  .join("\n")}

[면접 포인트]
${plan.interviewPoints.map((point) => `- ${point}`).join("\n")}

[README]

${plan.readmeDraft}
`.trim();

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <AuthHeader />
      {error && <ErrorBanner title="오류" message={error.message} disabled={loading} />}

      <ProjectForm
        projectType={projectType}
        language={language}
        level={level}
        languages={currentLanguages}
        frameworkOptions={currentFrameworkOptions}
        frameworks={frameworks}
        loading={loading}
        authenticated={authenticated}
        onChangeProjectType={handleProjectTypeChange}
        onChangeLanguage={handleLanguageChange}
        onChangeLevel={setLevel}
        onToggleFramework={toggleFramework}
        onSubmit={handleSubmit}
      />

      {plan && planInput && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <ExportDropdown
              title={plan.projectTitle}
              fullText={fullCopyText ?? ""}
              readmeText={plan.readmeDraft}
              onCopyAll={async () => {
                if (!fullCopyText) return;
                await copyToClipboard(fullCopyText);
                alert("복사 완료!");
              }}
              onCopyReadme={async () => {
                await copyToClipboard(plan.readmeDraft);
                alert("복사 완료!");
              }}
            />
          </div>

          <PlanResult
            plan={plan}
            input={planInput}
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
        </>
      )}

      <HistoryPanel
        items={historyItems}
        onRestore={restoreHistory}
        onDelete={(id) => {
          removeHistory(id);
        }}
        onClear={clearHistory}
      />
    </main>
  );
}