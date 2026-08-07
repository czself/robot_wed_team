import { kv } from "@vercel/kv";

export interface WallMessage {
  id: string;
  nickname: string;
  content: string;
  createdAt: number;
  likes: number;
  parentId: string | null;
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

export async function listMessages(): Promise<WallMessageWithReplies[]> {
  const ids = await kv.lrange(MSG_KEY, 0, -1);
  if (!ids.length) return [];

  const metas = await kv.mget(...ids.map((id) => `${META_PREFIX}${id}`));
  const messages: WallMessage[] = [];
  for (const meta of metas) {
    if (meta && typeof meta === "object") {
      messages.push(meta as WallMessage);
    }
  }

  const byId = new Map<string, WallMessageWithReplies>(
    messages.map((m) => [
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

  const sortFn = (a: WallMessageWithReplies, b: WallMessageWithReplies) =>
    b.likes - a.likes || b.createdAt - a.createdAt;
  roots.sort(sortFn);
  for (const r of roots) {
    r.replies?.sort((a, b) => a.createdAt - b.createdAt);
  }
  return roots;
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
  };
  await kv.lpush(MSG_KEY, msg.id);
  await kv.set(`${META_PREFIX}${msg.id}`, msg);
  return msg;
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
