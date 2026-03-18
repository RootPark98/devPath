import type { Language } from "./types";

// 이 파일은 "고정 데이터(상수)" 전용 파일이다.
// UI 로직과 분리하면 page.tsx가 훨씬 깔끔해진다.

// 언어별 프레임워크 매핑 테이블
// Record<Language, string[]> 구조를 사용하면
// Language에 정의된 값만 key로 허용된다.
export const FRAMEWORKS_BY_LANGUAGE: Record<Language, readonly string[]> = {
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

  "C++": [
    "Boost",
    "CMake",
    "Catch2",
    "fmt",
    "spdlog",
  ],

  "C#": [
    ".NET",
    "ASP.NET Core",
    "Entity Framework Core",
    "MediatR",
    "xUnit",
    "Serilog",
  ],

  Go: [
    "Gin",
    "Fiber",
    "Echo",
    "GORM",
    "sqlc",
    "Redis",
    "Zap",
  ],
} as const;