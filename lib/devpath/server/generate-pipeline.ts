import type { GeneratePlanInput, GeneratePlanResponse } from "@/lib/devpath/types";
import { buildCoreDesignPrompt, type CoreDesignDraft } from "@/lib/devpath/server/prompts/core-design";
import { buildFinalPlanPrompt } from "@/lib/devpath/server/prompts/final-plan";
import { buildConsistencyFixPrompt } from "@/lib/devpath/server/prompts/consistency-fix";
import { callGeminiGenerateContent } from "@/lib/devpath/server/gemini";
import { safeParseGeminiJson } from "@/lib/devpath/server/parse";
import { coercePlan, validatePlan } from "@/lib/devpath/server/validate";

export type GeneratePipelineErrorCode =
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "UPSTREAM_ERROR"
  | "PARSE_ERROR"
  | "SCHEMA_ERROR";

export class GeneratePipelineError extends Error {
  code: GeneratePipelineErrorCode;
  status?: number;
  details?: unknown;
  rawText?: string;

  constructor(params: {
    code: GeneratePipelineErrorCode;
    message: string;
    status?: number;
    details?: unknown;
    rawText?: string;
  }) {
    super(params.message);
    this.name = "GeneratePipelineError";
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
    this.rawText = params.rawText;
  }
}

type GeminiJsonStageParams = {
  apiKey: string;
  prompt: string;
  temperature: number;
  timeoutMs: number;
  stageName: "coreDesign" | "finalPlan" | "consistencyFix";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function callGeminiJsonStage(params: GeminiJsonStageParams): Promise<unknown> {
  const { apiKey, prompt, temperature, timeoutMs, stageName } = params;

  let resp: Response;

  try {
    resp = await callGeminiGenerateContent({
      apiKey,
      prompt,
      temperature,
      timeoutMs,
      maxRetries429: 2,
    });
  } catch (e: any) {
    if (e?.code === "TIMEOUT" || e?.message === "TIMEOUT") {
      throw new GeneratePipelineError({
        code: "TIMEOUT",
        message: `${stageName} 단계에서 AI 응답 시간이 초과되었습니다.`,
        details: String(e?.message ?? e),
      });
    }

    throw new GeneratePipelineError({
      code: "UPSTREAM_ERROR",
      message: `${stageName} 단계에서 외부 API 호출 중 네트워크 오류가 발생했습니다.`,
      details: String(e?.message ?? e),
    });
  }

  if (resp.status === 429) {
    throw new GeneratePipelineError({
      code: "RATE_LIMIT",
      message: `${stageName} 단계에서 요청 제한이 발생했습니다.`,
      status: 429,
    });
  }

  if (!resp.ok) {
    const errText = await resp.text();

    throw new GeneratePipelineError({
      code: "UPSTREAM_ERROR",
      message: `${stageName} 단계에서 Gemini API 호출에 실패했습니다.`,
      status: resp.status,
      details: errText,
    });
  }

  const json = await resp.json();
  const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText || typeof rawText !== "string") {
    throw new GeneratePipelineError({
      code: "PARSE_ERROR",
      message: `${stageName} 단계에서 Gemini 응답 텍스트를 찾지 못했습니다.`,
      details: json,
    });
  }

  try {
    return safeParseGeminiJson(rawText);
  } catch (e: any) {
    throw new GeneratePipelineError({
      code: "PARSE_ERROR",
      message: `${stageName} 단계에서 Gemini JSON 파싱에 실패했습니다.`,
      details: String(e?.message ?? e),
      rawText,
    });
  }
}

function assertCoreDesignDraft(value: unknown): asserts value is CoreDesignDraft {
  if (!isRecord(value)) {
    throw new GeneratePipelineError({
      code: "SCHEMA_ERROR",
      message: "coreDesign 단계 응답이 객체가 아닙니다.",
      details: value,
    });
  }

  const requiredKeys = [
    "projectTitle",
    "targetUser",
    "problem",
    "serviceConcept",
    "roles",
    "coreUserFlow",
    "coreEntities",
    "coreInterfaces",
    "mvpFeatureSeeds",
    "stackDirection",
    "mainTechnicalChallenge",
    "excludedIdeas",
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in value));

  if (missingKeys.length > 0) {
    throw new GeneratePipelineError({
      code: "SCHEMA_ERROR",
      message: "coreDesign 단계 응답에 필수 필드가 없습니다.",
      details: { missingKeys, value },
    });
  }
}

export async function generatePlanPipeline(params: {
  apiKey: string;
  body: GeneratePlanInput;
}): Promise<GeneratePlanResponse["output"]> {
  const { apiKey, body } = params;

  const coreDesignUnknown = await callGeminiJsonStage({
    apiKey,
    prompt: buildCoreDesignPrompt(body),
    temperature: 0.7,
    timeoutMs: 20000,
    stageName: "coreDesign",
  });

  assertCoreDesignDraft(coreDesignUnknown);
  const coreDesign = coreDesignUnknown;

  const finalPlanDraft = await callGeminiJsonStage({
    apiKey,
    prompt: buildFinalPlanPrompt(body, coreDesign),
    temperature: 0.55,
    timeoutMs: 25000,
    stageName: "finalPlan",
  });

  const fixedPlan = await callGeminiJsonStage({
    apiKey,
    prompt: buildConsistencyFixPrompt(body, coreDesign, finalPlanDraft),
    temperature: 0.25,
    timeoutMs: 20000,
    stageName: "consistencyFix",
  });

  const coerced = coercePlan(fixedPlan);

  if (!validatePlan(coerced)) {
    throw new GeneratePipelineError({
      code: "SCHEMA_ERROR",
      message: "최종 생성 결과가 DevPath plan 스키마와 일치하지 않습니다.",
      details: {
        coreDesign,
        finalPlanDraft,
        fixedPlan,
      },
    });
  }

  return coerced;
}