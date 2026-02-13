"use client";

import { useMemo } from "react";
import { LANGUAGES, LEVELS, type Language, type Level } from "@/lib/devpath/types";
import { FRAMEWORKS_BY_LANGUAGE } from "@/lib/devpath/constants";

// 이 컴포넌트는 "입력 UI만 담당"
// 👉 상태는 부모(page.tsx)가 관리하고
// 👉 이 컴포넌트는 props로 받아서 보여주기만 한다.

export default function ProjectForm(props: {
  language: Language;
  level: Level;
  frameworks: string[];
  loading: boolean;

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
    onChangeLanguage,
    onChangeLevel,
    onToggleFramework,
    onSubmit,
  } = props;

  // 언어가 바뀌면 해당 언어의 프레임워크 목록 계산
  // useMemo를 쓰면 불필요한 재계산을 방지
  const availableFrameworks = useMemo(() => FRAMEWORKS_BY_LANGUAGE[language], [language]);
  
  // 버튼 활성화 조건
  const canSubmit = !loading && !!language && !!level;

  return (
    <>
      <div style={{ marginTop: 12 }}>
        <label>언어/스택</label>
        <select
          value={language}
          onChange={(e) => onChangeLanguage(e.target.value as Language)}
          style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>난이도</label>
        <select
          value={level}
          onChange={(e) => onChangeLevel(e.target.value as Level)}
          style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
        >
          {LEVELS.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>프레임워크/라이브러리</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {availableFrameworks.map((fw) => (
            <label key={fw} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={frameworks.includes(fw)}
                onChange={() => onToggleFramework(fw)}
                disabled={loading}
              />
              {fw}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
          선택은 선택사항이에요. (비워도 생성됩니다)
        </div>
      </div>

      <button
        style={{ marginTop: 16, padding: "10px 12px" }}
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        {loading ? "AI가 설계 중입니다..." : "프로젝트 설계 생성"}
      </button>
    </>
  );
}
