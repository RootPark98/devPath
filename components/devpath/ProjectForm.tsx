"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LANGUAGES, LEVELS, type Language, type Level } from "@/lib/devpath/types";
import { FRAMEWORKS_BY_LANGUAGE } from "@/lib/devpath/constants";

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
  const canSubmit = !loading && !!language && !!level && authenticated;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="space-y-5">
        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">언어/스택</label>
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            disabled={loading}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">난이도</label>
          <select
            value={level}
            onChange={(e) => onChangeLevel(e.target.value as Level)}
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            disabled={loading}
          >
            {LEVELS.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
        </div>

        {/* Frameworks */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">프레임워크/라이브러리</div>

          <div className="flex flex-wrap gap-2">
            {availableFrameworks.map((fw) => {
              const checked = frameworks.includes(fw);
              return (
                <button
                  type="button"
                  key={fw}
                  onClick={() => onToggleFramework(fw)}
                  disabled={loading}
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    checked ? "bg-black text-white border-black" : "bg-white hover:bg-neutral-50",
                    loading ? "opacity-60" : "",
                  ].join(" ")}
                >
                  {fw}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-neutral-500">
            선택은 선택사항이에요. (비워도 생성됩니다)
          </p>
        </div>

        {/* Submit */}
        <div className="space-y-2">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={[
              "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              canSubmit
                ? "bg-black text-white hover:opacity-90 active:opacity-80"
                : "border bg-neutral-50 text-neutral-500",
            ].join(" ")}
          >
            {loading
              ? "AI가 설계 중입니다..."
              : authenticated
                ? "프로젝트 설계 생성"
                : "로그인 후 생성 가능"}
          </button>

          {!authenticated && (
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2 text-xs text-neutral-600">
              <span>
                상단의 <b>로그인</b> 버튼을 눌러 진행해주세요.
              </span>
              <Link href="/login" className="font-semibold underline">
                로그인
              </Link>
            </div>
          )}

          {/* (선택) 크레딧 충전 유도는 헤더에 있으니 여기선 “링크만” 필요할 때만 */}
          {authenticated && (
            <div className="text-center text-xs text-neutral-500">
              크레딧 잔고는 상단에서 확인할 수 있어요.{" "}
              <Link href="/billing" className="underline">
                충전하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}