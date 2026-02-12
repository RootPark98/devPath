"use client";

import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";

type GeneratedPlan = {
  projectTitle: string;
  oneLiner: string;
  mvpFeatures: string[];
  buildSteps: string[];
  readmeDraft: string;
  interviewPoints: string[];
};


// ✅ 고정 옵션(제품화 포인트)
const LANGUAGES = ["React/Next.js", "Python", "Java", "C++", "C#", "Go"] as const;
type Language = (typeof LANGUAGES)[number];

const LEVELS = ["초급", "중급", "고급"] as const;
type Level = (typeof LEVELS)[number];

// ✅ 언어별 프레임워크/라이브러리 옵션(체크박스)
const FRAMEWORKS_BY_LANGUAGE: Record<Language, readonly string[]> = {
  "React/Next.js": ["Next.js", "React Query", "Zustand", "Tailwind CSS", "shadcn/ui"],
  Python: ["FastAPI", "Django", "Flask", "SQLAlchemy", "Celery"],
  Java: ["Spring Boot", "JPA(Hibernate)", "QueryDSL", "JUnit", "Gradle"],
  "C++": ["STL", "CMake", "Catch2", "fmt", "spdlog"],
  "C#": [".NET", "ASP.NET Core", "Entity Framework Core", "xUnit", "Serilog"],
  Go: ["Gin", "Fiber", "GORM", "sqlc", "Zap"],
} as const;

export default function Home() {
  // ✅ 입력값: 드롭다운으로 강제
  const [language, setLanguage] = useState<Language>("React/Next.js");
  const [level, setLevel] = useState<Level>("초급");

  // ✅ 프레임워크: 체크박스 선택 결과
  const [frameworks, setFrameworks] = useState<string[]>([]);

  // ✅ UX 상태
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ 언어가 바뀌면, 가능한 프레임워크 목록도 바뀜
  const availableFrameworks = useMemo(() => {
    return FRAMEWORKS_BY_LANGUAGE[language];
  }, [language]);

  // ✅ 언어 변경 시: 기존 체크가 새 언어 옵션에 없으면 제거
  const handleLanguageChange = (next: Language) => {
    setLanguage(next);
    const nextSet = new Set(FRAMEWORKS_BY_LANGUAGE[next]);
    setFrameworks((prev) => prev.filter((f) => nextSet.has(f)));
  };

  const toggleFramework = (name: string) => {
    setFrameworks((prev) => {
      if (prev.includes(name)) return prev.filter((x) => x !== name);
      return [...prev, name];
    });
  };

  // ✅ 복사 기능
  const copyToClipboard = async (text: string) => {
    try{
      await navigator.clipboard.writeText(text);
      alert("복사 완료!");
    } catch{
      alert("복사 실패");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, level, frameworks }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "요청 실패");
      }

      const data: GeneratedPlan = await res.json();
      setPlan(data);
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && !!language && !!level;

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>DevPath</h1>

      {/* ✅ 언어/스택 드롭다운 */}
      <div style={{ marginTop: 12 }}>
        <label>언어/스택</label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
        >
         {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      
      {/* ✅ 난이도 드롭다운 */}
      <div style={{ marginTop: 12 }}>
        <label>난이도</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
          style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
        >
        {LEVELS.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ 프레임워크 체크박스 */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>프레임워크/라이브러리</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {availableFrameworks.map((fw) => (
            <label key={fw} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={frameworks.includes(fw)}
                onChange={() => toggleFramework(fw)}
              />
              {fw}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
          선택은 선택사항이에요. (비워도 생성됩니다)
        </div>
      </div>
      
      {/* ✅ 로딩 UX */}
      <button
        style={{ marginTop: 16, padding: "10px 12px" }}
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        {loading ? "AI가 설계 중입니다..." : "프로젝트 설계 생성"}
      </button>

      {error && (
        <p style={{ marginTop: 16, color: "crimson" }}>에러: {error}</p>
      )}

      {plan && (
        <div style={{ marginTop: 24 }}>
          {/* ✅ 전체 복사 */}
          <button
            style={{ marginBottom: 12, padding: "8px 10px" }}
            onClick={() =>
              copyToClipboard(
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
                `.trim()
              )
            }
          >
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

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              marginTop: 8,
            }}
          >
            <ReactMarkdown>{plan.readmeDraft}</ReactMarkdown>
          </div>
          
          {/* ✅ README만 복사 */}
          <button
            style={{ marginTop: 8, padding: "8px 10px" }}
            onClick={() => copyToClipboard(plan.readmeDraft)}
          >
            README만 복사
          </button>

          <h3 style={{ marginTop: 16 }}>면접 포인트</h3>
          <ul>
            {plan.interviewPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
