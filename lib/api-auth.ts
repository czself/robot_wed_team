import "server-only";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import type { PublicTeamUser } from "@/lib/auth";

export async function currentApiUser(): Promise<
  | { ok: true; user: PublicTeamUser }
  | { ok: false; response: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "未登录" }, { status: 401 }),
    };
  }
  return { ok: true, user };
}

export async function currentApiMember(): Promise<
  | { ok: true; user: PublicTeamUser }
  | { ok: false; response: NextResponse }
> {
  return currentApiUser();
}
