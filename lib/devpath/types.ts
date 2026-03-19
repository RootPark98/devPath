// 이 파일은 "타입 정의 전용" 파일이다.
// UI/서버 모두에서 공통으로 쓰이는 타입을 여기 모아둔다.
// 👉 타입을 한 군데에 모으면 나중에 구조가 바뀌어도 수정이 쉬워진다.

export type GeneratedPlan = {
  projectTitle: string
  oneLiner: string

  technicalChallenge: string
  userFlow: string[]

  recommendedStack: {
    frontend: string[]
    backend: string[]
    database: string
    libraries: string[]
  }

  databaseSchema: {
    entity: string
    fields: string[]
    description: string
  }[]

  coreApiSpecs: {
    method: string
    path: string
    description: string
  }[]

  mvpFeatures: string[]
  buildSteps: string[]
  readmeDraft: string
  interviewPoints: string[]
}

export const PROJECT_TYPES = ["web", "mobile", "tool"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

// projectType 도입 이후에는 전체 언어를 하나의 고정 배열로 관리하기보다
// constants.ts의 유형별 언어 매핑에서 파생해서 쓰는 쪽이 더 자연스럽다.
// 그래도 공용 타입으로 써야 하니 union 타입은 유지한다.
export const LANGUAGES = [
  "React/Next.js",
  "Python",
  "Java",
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "C++",
  "C#",
  "Go",
] as const;

export type Language = (typeof LANGUAGES)[number];

export const LEVELS = ["초급", "중급", "고급"] as const;
export type Level = (typeof LEVELS)[number];

export type PlanInput = {
  projectType: ProjectType;
  language: Language;
  level: Level;
  frameworks: string[];
};

export type PlanHistoryItem = {
  id: string;
  createdAt: number;
  input: PlanInput;
  output: GeneratedPlan;
};