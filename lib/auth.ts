import "server-only";

import { kv } from "@vercel/kv";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

export type UserRole = "member";
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
  createdAt: number;
  lastLoginAt?: number;
}

const scryptAsync = promisify(scrypt);

const USERS_KEY = "team:users";
const USER_PREFIX = "team:user:";
const GROUPS = ["机械组", "嵌入式组", "视觉组", "算法组", "运营组", "综合"];
const DEFAULT_MEMBER_PASSWORD = "123456";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function isValidUsername(username: string): boolean {
  return /^\d{6,20}$/.test(username);
}

function userKey(id: string): string {
  return `${USER_PREFIX}${id}`;
}

function toPublicUser(user: TeamUser): PublicTeamUser {
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  const username = safeUser.username || safeUser.id;
  return { ...safeUser, username };
}

export function validateUserInput(input: unknown):
  | {
      username: string;
      name: string;
      password: string;
      group: string;
    }
  | string {
  if (!input || typeof input !== "object") return "请求体无效";
  const b = input as Record<string, unknown>;
  const username = normalizeUsername(String(b.username ?? b.email ?? ""));
  const name = String(b.name ?? "").trim();
  const password = String(b.password ?? "123456");
  const group = String(b.group ?? "综合").trim() || "综合";

  if (!isValidUsername(username)) return "用户名必须是 6-20 位数字学号";
  if (!name || name.length > 24) return "姓名必填（最多 24 字）";
  if (password.length < 6 || password.length > 72) return "密码长度应为 6-72 位";
  if (!GROUPS.includes(group)) return "组别无效";

  return { username, name, password, group };
}

export function validateUserUpdateInput(input: unknown):
  | {
      id: string;
      name?: string;
      group?: string;
      status?: UserStatus;
      password?: string;
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

  if (!id) return "缺少账号 ID";
  if (name !== undefined && (!name || name.length > 24)) return "姓名必填（最多 24 字）";
  if (group !== undefined && !GROUPS.includes(group)) return "组别无效";
  if (password !== undefined && (password.length < 6 || password.length > 72)) {
    return "密码长度应为 6-72 位";
  }
  if (
    name === undefined &&
    group === undefined &&
    status === undefined &&
    password === undefined
  ) {
    return "没有可更新内容";
  }

  return { id, name, group, status, password };
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
  return user?.id ? user : null;
}

export async function getUserByUsername(username: string): Promise<TeamUser | null> {
  return getUserById(normalizeUsername(username));
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
  username: string;
  name: string;
  password: string;
  group: string;
}): Promise<PublicTeamUser> {
  const id = normalizeUsername(input.username);
  const existing = await getUserById(id);
  if (existing) throw new Error("账号已存在");

  const user: TeamUser = {
    id,
    email: id,
    username: id,
    name: input.name.trim(),
    role: "member",
    group: input.group,
    passwordHash: await hashPassword(input.password),
    status: "active",
    createdAt: Date.now(),
  };

  await kv.set(userKey(user.id), user);
  await kv.lpush(USERS_KEY, user.id);
  return toPublicUser(user);
}

async function createUserIfMissing(input: {
  username: string;
  name: string;
  password: string;
  group: string;
}): Promise<void> {
  const id = normalizeUsername(input.username);
  const existing = await getUserById(id);
  if (existing) return;
  await createUser({ ...input, username: id });
}

export async function updateUser(
  input: {
    id: string;
    name?: string;
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

  const next: TeamUser = {
    ...user,
    name: input.name ?? user.name,
    role: "member",
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
  const normalizedId = normalizeUsername(id);
  if (!normalizedId) throw new Error("缺少账号 ID");
  if (normalizedId === actorId) throw new Error("不能删除当前登录账号");

  const existing = await getUserById(normalizedId);
  if (!existing) return { deleted: false };

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
  if (input.nextPassword.length < 6 || input.nextPassword.length > 72) {
    throw new Error("新密码长度应为 6-72 位");
  }
  if (input.currentPassword === input.nextPassword) {
    throw new Error("新密码不能与当前密码相同");
  }

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!valid) throw new Error("当前密码不正确");

  await kv.set(userKey(user.id), {
    ...user,
    passwordHash: await hashPassword(input.nextPassword),
  });
}

export async function authenticateUser(username: string, password: string): Promise<TeamUser | null> {
  const user = await getUserByUsername(username);
  if (!user || user.status !== "active") return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  await kv.set(userKey(user.id), { ...user, lastLoginAt: Date.now() });
  return { ...user, lastLoginAt: Date.now() };
}

export async function ensureBootstrapAdmin(): Promise<void> {
  const ownerUsername = normalizeUsername(
    process.env.TEAM_MEMBER_USERNAME ||
      process.env.TEAM_ADMIN_USERNAME ||
      process.env.TEAM_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "2025754227"
  );
  const ownerPassword =
    process.env.TEAM_MEMBER_PASSWORD ||
    process.env.TEAM_ADMIN_PASSWORD ||
    process.env.ADMIN_KEY;
  if (!ownerPassword) return;
  if (ownerPassword.length < 6) {
    console.warn("TEAM_MEMBER_PASSWORD/TEAM_ADMIN_PASSWORD is too short, skip bootstrap member");
    return;
  }

  const existing = await getUserById(ownerUsername);
  if (!existing) {
    const legacyAdminEmail = normalizeUsername("3421798408@qq.com");
    const legacyUser = await getUserById(legacyAdminEmail);
    if (legacyUser) {
      const migrated: TeamUser = {
        ...legacyUser,
        id: ownerUsername,
        email: ownerUsername,
        username: ownerUsername,
        role: "member",
        name: legacyUser.name || "队员",
      };
      await kv.set(userKey(ownerUsername), migrated);
      await kv.lpush(USERS_KEY, ownerUsername);
      await kv.del(userKey(legacyAdminEmail));
      await kv.lrem(USERS_KEY, 0, legacyAdminEmail);
    }
  }

  const migratedExisting = await getUserById(ownerUsername);
  if (migratedExisting) {
    await createUserIfMissing({
      username: "2024754137",
      name: "新队员",
      password: DEFAULT_MEMBER_PASSWORD,
      group: "综合",
    });
    return;
  }

  await createUser({
    username: ownerUsername,
    name: "队员",
    password: ownerPassword,
    group: "综合",
  });

  await createUserIfMissing({
    username: "2024754137",
    name: "新队员",
    password: DEFAULT_MEMBER_PASSWORD,
    group: "综合",
  });
}

export function publicUser(user: TeamUser): PublicTeamUser {
  return toPublicUser(user);
}
