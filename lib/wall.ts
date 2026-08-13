import { kv } from "@/lib/kv";

export interface WallMessage {
  id: string;
  nickname: string;
  content: string;
  createdAt: number;
  likes: number;
  parentId: string | null;
  status?: "pending" | "approved";
}

export interface WallMessageWithReplies extends WallMessage {
  replies?: WallMessageWithReplies[];
  liked?: boolean;
}

const MSG_KEY = "wall:messages";
const META_PREFIX = "wall:msg:";
const LIKES_PREFIX = "wall:likes:";

function genId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function sanitize(s: string, max = 200): string {
  return s.trim().slice(0, max);
}

function sanitizeNick(s: string): string {
  const v = s.trim().slice(0, 24);
  return v || "匿名访客";
}

export type SortKey = "hot" | "new";

export async function listMessages(opts?: {
  sort?: SortKey;
  offset?: number;
  limit?: number;
  includePending?: boolean;
}): Promise<{
  data: WallMessageWithReplies[];
  total: number;
}> {
  const sort = opts?.sort ?? "hot";
  const offset = Math.max(0, opts?.offset ?? 0);
  const limit = Math.min(50, Math.max(1, opts?.limit ?? 10));

  const ids = await kv.lrange(MSG_KEY, 0, -1);
  if (!ids.length) return { data: [], total: 0 };

  const metas = await kv.mget(...ids.map((id) => `${META_PREFIX}${id}`));
  const messages: WallMessage[] = [];
  for (const meta of metas) {
    if (meta && typeof meta === "object") {
      messages.push(meta as WallMessage);
    }
  }

  const visibleMessages = opts?.includePending
    ? messages
    : messages.filter((m) => (m.status ?? "approved") === "approved");

  const byId = new Map<string, WallMessageWithReplies>(
    visibleMessages.map((m) => [
      m.id,
      { ...m, replies: [] as WallMessageWithReplies[] },
    ])
  );

  const roots: WallMessageWithReplies[] = [];
  for (const m of byId.values()) {
    if (m.parentId && byId.has(m.parentId)) {
      byId.get(m.parentId)!.replies!.push(m);
    } else {
      roots.push(m);
    }
  }

  if (sort === "hot") {
    roots.sort(
      (a, b) => b.likes - a.likes || b.createdAt - a.createdAt
    );
  } else {
    roots.sort((a, b) => b.createdAt - a.createdAt);
  }
  for (const r of roots) {
    r.replies?.sort((a, b) => a.createdAt - b.createdAt);
  }

  const total = roots.length;
  const page = roots.slice(offset, offset + limit);
  return { data: page, total };
}

export async function createMessage(input: {
  nickname: string;
  content: string;
  parentId?: string | null;
}): Promise<WallMessage> {
  const msg: WallMessage = {
    id: genId(),
    nickname: sanitizeNick(input.nickname),
    content: sanitize(input.content),
    createdAt: Date.now(),
    likes: 0,
    parentId: input.parentId || null,
    status: "pending",
  };
  await kv.lpush(MSG_KEY, msg.id);
  await kv.set(`${META_PREFIX}${msg.id}`, msg);
  return msg;
}

export async function approveMessage(id: string): Promise<WallMessage> {
  const metaKey = `${META_PREFIX}${id}`;
  const raw = (await kv.get(metaKey)) as WallMessage | null;
  if (!raw) throw new Error("留言不存在");

  const next: WallMessage = { ...raw, status: "approved" };
  await kv.set(metaKey, next);
  return next;
}

export async function likeMessage(
  id: string,
  voterKey: string
): Promise<{ liked: boolean; likes: number }> {
  const metaKey = `${META_PREFIX}${id}`;
  const raw = (await kv.get(metaKey)) as WallMessage | null;
  if (!raw) throw new Error("留言不存在");

  const setKey = `${LIKES_PREFIX}${id}`;
  const added = await kv.sadd(setKey, voterKey);

  let likes = raw.likes;
  if (added) {
    likes = await kv.scard(setKey);
    await kv.set(metaKey, { ...raw, likes });
  }
  return { liked: added === 1, likes };
}

export function isValidParentId(s: unknown): s is string {
  return typeof s === "string" && /^[a-z0-9]{8,24}$/i.test(s);
}

export async function deleteMessage(id: string): Promise<{ deleted: boolean }> {
  const metaKey = `${META_PREFIX}${id}`;
  const raw = await kv.get(metaKey);
  if (!raw) return { deleted: false };

  const ids = await kv.lrange(MSG_KEY, 0, -1);
  const metas = ids.length
    ? ((await kv.mget(...ids.map((msgId) => `${META_PREFIX}${msgId}`))) as Array<WallMessage | null>)
    : [];
  const childIds = metas
    .filter((message): message is WallMessage => Boolean(message))
    .filter((message) => message.parentId === id)
    .map((message) => message.id);
  const idsToDelete = [id, ...childIds];

  await Promise.all(
    idsToDelete.flatMap((msgId) => [
      kv.del(`${META_PREFIX}${msgId}`),
      kv.del(`${LIKES_PREFIX}${msgId}`),
      kv.lrem(MSG_KEY, 0, msgId),
    ])
  );

  return { deleted: true };
}
