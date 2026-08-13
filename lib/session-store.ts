import "server-only";

import { kv } from "@/lib/kv";
import { randomBytes } from "crypto";

const SESSION_PREFIX = "team:session:";
const USER_SESSIONS_PREFIX = "team:user-sessions:";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export interface SessionRecord {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

function sessionKey(token: string): string {
  return `${SESSION_PREFIX}${token}`;
}

function userSessionsKey(userId: string): string {
  return `${USER_SESSIONS_PREFIX}${userId}`;
}

export async function createSessionRecord(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  const session: SessionRecord = {
    token,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_MAX_AGE * 1000,
  };

  await kv.set(sessionKey(token), session, { ex: SESSION_MAX_AGE });
  await kv.sadd(userSessionsKey(userId), token);
  await kv.expire(userSessionsKey(userId), SESSION_MAX_AGE);
  return token;
}

export async function getSessionRecord(token: string): Promise<SessionRecord | null> {
  const session = (await kv.get(sessionKey(token))) as SessionRecord | null;
  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      await deleteSessionRecord(token, session.userId);
    }
    return null;
  }
  return session;
}

export async function deleteSessionRecord(
  token: string,
  knownUserId?: string
): Promise<void> {
  let userId = knownUserId;
  if (!userId) {
    const session = (await kv.get(sessionKey(token))) as SessionRecord | null;
    userId = session?.userId;
  }

  await kv.del(sessionKey(token));
  if (userId) {
    await kv.srem(userSessionsKey(userId), token);
  }
}

export async function revokeUserSessions(userId: string): Promise<void> {
  const indexKey = userSessionsKey(userId);
  const tokens = await kv.smembers(indexKey);
  if (tokens.length) {
    await kv.del(...tokens.map((token) => sessionKey(String(token))));
  }
  await kv.del(indexKey);
}
