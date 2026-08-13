import { kv } from "@/lib/kv";

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const WINDOW_SECONDS = WINDOW_MS / 1000;
const MAX_REQUESTS = 10;

function checkMemoryRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

export async function checkRateLimit(key: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const kvKey = `rate:${key}`;
    const count = await kv.incr(kvKey);
    if (count === 1) {
      await kv.expire(kvKey, WINDOW_SECONDS);
    }

    return {
      allowed: count <= MAX_REQUESTS,
      remaining: Math.max(0, MAX_REQUESTS - count),
    };
  } catch (err) {
    console.warn("KV rate limit unavailable, using memory fallback:", err);
    return checkMemoryRateLimit(key);
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, WINDOW_MS).unref();
