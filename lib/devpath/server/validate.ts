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

export function validatePlan(plan: any): plan is GeneratedPlan {
  return (
    plan &&
    typeof plan === "object" &&
    typeof plan.projectTitle === "string" &&
    plan.projectTitle.trim().length > 0 &&
    typeof plan.oneLiner === "string" &&
    plan.oneLiner.trim().length > 0 &&
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

export function coercePlan(input: any): GeneratedPlan {
  // 흔한 키 흔들림을 alias로 흡수
  const projectTitle = input?.projectTitle ?? input?.title ?? input?.project_name;
  const oneLiner = input?.oneLiner ?? input?.summary ?? input?.one_line;

  const mvpFeatures = input?.mvpFeatures ?? input?.features ?? input?.mvpFeature;
  const buildSteps = input?.buildSteps ?? input?.steps ?? input?.buildStep;

  const readmeDraft = input?.readmeDraft ?? input?.readme ?? input?.README;

  const interviewPoints =
    input?.interviewPoints ?? input?.interview ?? input?.qna ?? input?.questions;

  return {
    projectTitle: asNonEmptyString(projectTitle, "프로젝트 제목(임시)"),
    oneLiner: asNonEmptyString(oneLiner, "한 줄 소개(임시)"),
    mvpFeatures: asStringArray(mvpFeatures, ["핵심 기능 1", "핵심 기능 2", "핵심 기능 3"]),
    buildSteps: asStringArray(buildSteps, ["초기 세팅", "핵심 기능 구현", "예외 처리", "테스트", "정리"]),
    readmeDraft: asNonEmptyString(readmeDraft, "# 개요\n\n(README 초안이 생성되지 않았습니다.)"),
    interviewPoints: asStringArray(interviewPoints, ["기술 선택 이유는?", "트레이드오프는?"]),
  };
}
