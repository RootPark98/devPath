// 이 파일은 "타입 정의 전용" 파일이다.
// UI/서버 모두에서 공통으로 쓰이는 타입을 여기 모아둔다.
// 👉 타입을 한 군데에 모으면 나중에 구조가 바뀌어도 수정이 쉬워진다.

export type GeneratedPlan = {
  projectTitle: string;
  oneLiner: string;
  mvpFeatures: string[];
  buildSteps: string[];
  readmeDraft: string;
  interviewPoints: string[];
};

// 고정 언어 옵션 (readonly tuple)
// as const를 사용하면 각 요소가 string이 아니라 리터럴 타입이 된다.
export const LANGUAGES = ["React/Next.js", "Python", "Java", "C++", "C#", "Go"] as const;
// 위 배열을 기반으로 Language 타입을 자동 생성
// → 나중에 LANGUAGES를 수정하면 Language 타입도 자동 반영됨
export type Language = (typeof LANGUAGES)[number];

export const LEVELS = ["초급", "중급", "고급"] as const;
export type Level = (typeof LEVELS)[number];