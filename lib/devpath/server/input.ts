import { LANGUAGES, LEVELS, type Language, type Level } from "../types";
import { FRAMEWORKS_BY_LANGUAGE } from "../constants";

/**
 * 입력 검증/정제 레이어
 * - 프론트 입력을 "절대 신뢰하지 않기" (서버에서도 강제)
 * - 허용된 language/level인지 확인
 * - frameworks는 허용 목록만 통과시키기
 */

export type RequestBody = {
  language: Language;
  level: Level;
  frameworks: string[];
};

export function isLanguage(x: any): x is Language {
  return LANGUAGES.includes(x);
}

export function isLevel(x: any): x is Level {
  return LEVELS.includes(x);
}

export function sanitizeFrameworks(language: Language, frameworks: unknown): string[] {
  const allowed = new Set(FRAMEWORKS_BY_LANGUAGE[language]);
  if (!Array.isArray(frameworks)) return [];

  return frameworks
    .filter((f) => typeof f === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && allowed.has(s));
}
