"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadPortOne } from "@/lib/portone.browser";

type PackageType = "starter" | "pro" | "max";

export function BuyCreditsButton({ packageType }: { packageType: PackageType }) {
  const router = useRouter(); // 컴포넌트 최상단에서만.
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
      // 1) 서버에서 paymentId/amount/credits 준비 (PaymentIntent PENDING 생성)
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
      // storeId/channelKey/paymentId/totalAmount/currency/payMethod 등 파라미터 패턴은 v2 requestPayment 예시와 동일 :contentReference[oaicite:6]{index=6}
      const response = await window.PortOne!.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName: `devPath 크레딧 충전 (${credits} credits)`,
        totalAmount: amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        // (선택) 웹훅 URL을 여기서 지정하는 케이스도 있음. 서버쪽 webhook 엔드포인트와 일치시키면 됨. :contentReference[oaicite:7]{index=7}
        // noticeUrls: [`${location.origin}/api/billing/portone/webhook`],
      });

      // 4) 응답 처리 (중요: 최종 적립은 "웹훅"에서)
      // requestPayment 응답에는 txId/paymentId/에러코드 등이 있음 :contentReference[oaicite:8]{index=8}
      if (response?.code) {
        alert(response?.message ?? "결제가 취소/실패했습니다.");
        return;
      }

      // 성공: 대기 화면으로
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
      className="rounded-md border px-3 py-2 text-sm disabled:opacity-60"
    >
      {loading ? "결제 진행 중..." : "크레딧 구매"}
    </button>
  );
}