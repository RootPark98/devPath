"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Status = "PENDING" | "PAID" | "FAILED" | "CANCELED" | "CANCELLED" | string;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function prettyStatus(s: Status) {
  if (s === "PAID") return "결제 완료";
  if (s === "PENDING") return "확인 중";
  if (s === "FAILED") return "결제 실패";
  if (s === "CANCELED" || s === "CANCELLED") return "결제 취소";
  return s;
}

function badgeClass(s: Status) {
  if (s === "PAID")
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (s === "FAILED" || s === "CANCELED" || s === "CANCELLED")
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  return "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-200";
}

export default function BillingWaitPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const paymentId = sp.get("paymentId") ?? "";

  const [status, setStatus] = useState<Status>("PENDING");
  const [secondsLeft, setSecondsLeft] = useState(12);
  const [message, setMessage] = useState<string>("웹훅 반영을 기다리고 있어요.");
  const [isDone, setIsDone] = useState(false);

  const canPoll = useMemo(() => Boolean(paymentId), [paymentId]);

  useEffect(() => {
    if (!canPoll) return;

    let cancelled = false;

    const run = async () => {
      const timeoutMs = 12000;
      const intervalMs = 800;
      const started = Date.now();

      while (!cancelled && Date.now() - started < timeoutMs) {
        const remaining = Math.max(
          0,
          Math.ceil((timeoutMs - (Date.now() - started)) / 1000)
        );
        setSecondsLeft(remaining);

        const res = await fetch(
          `/api/billing/payment-intent/status?paymentId=${encodeURIComponent(paymentId)}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);

        if (json?.ok) {
          const s: Status = json.data.status;
          setStatus(s);

          if (s === "PAID") {
            setMessage("충전이 완료됐어요! 메인으로 이동합니다.");
            setIsDone(true);
            await sleep(700);
            router.replace("/");
            return;
          }

          if (s === "FAILED" || s === "CANCELED" || s === "CANCELLED") {
            setMessage("결제가 실패/취소되었어요. 다시 시도해 주세요.");
            setIsDone(true);
            return;
          }
        }

        await sleep(intervalMs);
      }

      setStatus("PENDING");
      setMessage("반영이 지연되고 있어요. 메인에서 크레딧을 다시 확인해 주세요.");
      setIsDone(true);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [canPoll, paymentId, router]);

  // paymentId 없음
  if (!canPoll) {
    return (
      <main className="min-h-[70vh] grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <section className="dp-card">
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">결제 확인</h1>
              <p className="text-sm dp-muted">
                paymentId가 없어서 결제 상태를 확인할 수 없어요.
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => router.replace("/billing")} className="dp-btn w-full">
                결제 페이지로
              </button>
              <button onClick={() => router.replace("/")} className="dp-btn-primary w-full">
                메인으로
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* back */}
        <div className="mb-4">
          <button
            onClick={() => router.replace("/billing")}
            className="text-sm dp-muted hover:text-black dark:hover:text-white transition"
          >
            ← 결제 페이지로
          </button>
        </div>

        <section className="dp-card">
          {/* Top */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold">결제 처리</h1>
              <p className="text-sm dp-muted">
                결제는 완료되었고, 크레딧 반영을 확인하고 있어요.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={[
                  "rounded-full border px-2.5 py-1 text-xs font-semibold",
                  badgeClass(status),
                ].join(" ")}
              >
                {prettyStatus(status)}
              </span>

              <div
                className={[
                  "h-9 w-9 rounded-full border-2 border-t-transparent",
                  "border-neutral-300 dark:border-neutral-700",
                  isDone ? "opacity-40" : "animate-spin",
                ].join(" ")}
                aria-label="loading"
              />
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs dp-muted">남은 확인 시간</div>
                <div className="text-base font-semibold">{secondsLeft}s</div>
              </div>
              <div className="text-right">
                <div className="text-xs dp-muted">상태</div>
                <div className="text-sm font-medium">
                  {isDone ? "완료" : "자동 확인 중"}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="mt-4 text-sm">{message}</p>

          {/* paymentId (collapse) */}
          <details className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
            <summary className="cursor-pointer text-xs font-semibold dp-muted">
              paymentId 보기
            </summary>
            <div className="mt-2 font-mono text-xs break-all">
              {paymentId}
            </div>
          </details>

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <button onClick={() => router.replace("/")} className="dp-btn-primary w-full">
              메인으로
            </button>
            <button onClick={() => router.replace("/billing")} className="dp-btn w-full">
              다시 결제
            </button>
          </div>

          <p className="mt-3 text-xs dp-muted">
            반영이 늦어도 메인 상단 크레딧 배지에서 잔고가 갱신됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}