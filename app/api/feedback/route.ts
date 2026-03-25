import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { apiErr, apiOk } from "@/lib/devpath/api.server";

const ALLOWED_REASON_TAGS = [
  "difficulty_mismatch",
  "stack_mismatch",
  "boring_project",
  "bad_schema",
  "bad_api",
  "awkward_flow",
  "other",
] as const;

type FeedbackReason = (typeof ALLOWED_REASON_TAGS)[number];
type FeedbackRating = "up" | "down";

type FeedbackRequestBody = {
  planHistoryId?: string | null;
  rating: FeedbackRating;
  reasonTags?: string[];
  comment?: string | null;
  inputSnapshot: unknown;
  outputSnapshot: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidRating(value: unknown): value is FeedbackRating {
  return value === "up" || value === "down";
}

function sanitizeReasonTags(value: unknown): FeedbackReason[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (tag): tag is FeedbackReason =>
      typeof tag === "string" &&
      (ALLOWED_REASON_TAGS as readonly string[]).includes(tag)
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
    }

    const body = (await req.json()) as FeedbackRequestBody;

    if (!isValidRating(body?.rating)) {
      return apiErr("INVALID_INPUT", "유효하지 않은 피드백 타입입니다.", 400);
    }

    if (!isObject(body?.inputSnapshot) || !isObject(body?.outputSnapshot)) {
      return apiErr("INVALID_INPUT", "유효하지 않은 스냅샷 데이터입니다.", 400);
    }

    const reasonTags = sanitizeReasonTags(body.reasonTags);
    const comment =
      typeof body.comment === "string" && body.comment.trim().length > 0
        ? body.comment.trim().slice(0, 1000)
        : null;

    if (body.rating === "down" && reasonTags.length === 0 && !comment) {
      return apiErr(
        "INVALID_INPUT",
        "아쉬운 피드백에는 이유 태그 또는 코멘트가 필요합니다.",
        400
      );
    }

    const historyId =
      typeof body.planHistoryId === "string" && body.planHistoryId.trim().length > 0
        ? body.planHistoryId
        : null;

    if (historyId) {
      const history = await prisma.history.findFirst({
        where: {
          id: historyId,
          userId: session.user.id,
        },
        select: { id: true },
      });

      if (!history) {
        return apiErr("NOT_FOUND", "해당 히스토리를 찾을 수 없습니다.", 404);
      }
    }

    const feedback = await prisma.planFeedback.create({
      data: {
        userId: session.user.id,
        historyId,
        rating: body.rating === "up" ? "UP" : "DOWN",
        reasonTags,
        comment,
        inputSnapshot: body.inputSnapshot as Prisma.InputJsonValue,
        outputSnapshot: body.outputSnapshot as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return apiOk({
      feedbackId: feedback.id,
      createdAt: feedback.createdAt,
    });
  } catch (error) {
    console.error("[POST /api/feedback] error:", error);

    return apiErr(
      "INTERNAL_ERROR",
      "피드백 저장 중 오류가 발생했습니다.",
      500
    );
  }
}