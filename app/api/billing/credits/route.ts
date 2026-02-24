import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { apiErr, apiOk } from "@/lib/devpath/api.server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
  }

  const row = await prisma.creditBalance.findUnique({
    where: { userId: session.user.id },
    select: { balance: true },
  });

  return apiOk({ balance: row?.balance ?? 0 }, 200);
}