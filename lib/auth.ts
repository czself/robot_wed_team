import "server-only";

import { kv } from "@vercel/kv";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

export type UserRole = "member" | "admin";
export type UserStatus = "active" | "disabled";

export interface TeamUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  group: string;
  passwordHash: string;
  status: UserStatus;
  createdAt: number;
  lastLoginAt?: number;
}

export interface PublicTeamUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  group: string;
  status: UserStatus;
  createdAt: number;
  lastLoginAt?: number;
}

const scryptAsync = promisify(scrypt);

const USERS_KEY = "team:users";
const USER_PREFIX = "team:user:";
const GROUPS = ["机械组", "嵌入式组", "视觉组", "算法组", "运营组", "综合"];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function userKey(id: string): string {
  return `${USER_PREFIX}${id}`;
}

function toPublicUser(user: TeamUser): PublicTeamUser {
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
}

export function validateUserInput(input: unknown):
  | {
      email: string;
      name: string;
      password: string;
      role: UserRole;
      group: string;
    }
  | string {
  if (!input || typeof input !== "object") return "请求体无效";
  const b = input as Record<string, unknown>;
  const email = normalizeEmail(String(b.email ?? ""));
  const name = String(b.name ?? "").trim();
  const password = String(b.password ?? "");
  const role = b.role === "admin" ? "admin" : "member";
  const group = String(b.group ?? "综合").trim() || "综合";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "邮箱格式不正确";
  if (!name || name.length > 24) return "姓名必填（最多 24 字）";
  if (password.length < 6 || password.length > 72) return "密码长度应为 6-72 位";
  if (!GROUPS.includes(group)) return "组别无效";

  return { email, name, password, role, group };
}

export function validateUserUpdateInput(input: unknown):
  | {
      id: string;
      name?: string;
      role?: UserRole;
      group?: string;
      status?: UserStatus;
      password?: string;
    }
  | string {
  if (!input || typeof input !== "object") return "请求体无效";
  const b = input as Record<string, unknown>;
  const id = normalizeEmail(String(b.id ?? ""));
  const name = typeof b.name === "string" ? b.name.trim() : undefined;
  const role = b.role === "admin" || b.role === "member" ? b.role : undefined;
  const group = typeof b.group === "string" ? b.group.trim() : undefined;
  const status =
    b.status === "active" || b.status === "disabled" ? b.status : undefined;
  const password = typeof b.password === "string" ? b.password : undefined;

  if (!id) return "缺少账号 ID";
  if (name !== undefined && (!name || name.length > 24)) return "姓名必填（最多 24 字）";
  if (group !== undefined && !GROUPS.includes(group)) return "组别无效";
  if (password !== undefined && (password.length < 6 || password.length > 72)) {
    return "密码长度应为 6-72 位";
  }
  if (
    name === undefined &&
    role === undefined &&
    group === undefined &&
    status === undefined &&
    password === undefined
  ) {
    return "没有可更新内容";
  }

  return { id, name, role, group, status, password };
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
  const user = (await kv.get(userKey(id))) as TeamUser | null;
  return user?.id ? user : null;
}

export async function getUserByEmail(email: string): Promise<TeamUser | null> {
  return getUserById(normalizeEmail(email));
}

export async function listUsers(): Promise<PublicTeamUser[]> {
  const ids = await kv.lrange(USERS_KEY, 0, -1);
  if (!ids.length) return [];

  const users = await kv.mget(...ids.map((id: string) => userKey(id)));
  return users
    .filter((user): user is TeamUser => Boolean(user && typeof user === "object"))
    .map(toPublicUser)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  group: string;
}): Promise<PublicTeamUser> {
  const id = normalizeEmail(input.email);
  const existing = await getUserById(id);
  if (existing) throw new Error("账号已存在");

  const user: TeamUser = {
    id,
    email: id,
    name: input.name.trim(),
    role: input.role,
    group: input.group,
    passwordHash: await hashPassword(input.password),
    status: "active",
    createdAt: Date.now(),
  };

  await kv.set(userKey(user.id), user);
  await kv.lpush(USERS_KEY, user.id);
  return toPublicUser(user);
}

export async function updateUser(
  input: {
    id: string;
    name?: string;
    role?: UserRole;
    group?: string;
    status?: UserStatus;
    password?: string;
  },
  actorId: string
): Promise<PublicTeamUser> {
  const user = await getUserById(input.id);
  if (!user) throw new Error("账号不存在");
  if (user.id === actorId && input.status === "disabled") {
    throw new Error("不能禁用当前登录账号");
  }
  if (user.id === actorId && input.role && input.role !== "admin") {
    throw new Error("不能取消当前登录账号的管理员权限");
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
  };

  await kv.set(userKey(next.id), next);
  return toPublicUser(next);
}

export async function deleteUser(
  id: string,
  actorId: string
): Promise<{ deleted: boolean }> {
  const normalizedId = normalizeEmail(id);
  if (!normalizedId) throw new Error("缺少账号 ID");
  if (normalizedId === actorId) throw new Error("不能删除当前登录账号");

  const existing = await getUserById(normalizedId);
  if (!existing) return { deleted: false };

  await kv.del(userKey(normalizedId));
  await kv.lrem(USERS_KEY, 0, normalizedId);
  return { deleted: true };
}

export async function authenticateUser(email: string, password: string): Promise<TeamUser | null> {
  const user = await getUserByEmail(email);
  if (!user || user.status !== "active") return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  await kv.set(userKey(user.id), { ...user, lastLoginAt: Date.now() });
  return { ...user, lastLoginAt: Date.now() };
}

export async function ensureBootstrapAdmin(): Promise<void> {
  const adminEmail = normalizeEmail(
    process.env.TEAM_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@yz-control.local"
  );
  const adminPassword = process.env.TEAM_ADMIN_PASSWORD || process.env.ADMIN_KEY;
  if (!adminPassword) return;
  if (adminPassword.length < 6) {
    console.warn("TEAM_ADMIN_PASSWORD/ADMIN_KEY is too short, skip bootstrap admin");
    return;
  }

  const existing = await getUserById(adminEmail);
  if (existing) return;

  await createUser({
    email: adminEmail,
    name: "系统管理员",
    password: adminPassword,
    role: "admin",
    group: "综合",
  });
}

export function publicUser(user: TeamUser): PublicTeamUser {
  return toPublicUser(user);
}
