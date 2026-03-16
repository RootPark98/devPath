import type { GeneratedPlan } from "../types";

/**
 * 검증/보정 레이어
 * - validatePlan: 최종 스키마가 맞는지 확인
 * - coercePlan: 키 흔들림/누락이 있어도 "부분 성공"으로 살리는 보정
 *
 * ✅ 중요한 철학:
 * LLM 제품은 "가끔 안 됨"이 치명적이라,
 * 가능하면 에러 대신 '보정된 성공'을 반환하는 게 UX에 유리함.
 */

function isNonEmptyStringArray(v: unknown): v is string[] {
  return (
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((x) => typeof x === "string" && x.trim().length > 0)
  );
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isUserFlow(v: unknown): v is string[] {
  return (
    Array.isArray(v) &&
    v.length >= 4 &&
    v.length <= 6 &&
    v.every((x) => typeof x === "string" && x.trim().length > 0)
  );
}

function isRecommendedStack(v: unknown): v is GeneratedPlan["recommendedStack"] {
  return (
    !!v &&
    typeof v === "object" &&
    isStringArray((v as any).frontend) &&
    (v as any).frontend.length > 0 &&
    isStringArray((v as any).backend) &&
    (v as any).backend.length > 0 &&
    typeof (v as any).database === "string" &&
    (v as any).database.trim().length > 0 &&
    isStringArray((v as any).libraries) &&
    (v as any).libraries.length > 0
  );
}

function isDatabaseSchema(v: unknown): v is GeneratedPlan["databaseSchema"] {
  return (
    Array.isArray(v) &&
    v.length >= 3 &&
    v.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.entity === "string" &&
        item.entity.trim().length > 0 &&
        isStringArray(item.fields) &&
        item.fields.length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
    )
  );
}

function isCoreApiSpecs(v: unknown): v is GeneratedPlan["coreApiSpecs"] {
  return (
    Array.isArray(v) &&
    v.length >= 3 &&
    v.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.method === "string" &&
        item.method.trim().length > 0 &&
        typeof item.path === "string" &&
        item.path.trim().length > 0 &&
        typeof item.description === "string" &&
        item.description.trim().length > 0
    )
  );
}

export function validatePlan(plan: any): plan is GeneratedPlan {
  return (
    plan &&
    typeof plan === "object" &&
    typeof plan.projectTitle === "string" &&
    plan.projectTitle.trim().length > 0 &&
    typeof plan.oneLiner === "string" &&
    plan.oneLiner.trim().length > 0 &&
    typeof plan.technicalChallenge === "string" &&
    plan.technicalChallenge.trim().length > 0 &&
    isUserFlow(plan.userFlow) &&
    isRecommendedStack(plan.recommendedStack) &&
    isDatabaseSchema(plan.databaseSchema) &&
    isCoreApiSpecs(plan.coreApiSpecs) &&
    isNonEmptyStringArray(plan.mvpFeatures) &&
    isNonEmptyStringArray(plan.buildSteps) &&
    typeof plan.readmeDraft === "string" &&
    plan.readmeDraft.trim().length > 0 &&
    isNonEmptyStringArray(plan.interviewPoints)
  );
}

function asNonEmptyString(v: any, fallback: string) {
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  return fallback;
}

function asStringArray(v: any, fallback: string[] = []) {
  if (!Array.isArray(v)) return fallback;
  const arr = v
    .filter((x) => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return arr.length ? arr : fallback;
}

function asUserFlow(v: any): string[] {
  const fallback = [
    "사용자가 회원가입 후 로그인한다",
    "사용자가 핵심 데이터를 입력하거나 등록한다",
    "사용자가 주요 작업을 실행한다",
    "시스템이 처리 결과를 사용자에게 보여준다",
  ];

  if (!Array.isArray(v)) return fallback;

  const arr = v
    .filter((x) => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 6);

  return arr.length >= 4 ? arr : fallback;
}

function asRecommendedStack(v: any): GeneratedPlan["recommendedStack"] {
  return {
    frontend: asStringArray(v?.frontend, ["기본 프론트엔드 스택"]),
    backend: asStringArray(v?.backend, ["기본 백엔드 스택"]),
    database: asNonEmptyString(v?.database, "PostgreSQL"),
    libraries: asStringArray(v?.libraries, ["Zod", "React Query", "Axios"]),
  };
}

function asDatabaseSchema(v: any): GeneratedPlan["databaseSchema"] {
  const fallback: GeneratedPlan["databaseSchema"] = [
    {
      entity: "User",
      fields: ["id", "email", "createdAt"],
      description: "기본 사용자 정보",
    },
    {
      entity: "Project",
      fields: ["id", "userId", "title", "status", "createdAt"],
      description: "사용자가 생성한 핵심 비즈니스 데이터",
    },
    {
      entity: "Activity",
      fields: ["id", "projectId", "type", "createdAt"],
      description: "프로젝트 내 주요 이벤트 및 작업 기록",
    },
  ];

  if (!Array.isArray(v)) return fallback;

  const arr = v
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      entity: asNonEmptyString(item.entity, "Entity"),
      fields: asStringArray(item.fields, ["id", "createdAt"]),
      description: asNonEmptyString(item.description, "핵심 데이터 엔티티"),
    }))
    .filter((item) => item.entity.length > 0);

  return arr.length >= 3 ? arr : fallback;
}

function asCoreApiSpecs(v: any): GeneratedPlan["coreApiSpecs"] {
  const fallback: GeneratedPlan["coreApiSpecs"] = [
    {
      method: "GET",
      path: "/api/items",
      description: "핵심 데이터 목록 조회",
    },
    {
      method: "POST",
      path: "/api/items",
      description: "핵심 데이터 생성",
    },
    {
      method: "GET",
      path: "/api/items/:id",
      description: "핵심 데이터 상세 조회",
    },
  ];

  if (!Array.isArray(v)) return fallback;

  const arr = v
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      method: asNonEmptyString(item.method, "GET"),
      path: asNonEmptyString(item.path, "/api/items"),
      description: asNonEmptyString(item.description, "핵심 API"),
    }))
    .filter((item) => item.method.length > 0 && item.path.length > 0);

  return arr.length >= 3 ? arr : fallback;
}

export function coercePlan(input: any): GeneratedPlan {
  // 흔한 키 흔들림을 alias로 흡수
  const projectTitle = input?.projectTitle ?? input?.title ?? input?.project_name;
  const oneLiner = input?.oneLiner ?? input?.summary ?? input?.one_line;

  const technicalChallenge =
    input?.technicalChallenge ?? input?.challenge ?? input?.technical_problem;

  const userFlow =
    input?.userFlow ?? input?.user_flow ?? input?.flow ?? input?.userScenario;

  const recommendedStack =
    input?.recommendedStack ?? input?.stack ?? input?.techStack ?? input?.recommended_stack;

  const databaseSchema =
    input?.databaseSchema ?? input?.dbSchema ?? input?.schema ?? input?.database_schema;

  const coreApiSpecs =
    input?.coreApiSpecs ?? input?.apiSpecs ?? input?.apis ?? input?.core_api_specs;

  const mvpFeatures = input?.mvpFeatures ?? input?.features ?? input?.mvpFeature;
  const buildSteps = input?.buildSteps ?? input?.steps ?? input?.buildStep;

  const readmeDraft = input?.readmeDraft ?? input?.readme ?? input?.README;

  const interviewPoints =
    input?.interviewPoints ?? input?.interview ?? input?.qna ?? input?.questions;

  return {
    projectTitle: asNonEmptyString(projectTitle, "프로젝트 제목(임시)"),
    oneLiner: asNonEmptyString(oneLiner, "한 줄 소개(임시)"),

    technicalChallenge: asNonEmptyString(
      technicalChallenge,
      "데이터 흐름, 상태 관리, 예외 처리 중 하나 이상의 기술적 난제를 해결하는 것이 핵심입니다."
    ),

    userFlow: asUserFlow(userFlow),

    recommendedStack: asRecommendedStack(recommendedStack),

    databaseSchema: asDatabaseSchema(databaseSchema),

    coreApiSpecs: asCoreApiSpecs(coreApiSpecs),

    mvpFeatures: asStringArray(mvpFeatures, [
      "핵심 기능 1",
      "핵심 기능 2",
      "핵심 기능 3",
    ]),

    buildSteps: asStringArray(buildSteps, [
      "초기 세팅",
      "핵심 기능 구현",
      "예외 처리",
      "테스트",
      "정리",
    ]),

    readmeDraft: asNonEmptyString(
      readmeDraft,
      "# 개요\n\n(README 초안이 생성되지 않았습니다.)"
    ),

    interviewPoints: asStringArray(interviewPoints, [
      "왜 이 기술을 선택했는가?",
      "트레이드오프는 무엇인가?",
    ]),
  };
}