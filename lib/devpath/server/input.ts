import {
  LANGUAGES,
  LEVELS,
  PROJECT_TYPES,
  type Language,
  type Level,
  type ProjectType,
} from "../types";
import {
  FRAMEWORKS_BY_PROJECT_TYPE_AND_LANGUAGE,
  LANGUAGES_BY_PROJECT_TYPE,
} from "../constants";

/**
 * 입력 검증/정제 레이어
 * - 프론트 입력을 "절대 신뢰하지 않기" (서버에서도 강제)
 * - 허용된 projectType / language / level인지 확인
 * - language가 해당 projectType에 속하는지 확인
 * - frameworks는 해당 projectType + language 허용 목록만 통과시키기
 */

export type RequestBody = {
  projectType: ProjectType;
  language: Language;
  level: Level;
  frameworks: string[];
};

export function isProjectType(x: any): x is ProjectType {
  return PROJECT_TYPES.includes(x);
}

export function isLanguage(x: any): x is Language {
  return LANGUAGES.includes(x);
}

export function isLevel(x: any): x is Level {
  return LEVELS.includes(x);
}

export function isLanguageAllowedForProjectType(
  projectType: ProjectType,
  language: Language
): boolean {
  return LANGUAGES_BY_PROJECT_TYPE[projectType].includes(language);
}

export function sanitizeFrameworks(
  projectType: ProjectType,
  language: Language,
  frameworks: unknown
): string[] {
  const allowed = new Set(
    FRAMEWORKS_BY_PROJECT_TYPE_AND_LANGUAGE[projectType][language] ?? []
  );

  if (!Array.isArray(frameworks)) return [];

  return frameworks
    .filter((f): f is string => typeof f === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && allowed.has(s));
}