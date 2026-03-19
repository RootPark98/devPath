import type { Language, ProjectType } from "./types";

// 이 파일은 "고정 데이터(상수)" 전용 파일이다.
// UI 로직과 분리하면 page.tsx가 훨씬 깔끔해진다.

// 프로젝트 유형별 언어/프레임워크 매핑 테이블
// 이제는 "언어별 프레임워크"보다 "유형별 언어 + 언어별 프레임워크" 구조가 더 자연스럽다.

export const LANGUAGE_OPTIONS_BY_PROJECT_TYPE: Record<ProjectType, readonly Language[]> = {
  web: ["React/Next.js", "Python", "Java"],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
  tool: ["Python", "Java", "C++", "C#", "Go"],
} as const;

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
      "SQLAlchemy",
      "Pydantic",
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