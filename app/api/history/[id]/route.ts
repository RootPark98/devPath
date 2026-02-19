import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { apiOk, apiErr } from "@/lib/devpath/api.server";

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return apiErr("UNAUTHENTICATED", "로그인이 필요합니다.", 401);
    }

    const resolved = await Promise.resolve(context.params);
    const id = resolved?.id;

    if (!id || typeof id !== "string") {
        return apiErr("BAD_REQUEST", "history id가 필요합니다.", 400, { 
            params: resolved ?? null, 
        });
    }

    const item = await prisma.history.findUnique({
        where: { id },
        select: { id: true, userId: true },
    });

    if (!item) {
        return apiErr("NOT_FOUND", "히스토리를 찾을 수 없습니다.", 404);
    }

    if (item.userId !== session.user.id) {
        return apiErr("FORBIDDEN", "접근 권한이 없습니다.", 403);
    }

    await prisma.history.delete({ where: { id } });
    return apiOk(true);
}
