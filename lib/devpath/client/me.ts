import { readApiResponse } from "@/lib/devpath/client/errors";

export type Me = {
  authenticated: boolean;
  user?: { name?: string | null; email?: string | null; image?: string | null };
};

export async function getMe(): Promise<Me> {
  const res = await fetch("/api/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return readApiResponse<Me>(res);
}
