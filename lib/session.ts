import "server-only";

import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { cache } from "react";
import { getUserById, publicUser, type PublicTeamUser, type TeamUser } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const SESSION_PREFIX = "team:session:";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

interface SessionRecord {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

function sessionKey(token: string): string {
  return `${SESSION_PREFIX}${token}`;
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  const session: SessionRecord = {
    token,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_MAX_AGE * 1000,
  };
  await kv.set(sessionKey(token), session, { ex: SESSION_MAX_AGE });
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await kv.del(sessionKey(token));
  cookieStore.delete(SESSION_COOKIE);
}

async function readSessionUser(): Promise<TeamUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = (await kv.get(sessionKey(token))) as SessionRecord | null;
  if (!session || session.expiresAt < Date.now()) {
    await kv.del(sessionKey(token));
    return null;
  }

  const user = await getUserById(session.userId);
  if (!user || user.status !== "active") return null;
  return user;
}

export const getCurrentUser = cache(async (): Promise<PublicTeamUser | null> => {
  const user = await readSessionUser();
  return user ? publicUser(user) : null;
});

export async function requireUser(): Promise<PublicTeamUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<PublicTeamUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/portal");
  return user;
}
