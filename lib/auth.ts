import "server-only";

import { kv } from "@/lib/kv";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { validatePassword } from "@/lib/security";
import { revokeUserSessions } from "@/lib/session-store";

export type UserRole = "admin" | "member";
export type UserStatus = "active" | "disabled";

export interface TeamUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  role: UserRole;
  group: string;
  passwordHash: string;
  status: UserStatus;
  mustChangePassword?: boolean;
  createdAt: number;
  lastLoginAt?: number;
}

export interface PublicTeamUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  group: string;
  status: UserStatus;
  mustChangePassword: boolean;
  createdAt: number;
  lastLoginAt?: number;
}

const scryptAsync = promisify(scrypt);

const USERS_KEY = "team:users";
const USER_PREFIX = "team:user:";
const GROUPS = ["机械组", "嵌入式组", "视觉组", "算法组", "运营组", "综合"];

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function isValidUsername(username: string): boolean {
  return /^\d{6,20}$/.test(username);
}

function userKey(id: string): string {
  return `${USER_PREFIX}${id}`;
}

function normalizeStoredUser(user: TeamUser): TeamUser {
  return {
    ...user,
    role: user.role === "admin" ? "admin" : "member",
    mustChangePassword: Boolean(user.mustChangePassword),
  };
}

function toPublicUser(user: TeamUser): PublicTeamUser {
  const normalized = normalizeStoredUser(user);
  const { passwordHash, ...safeUser } = normalized;
  void passwordHash;
  const username = safeUser.username || safeUser.id;
  return {
    ...safeUser,
    username,
    mustChangePassword: Boolean(safeUser.mustChangePassword),
  };
}

export function validateUserInput(input: unknown):
  | {
      username: string;
      name: string;
      password: string;
      group: string;
      role: UserRole;
    }
  | string {
  if (!input || typeof input !== "object") return "请求体无效";
  const b = input as Record<string, unknown>;
  const username = normalizeUsername(String(b.username ?? b.email ?? ""));
  const name = String(b.name ?? "").trim();
  const password = String(b.password ?? "");
  const group = String(b.group ?? "综合").trim() || "综合";
  const role = b.role === undefined || b.role === "member" ? "member" : b.role === "admin" ? "admin" : null;

  if (!isValidUsername(username)) return "用户名必须是 6-20 位数字学号";
  if (!name || name.length > 24) return "姓名必填（最多 24 字）";
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;
  if (!GROUPS.includes(group)) return "组别无效";
  if (!role) return "账号权限无效";

  return { username, name, password, group, role };
}

export function validateUserUpdateInput(input: unknown):
  | {
      id: string;
      name?: string;
      group?: string;
      status?: UserStatus;
      password?: string;
      role?: UserRole;
    }
  | string {
  if (!input || typeof input !== "object") return "请求体无效";
  const b = input as Record<string, unknown>;
  const id = normalizeUsername(String(b.id ?? ""));
  const name = typeof b.name === "string" ? b.name.trim() : undefined;
  const group = typeof b.group === "string" ? b.group.trim() : undefined;
  const status =
    b.status === "active" || b.status === "disabled" ? b.status : undefined;
  const password = typeof b.password === "string" ? b.password : undefined;
  const role =
    b.role === "admin" || b.role === "member" ? b.role : undefined;

  if (!isValidUsername(id)) return "账号 ID 无效";
  if (name !== undefined && (!name || name.length > 24)) return "姓名必填（最多 24 字）";
  if (group !== undefined && !GROUPS.includes(group)) return "组别无效";
  if (b.role !== undefined && role === undefined) return "账号权限无效";
  if (password !== undefined) {
    const passwordError = validatePassword(password);
    if (passwordError) return passwordError;
  }
  if (
    name === undefined &&
    group === undefined &&
    status === undefined &&
    password === undefined &&
    role === undefined
  ) {
    return "没有可更新内容";
  }

  return { id, name, group, status, password, role };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [scheme, salt, stored] = passwordHash.split(":");
  if (scheme !== "scrypt" || !salt || !stored) return false;

  const storedBuffer = Buffer.from(stored, "hex");
  const derived = (await scryptAsync(password, salt, storedBuffer.length)) as Buffer;
  if (storedBuffer.length !== derived.length) return false;
  return timingSafeEqual(storedBuffer, derived);
}

export async function getUserById(id: string): Promise<TeamUser | null> {
  const user = (await kv.get(userKey(normalizeUsername(id)))) as TeamUser | null;
  return user?.id ? normalizeStoredUser(user) : null;
}

export async function getUserByUsername(username: string): Promise<TeamUser | null> {
  return getUserById(normalizeUsername(username));
}

export async function listUsers(): Promise<PublicTeamUser[]> {
  const ids = [...new Set(await kv.lrange(USERS_KEY, 0, -1))];
  if (!ids.length) return [];

  const users = await kv.mget(...ids.map((id: string) => userKey(id)));
  return users
    .filter((user): user is TeamUser => Boolean(user && typeof user === "object"))
    .map(toPublicUser)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createUser(input: {
  username: string;
  name: string;
  password: string;
  group: string;
  role?: UserRole;
  mustChangePassword?: boolean;
}): Promise<PublicTeamUser> {
  const validated = validateUserInput(input);
  if (typeof validated === "string") throw new Error(validated);
  const id = validated.username;
  const existing = await getUserById(id);
  if (existing) throw new Error("账号已存在");

  const user: TeamUser = {
    id,
    email: id,
    username: id,
    name: validated.name,
    role: validated.role,
    group: validated.group,
    passwordHash: await hashPassword(validated.password),
    status: "active",
    mustChangePassword: input.mustChangePassword ?? true,
    createdAt: Date.now(),
  };

  const stored = await kv.set(userKey(user.id), user, { nx: true });
  if (stored !== "OK") throw new Error("账号已存在");
  await kv.lpush(USERS_KEY, user.id);
  return toPublicUser(user);
}

export async function updateUser(
  input: {
    id: string;
    name?: string;
    group?: string;
    status?: UserStatus;
    password?: string;
    role?: UserRole;
  },
  actorId: string
): Promise<PublicTeamUser> {
  const user = await getUserById(input.id);
  if (!user) throw new Error("账号不存在");
  if (user.id === actorId && input.status === "disabled") {
    throw new Error("不能禁用当前登录账号");
  }
  if (user.id === actorId && input.role === "member") {
    throw new Error("不能移除当前账号的管理员权限");
  }

  const next: TeamUser = {
    ...user,
    name: input.name ?? user.name,
    role: input.role ?? user.role,
    group: input.group ?? user.group,
    status: input.status ?? user.status,
    passwordHash: input.password
      ? await hashPassword(input.password)
      : user.passwordHash,
    mustChangePassword: input.password ? true : user.mustChangePassword,
  };

  await kv.set(userKey(next.id), next);
  if (input.password || input.status === "disabled" || input.role) {
    await revokeUserSessions(next.id);
  }
  return toPublicUser(next);
}

export async function deleteUser(
  id: string,
  actorId: string
): Promise<{ deleted: boolean }> {
  const normalizedId = normalizeUsername(id);
  if (!isValidUsername(normalizedId)) throw new Error("账号 ID 无效");
  if (normalizedId === actorId) throw new Error("不能删除当前登录账号");

  const existing = await getUserById(normalizedId);
  if (!existing) return { deleted: false };

  await revokeUserSessions(normalizedId);
  await kv.del(userKey(normalizedId));
  await kv.lrem(USERS_KEY, 0, normalizedId);
  return { deleted: true };
}

export async function changeOwnPassword(input: {
  userId: string;
  currentPassword: string;
  nextPassword: string;
}): Promise<void> {
  const user = await getUserById(input.userId);
  if (!user || user.status !== "active") throw new Error("账号不存在");
  const passwordError = validatePassword(input.nextPassword);
  if (passwordError) throw new Error(passwordError);
  if (input.currentPassword === input.nextPassword) {
    throw new Error("新密码不能与当前密码相同");
  }

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!valid) throw new Error("当前密码不正确");

  await kv.set(userKey(user.id), {
    ...user,
    passwordHash: await hashPassword(input.nextPassword),
    mustChangePassword: false,
  });
  await revokeUserSessions(user.id);
}

export async function authenticateUser(username: string, password: string): Promise<TeamUser | null> {
  const user = await getUserByUsername(username);
  if (!user || user.status !== "active") return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  const now = Date.now();
  await kv.set(userKey(user.id), { ...user, lastLoginAt: now });
  return { ...user, lastLoginAt: now };
}

export async function ensureBootstrapAdmin(): Promise<void> {
  const ownerUsername = normalizeUsername(
    process.env.TEAM_ADMIN_USERNAME ||
      process.env.TEAM_MEMBER_USERNAME ||
      ""
  );
  if (!ownerUsername) return;
  if (!isValidUsername(ownerUsername)) {
    console.warn("Admin bootstrap skipped: username must be a 6-20 digit student ID");
    return;
  }

  const ownerPassword =
    process.env.TEAM_ADMIN_PASSWORD ||
    process.env.TEAM_MEMBER_PASSWORD ||
    "";

  const existing = await getUserById(ownerUsername);
  if (existing) {
    if (existing.role !== "admin") {
      await kv.set(userKey(ownerUsername), {
        ...existing,
        role: "admin",
        mustChangePassword: true,
      });
      await revokeUserSessions(ownerUsername);
    }
    return;
  }

  const legacyUsername = normalizeUsername(
    process.env.TEAM_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ""
  );
  if (legacyUsername && legacyUsername !== ownerUsername) {
    const legacyUser = await getUserById(legacyUsername);
    if (legacyUser) {
      const migrated: TeamUser = {
        ...legacyUser,
        id: ownerUsername,
        email: ownerUsername,
        username: ownerUsername,
        role: "admin",
        name: legacyUser.name || "队员",
        mustChangePassword: true,
      };
      await kv.set(userKey(ownerUsername), migrated);
      await kv.lpush(USERS_KEY, ownerUsername);
      await kv.del(userKey(legacyUsername));
      await kv.lrem(USERS_KEY, 0, legacyUsername);
      await revokeUserSessions(legacyUsername);
      return;
    }
  }

  if (!ownerPassword) {
    console.warn("Admin bootstrap skipped: TEAM_ADMIN_PASSWORD is not configured");
    return;
  }
  const passwordError = validatePassword(ownerPassword);
  if (passwordError) {
    console.warn(`Admin bootstrap skipped: ${passwordError}`);
    return;
  }

  await createUser({
    username: ownerUsername,
    name: "队员",
    password: ownerPassword,
    group: "综合",
    role: "admin",
    mustChangePassword: true,
  });
}

export function publicUser(user: TeamUser): PublicTeamUser {
  return toPublicUser(user);
}
