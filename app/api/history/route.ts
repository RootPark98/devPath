import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { apiOk, apiErr } from "@/lib/devpath/api.server"; // 또는 "@/lib/api"에 넣었으면 그 경로
// DevPathErrorCode에 "NOT_FOUND"/"BAD_REQUEST"가 없으니 기존 코드로 매핑

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
  }

  const items = await prisma.history.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return apiOk(items);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
  }

  await prisma.history.deleteMany({ where: { userId: session.user.id } });
  return apiOk(true);
}
