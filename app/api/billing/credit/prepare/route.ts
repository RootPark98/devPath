import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { apiErr, apiOk } from "@/lib/devpath/api.server";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

const PACKAGES = {
  starter: { amount: 5900, credits: 100 },
  pro: { amount: 19000, credits: 400 },
  max: { amount: 39000, credits: 1000 },
} as const;

type PackageType = keyof typeof PACKAGES;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
    }

    const raw = await request.json().catch(() => null);
    const packageType = raw?.packageType as PackageType | undefined;

    if (!packageType || !(packageType in PACKAGES)) {
      return apiErr("INVALID_INPUT", "잘못된 패키지 타입입니다.", 400, {
        allowed: Object.keys(PACKAGES),
      });
    }

    const { amount, credits } = PACKAGES[packageType];

    // ✅ PortOne V2 기준: paymentId(주문 고유 번호)로 통일
    const paymentId = `devpath_${randomUUID().replaceAll("-", "")}`;

    await prisma.paymentIntent.create({
      data: {
        userId: session.user.id,
        // DB 컬럼명은 merchantUid지만, 의미는 paymentId로 사용
        merchantUid: paymentId,
        amount,
        credits,
        status: "PENDING",
      },
      select: { id: true },
    });

    return apiOk(
      {
        paymentId,
        amount,
        credits,
        packageType,
      },
      201
    );
  } catch (e: any) {
    return apiErr("INTERNAL_ERROR", "서버 처리 중 오류", 500, {
      error: String(e?.message ?? e),
    });
  }
}