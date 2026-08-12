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

export async function currentApiAdmin(): Promise<
  | { ok: true; user: PublicTeamUser }
  | { ok: false; response: NextResponse }
> {
  const auth = await currentApiUser();
  if (!auth.ok) return auth;
  if (auth.user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "无权限" }, { status: 403 }),
    };
  }
  return auth;
}
