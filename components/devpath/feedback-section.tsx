"use client";

import { useMemo, useState, useEffect } from "react";

type FeedbackRating = "up" | "down";
type FeedbackReason =
  | "difficulty_mismatch"
  | "stack_mismatch"
  | "boring_project"
  | "bad_schema"
  | "bad_api"
  | "awkward_flow"
  | "other";

type FeedbackSectionProps = {
  planHistoryId?: string;
  inputSnapshot: unknown;
  outputSnapshot: unknown;
  resetSignal?:number;
};

const NEGATIVE_REASONS: { value: FeedbackReason; label: string }[] = [
  { value: "difficulty_mismatch", label: "난이도가 안 맞아요" },
  { value: "stack_mismatch", label: "기술 스택이 어색해요" },
  { value: "boring_project", label: "프로젝트가 평범해요" },
  { value: "bad_schema", label: "DB 설계가 이상해요" },
  { value: "bad_api", label: "API 설계가 이상해요" },
  { value: "awkward_flow", label: "사용자 흐름이 어색해요" },
  { value: "other", label: "기타" },
];

export function FeedbackSection({
  planHistoryId,
  inputSnapshot,
  outputSnapshot,
  resetSignal,
}: FeedbackSectionProps) {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [reasonTags, setReasonTags] = useState<FeedbackReason[]>([]);
  const [comment, setComment] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isNegative = rating === "down";
  const isPositive = rating === "up";

  useEffect(() => {
    setRating(null);
    setReasonTags([]);
    setComment("");
    setIsCommentOpen(false);
    setIsSubmitted(false);
  }, [resetSignal]);

  const canSubmit = useMemo(() => {
    if (!rating) return false;
    if (isNegative) {
      return reasonTags.length > 0 || comment.trim().length > 0;
    }
    return true;
  }, [rating, isNegative, reasonTags.length, comment]);

  const toggleReason = (value: FeedbackReason) => {
    setReasonTags((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleClickUp = () => {
    setRating("up");
    setReasonTags([]);
    setIsCommentOpen(false);
    setIsSubmitted(false);
  };

  const handleClickDown = () => {
    setRating("down");
    setIsCommentOpen(true);
    setIsSubmitted(false);
  };

  const handleOpenPositiveComment = () => {
    setIsCommentOpen(true);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !rating) return;

    const payload = {
      planHistoryId: planHistoryId ?? null,
      rating,
      reasonTags,
      comment: comment.trim() || null,
      inputSnapshot,
      outputSnapshot,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error("feedback submit failed");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("피드백 제출에 실패했습니다.");
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          이 결과가 도움이 되었나요?
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          피드백은 DevPath 결과 품질 개선에 바로 반영됩니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleClickUp}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            isPositive
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          👍 도움이 됐어요
        </button>

        <button
          type="button"
          onClick={handleClickDown}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            isNegative
              ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          👎 아쉬워요
        </button>
      </div>

      {isPositive && !isCommentOpen && !isSubmitted && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleOpenPositiveComment}
            className="text-sm font-medium text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
          >
            추가 코멘트 남기기
          </button>
        </div>
      )}

      {isNegative && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            어떤 점이 아쉬웠나요?
          </p>

          <div className="flex flex-wrap gap-2">
            {NEGATIVE_REASONS.map((reason) => {
              const selected = reasonTags.includes(reason.value);

              return (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => toggleReason(reason.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    selected
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  {reason.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(isCommentOpen || isNegative) && (
        <div className="mt-4">
          <label
            htmlFor="feedback-comment"
            className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            코멘트
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              isNegative
                ? "어떤 점이 어색했는지 알려주세요."
                : "좋았던 점이 있다면 짧게 남겨주세요. (선택)"
            }
            rows={4}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitted}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitted ? "제출 완료" : "피드백 제출"}
        </button>

        {isSubmitted && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            피드백 고마워요.
          </span>
        )}
      </div>
    </section>
  );
}