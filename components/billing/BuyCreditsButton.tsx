"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadPortOne } from "@/lib/portone.browser";

type PackageType = "starter" | "pro" | "max";

export function BuyCreditsButton({
  packageType,
  className,
  fullWidth = true,
  label = "지금 구매하기",
}: {
  packageType: PackageType;
  className?: string;
  fullWidth?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID!;
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

  const onClick = async () => {
    if (!storeId || !channelKey) {
      alert("PORTONE env가 설정되지 않았습니다.");
      return;
    }

    setLoading(true);
    try {
      // 1) 서버에서 paymentId/amount/credits 준비
      const res = await fetch("/api/billing/credit/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageType }),
      });
      const json = await res.json().catch(() => null);

      if (!json?.ok) {
        alert(json?.message ?? "결제 준비 실패");
        return;
      }

      const { paymentId, amount, credits } = json.data as {
        paymentId: string;
        amount: number;
        credits: number;
      };

      // 2) PortOne SDK 로드
      await loadPortOne();

      // 3) 결제창 호출
      const response = await window.PortOne!.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName: `devPath 크레딧 충전 (${credits} credits)`,
        totalAmount: amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
      });

      // 4) 응답 처리
      if (response?.code) {
        alert(response?.message ?? "결제가 취소/실패했습니다.");
        return;
      }

      router.push(`/billing/wait?paymentId=${encodeURIComponent(paymentId)}`);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "결제 처리 중 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={[
        fullWidth ? "w-full" : "",
        "inline-flex items-center justify-center gap-2",
        "rounded-xl bg-black px-4 py-2.5",
        "text-sm font-semibold text-white",
        "shadow-sm transition",
        "hover:opacity-90 active:opacity-80",
        "disabled:opacity-50",
        className ?? "",
      ].join(" ")}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          결제 진행 중...
        </>
      ) : (
        label
      )}
    </button>
  );
}