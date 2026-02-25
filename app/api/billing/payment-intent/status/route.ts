import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { apiErr, apiOk } from "@/lib/devpath/api.server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
  }

  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return apiErr("INVALID_INPUT", "paymentId가 필요합니다.", 400);
  }

  const intent = await prisma.paymentIntent.findUnique({
    // paymentId를 merchantUid 컬럼에 저장 중(의미만 paymentId로 통일)
    where: { merchantUid: paymentId },
    select: { userId: true, status: true, amount: true, credits: true },
  });

  if (!intent || intent.userId !== session.user.id) {
    return apiErr("NOT_FOUND", "결제 정보를 찾을 수 없습니다.", 404);
  }

  return apiOk(
    {
      paymentId,
      status: intent.status, // "PENDING" | "PAID" | "FAILED" 등
      amount: intent.amount,
      credits: intent.credits,
    },
    200
  );
}