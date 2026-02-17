import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import type { ApiResponse } from "@/lib/devpath/api";
import { authOptions } from "@/lib/authOptions";

type Me = {
  authenticated: boolean;
  user?: { name?: string | null; email?: string | null; image?: string | null };
};

function ok<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { ok: true, data };
  return NextResponse.json(body, { status });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return ok<Me>({ authenticated: false }, 200);
  }

  return ok<Me>(
    {
      authenticated: true,
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    },
    200
  );
}