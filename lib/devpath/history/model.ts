import type { GeneratedPlan, Language, Level } from "@/lib/devpath/types";

/**
 * 히스토리 관련 상수 및 모델 정의
 */

export const HISTORY_KEY = "devpath:history:v1";
export const HISTORY_LIMIT = 10;

export type PlanHistoryItem = {
  id: string;
  createdAt: number;
  input: {
    language: Language;
    level: Level;
    frameworks: string[];
  };
  output: GeneratedPlan;
};