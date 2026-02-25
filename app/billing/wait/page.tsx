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
        const remaining = Math.max(0, Math.ceil((timeoutMs - (Date.now() - started)) / 1000));
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

      setMessage("반영이 지연되고 있어요. 메인에서 크레딧을 다시 확인해 주세요.");
      setIsDone(true);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [canPoll, paymentId, router]);

  if (!canPoll) {
    return (
      <main className="min-h-[70vh] grid place-items-center p-6">
        <div className="w-full max-w-md rounded-xl border p-5">
          <div className="text-lg font-semibold">결제 확인</div>
          <p className="mt-2 text-sm opacity-70">
            paymentId가 없어서 결제 상태를 확인할 수 없어요.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => router.replace("/billing")}
            >
              결제 페이지로
            </button>
            <button
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => router.replace("/")}
            >
              메인으로
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">결제 확인 중</div>
            <div className="mt-1 text-sm opacity-70">
              결제는 완료되었고, 크레딧 반영을 확인하고 있어요.
            </div>
          </div>

          {/* 로딩 링 */}
          <div
            className={`h-10 w-10 rounded-full border-2 border-t-transparent animate-spin ${
              isDone ? "opacity-40 animate-none" : ""
            }`}
            aria-label="loading"
          />
        </div>

        <div className="mt-5 rounded-xl bg-black/5 p-4">
          <div className="text-xs opacity-70">paymentId</div>
          <div className="mt-1 font-mono text-xs break-all">{paymentId}</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-xs opacity-70">상태</div>
            <div className="text-base font-semibold">{prettyStatus(status)}</div>
          </div>

          <div className="text-right">
            <div className="text-xs opacity-70">남은 확인 시간</div>
            <div className="text-base font-semibold">{secondsLeft}s</div>
          </div>
        </div>

        <p className="mt-4 text-sm">{message}</p>

        {isDone && (
          <div className="mt-5 flex gap-2">
            <button
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              onClick={() => router.replace("/")}
            >
              메인으로
            </button>
            <button
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              onClick={() => router.replace("/billing")}
            >
              다시 결제
            </button>
          </div>
        )}

        {!isDone && (
          <div className="mt-5 flex gap-2">
            <button
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              onClick={() => router.replace("/")}
            >
              메인으로 이동
            </button>
            <button
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              onClick={() => router.replace("/billing")}
            >
              결제 페이지
            </button>
          </div>
        )}
      </div>
    </main>
  );
}