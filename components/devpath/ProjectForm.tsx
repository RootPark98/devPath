"use client";

import Link from "next/link";
import {
  DOMAINS,
  LEVELS,
  PROJECT_TYPES,
  type Domain,
  type Language,
  type Level,
  type ProjectType,
} from "@/lib/devpath/types";
import { DOMAIN_LABELS, PROJECT_TYPE_LABELS } from "@/lib/devpath/constants";

export default function ProjectForm(props: {
  projectType: ProjectType;
  language: Language;
  level: Level;
  domain: Domain;
  languages: readonly Language[];
  domainOptions?: readonly Domain[];
  frameworkOptions: readonly string[];
  frameworks: string[];
  loading: boolean;
  authenticated: boolean;
  onChangeProjectType: (next: ProjectType) => void;
  onChangeLanguage: (next: Language) => void;
  onChangeLevel: (next: Level) => void;
  onChangeDomain: (next: Domain) => void;
  onToggleFramework: (name: string) => void;
  onSubmit: () => void;
}) {
  const {
    projectType,
    language,
    level,
    domain,
    languages,
    domainOptions = DOMAINS,
    frameworkOptions,
    frameworks,
    loading,
    authenticated,
    onChangeProjectType,
    onChangeLanguage,
    onChangeLevel,
    onChangeDomain,
    onToggleFramework,
    onSubmit,
  } = props;

  const canSubmit = !loading && authenticated;

  return (
    <section className="dp-card">
      <div className="space-y-5">
        <div className="space-y-1">
          <h2 className="dp-card-title">프로젝트 입력</h2>
          <p className="text-sm dp-muted">
            웹 서비스 또는 모바일 앱 유형에 맞는 실무형 프로젝트 설계를 생성합니다.
          </p>
        </div>

        <Field label="프로젝트 유형">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PROJECT_TYPES.map((type) => {
              const checked = projectType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChangeProjectType(type)}
                  disabled={loading}
                  className={[
                    "rounded-xl border px-4 py-3 text-sm font-medium transition",
                    "disabled:opacity-60",
                    checked
                      ? "border-black bg-black text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
                      : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-50 dark:hover:bg-neutral-900/60 dark:active:bg-neutral-900",
                  ].join(" ")}
                >
                  {PROJECT_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </Field>

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
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs dp-muted">
            선택한 프로젝트 유형에 맞는 언어만 표시됩니다.
          </p>
        </Field>

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

        <Field label="도메인">
          <select
            value={domain}
            onChange={(e) => onChangeDomain(e.target.value as Domain)}
            disabled={loading}
            className="
              w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none
              border-neutral-200 text-neutral-900
              focus:ring-2 focus:ring-black/10
              disabled:opacity-60
              dark:bg-neutral-950/40 dark:text-neutral-50 dark:border-neutral-800
            "
          >
            {domainOptions.map((item) => (
              <option key={item} value={item}>
                {DOMAIN_LABELS[item]}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs dp-muted">
            자동 추천을 고르면 입력값에 맞는 도메인을 자동으로 선택합니다.
          </p>
        </Field>

        <Field label="프레임워크/라이브러리">
          {frameworkOptions.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {frameworkOptions.map((fw) => {
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
                          ? "border-black bg-black text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-50 dark:hover:bg-neutral-900/60 dark:active:bg-neutral-900",
                      ].join(" ")}
                    >
                      {fw}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs dp-muted">
                선택은 선택사항이에요. 비워도 생성됩니다.
              </p>
            </>
          ) : (
            <p className="text-xs dp-muted">
              현재 선택한 언어에서 추천 프레임워크가 없습니다.
            </p>
          )}
        </Field>

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