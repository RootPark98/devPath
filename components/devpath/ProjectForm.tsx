"use client";

import { useMemo } from "react";
import { LANGUAGES, LEVELS, type Language, type Level } from "@/lib/devpath/types";
import { FRAMEWORKS_BY_LANGUAGE } from "@/lib/devpath/constants";
import Link from "next/link";

export default function ProjectForm(props: {
  language: Language;
  level: Level;
  frameworks: string[];
  loading: boolean;
  authenticated: boolean;
  onChangeLanguage: (next: Language) => void;
  onChangeLevel: (next: Level) => void;
  onToggleFramework: (name: string) => void;
  onSubmit: () => void;
}) {
  const {
    language,
    level,
    frameworks,
    loading,
    authenticated,
    onChangeLanguage,
    onChangeLevel,
    onToggleFramework,
    onSubmit,
  } = props;

  const availableFrameworks = useMemo(() => FRAMEWORKS_BY_LANGUAGE[language], [language]);

  // 버튼 활성화 조건
  const canSubmit = !loading && !!language && !!level && authenticated;

  return (
    <section className="dp-card">
      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <h2 className="dp-card-title">프로젝트 입력</h2>
          <p className="text-sm dp-muted">
            언어/난이도를 선택하고, 원하는 프레임워크를 골라 설계를 생성하세요.
          </p>
        </div>

        {/* Language */}
        <Field label="언어/스택">
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            disabled={loading}
            className="
              w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none
              border-neutral-200 text-neutral-900
              focus:ring-2 focus:ring-black/10
              disabled:opacity-60
              dark:bg-neutral-950/40 dark:text-neutral-50 dark:border-neutral-800
            "
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        {/* Level */}
        <Field label="난이도">
          <select
            value={level}
            onChange={(e) => onChangeLevel(e.target.value as Level)}
            disabled={loading}
            className="
              w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none
              border-neutral-200 text-neutral-900
              focus:ring-2 focus:ring-black/10
              disabled:opacity-60
              dark:bg-neutral-950/40 dark:text-neutral-50 dark:border-neutral-800
            "
          >
            {LEVELS.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
        </Field>

        {/* Frameworks */}
        <Field label="프레임워크/라이브러리">
          <div className="flex flex-wrap gap-2">
            {availableFrameworks.map((fw) => {
              const checked = frameworks.includes(fw);

              return (
                <button
                  key={fw}
                  type="button"
                  onClick={() => onToggleFramework(fw)}
                  disabled={loading}
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    "disabled:opacity-60",
                    checked
                      ? "bg-black text-white border-black dark:bg-neutral-50 dark:text-neutral-900 dark:border-neutral-50"
                      : "bg-white border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 dark:bg-neutral-950/40 dark:border-neutral-800 dark:hover:bg-neutral-900/60 dark:active:bg-neutral-900",
                  ].join(" ")}
                >
                  {fw}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-xs dp-muted">
            선택은 선택사항이에요. (비워도 생성됩니다)
          </p>
        </Field>

        {/* Submit */}
        <div className="space-y-2">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={[
              "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              canSubmit
                ? "bg-black text-white hover:opacity-90 active:opacity-80 disabled:opacity-50"
                : "border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-400",
            ].join(" ")}
          >
            {loading
              ? "AI가 설계 중입니다..."
              : authenticated
                ? "프로젝트 설계 생성"
                : "로그인 후 생성 가능"}
          </button>

          {/* Login hint */}
          {!authenticated && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-300">
              <span>
                상단의 <b>로그인</b> 버튼을 눌러 진행해주세요.
              </span>
              <Link href="/login" className="font-semibold underline">
                로그인
              </Link>
            </div>
          )}

          {/* Optional hint */}
          {authenticated && (
            <div className="text-center text-xs dp-muted">
              크레딧 잔고는 상단에서 확인할 수 있어요.{" "}
              <Link href="/billing" className="underline">
                충전하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}