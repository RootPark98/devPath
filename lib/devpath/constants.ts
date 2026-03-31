import type { Language, ProjectType, Domain } from "./types";

// 이 파일은 "고정 데이터(상수)" 전용 파일이다.
// UI 로직과 분리하면 page.tsx와 form 컴포넌트가 훨씬 깔끔해진다.

/**
 * 프로젝트 유형 라벨
 * - 내부 값은 영어 key
 * - UI에는 보기 좋은 label 사용
 */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: "Web Service",
  mobile: "Mobile App",
  tool: "Developer Tool",
} as const;

/**
 * 프로젝트 유형별 언어 목록
 * - 드롭다운에서 바로 사용
 * - projectType 선택 시 보여줄 언어를 제한
 */
export const LANGUAGES_BY_PROJECT_TYPE: Record<ProjectType, readonly Language[]> = {
  web: ["React/Next.js", "Python", "Java"],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
  tool: ["Python", "Java", "C++", "C#", "Go"],
} as const;

/**
 * 프로젝트 유형별 기본 언어
 * - projectType 변경 시 첫 기본값으로 사용
 */
export const DEFAULT_LANGUAGE_BY_PROJECT_TYPE: Record<ProjectType, Language> = {
  web: "React/Next.js",
  mobile: "React Native",
  tool: "Python",
} as const;

/**
 * 프로젝트 유형 + 언어별 프레임워크/라이브러리 목록
 * - 언어 선택 후 framework chip/button 렌더링에 사용
 */
export const FRAMEWORKS_BY_PROJECT_TYPE_AND_LANGUAGE: Record<
  ProjectType,
  Partial<Record<Language, readonly string[]>>
> = {
  web: {
    "React/Next.js": [
      "Next.js",
      "React Query",
      "Zustand",
      "Redux Toolkit",
      "Tailwind CSS",
      "shadcn/ui",
    ],
    Python: [
      "FastAPI",
      "Django",
      "Flask",
      "SQLAlchemy",
      "Celery",
      "Redis",
    ],
    Java: [
      "Spring Boot",
      "Spring Security",
      "JPA (Hibernate)",
      "QueryDSL",
      "MyBatis",
      "JUnit",
    ],
  },

  mobile: {
    "React Native": [
      "Expo",
      "React Query",
      "Zustand",
      "NativeWind",
      "React Navigation",
    ],
    Flutter: [
      "Riverpod",
      "Bloc",
      "Dio",
      "go_router",
    ],
    Swift: [
      "SwiftUI",
      "Combine",
      "Core Data",
    ],
    Kotlin: [
      "Jetpack Compose",
      "Room",
      "Retrofit",
      "Hilt",
    ],
  },

  tool: {
    Python: [
      "Typer",
      "Click",
      "Rich",
      "Pydantic",
      "SQLAlchemy",
    ],
    Java: [
      "Picocli",
      "JUnit",
      "Gradle",
      "Jackson",
    ],
    "C++": [
      "Boost",
      "CMake",
      "Catch2",
      "fmt",
      "spdlog",
    ],
    "C#": [
      ".NET",
      "Spectre.Console",
      "xUnit",
      "Serilog",
    ],
    Go: [
      "Cobra",
      "Bubble Tea",
      "sqlc",
      "Zap",
    ],
  },
} as const;

/**
 * helper:
 * 현재 projectType에 맞는 framework 목록 가져오기
 */
export function getFrameworkOptions(
  projectType: ProjectType,
  language: Language
): readonly string[] {
  return FRAMEWORKS_BY_PROJECT_TYPE_AND_LANGUAGE[projectType][language] ?? [];
}

/**
 * helper:
 * 현재 projectType에 맞는 언어 목록 가져오기
 */
export function getLanguageOptions(projectType: ProjectType): readonly Language[] {
  return LANGUAGES_BY_PROJECT_TYPE[projectType];
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  auto: "자동 추천",
  collaboration: "협업 도구",
  "data-analysis": "데이터 분석",
  commerce: "커머스",
  "ai-service": "AI 서비스",
  education: "교육",
  healthcare: "헬스케어",
  "location-based": "위치 기반",
  "content-platform": "콘텐츠 플랫폼",
  social: "소셜 서비스",
  "developer-tools": "개발자 도구",
  "productivity-automation": "생산성 자동화",
  finance: "금융/가계부",
  "log-monitoring": "로그 모니터링",
  "api-platform": "API 플랫폼",
};