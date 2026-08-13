import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUserById, publicUser, type PublicTeamUser, type TeamUser } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import {
  createSessionRecord,
  deleteSessionRecord,
  getSessionRecord,
  SESSION_MAX_AGE,
} from "@/lib/session-store";

export async function createSession(userId: string): Promise<string> {
  return createSessionRecord(userId);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    priority: "high",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await deleteSessionRecord(token);
  cookieStore.delete(SESSION_COOKIE);
}

async function readSessionUser(): Promise<TeamUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await getSessionRecord(token);
  if (!session) return null;

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
  const user = await requirePasswordReadyUser();
  if (user.role !== "admin") redirect("/portal");
  return user;
}

export async function requirePasswordReadyUser(): Promise<PublicTeamUser> {
  const user = await requireUser();
  if (user.mustChangePassword) redirect("/portal?password=required");
  return user;
}
