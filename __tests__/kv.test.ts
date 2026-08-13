import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getKvStatus, kv } from "@/lib/kv";

const keys: string[] = [];

function testKey(suffix: string): string {
  const key = `test:${randomUUID()}:${suffix}`;
  keys.push(key);
  return key;
}

afterEach(async () => {
  vi.useRealTimers();
  if (keys.length) await kv.del(...keys.splice(0));
});

describe("development KV fallback", () => {
  it("uses isolated memory storage in tests", () => {
    expect(getKvStatus()).toEqual({ mode: "memory", configured: true });
  });

  it("supports atomic create semantics and cloned values", async () => {
    const key = testKey("value");
    const source = { nested: { count: 1 } };

    expect(await kv.set(key, source, { nx: true })).toBe("OK");
    expect(await kv.set(key, { nested: { count: 2 } }, { nx: true })).toBeNull();
    source.nested.count = 99;
    expect(await kv.get(key)).toEqual({ nested: { count: 1 } });
  });

  it("supports the list, set, and counter operations used by the app", async () => {
    const listKey = testKey("list");
    const setKey = testKey("set");
    const counterKey = testKey("counter");

    expect(await kv.lpush(listKey, "a", "b", "a")).toBe(3);
    expect(await kv.lrange(listKey, 0, -1)).toEqual(["a", "b", "a"]);
    expect(await kv.lrem(listKey, 1, "a")).toBe(1);
    expect(await kv.lrange(listKey, 0, -1)).toEqual(["b", "a"]);

    expect(await kv.sadd(setKey, "one", "two", "one")).toBe(2);
    expect(new Set(await kv.smembers(setKey))).toEqual(new Set(["one", "two"]));
    expect(await kv.srem(setKey, "one")).toBe(1);
    expect(await kv.scard(setKey)).toBe(1);

    expect(await kv.incr(counterKey)).toBe(1);
    expect(await kv.incr(counterKey)).toBe(2);
  });

  it("expires values", async () => {
    vi.useFakeTimers();
    const key = testKey("expiring");
    await kv.set(key, "value", { ex: 1 });

    expect(await kv.get(key)).toBe("value");
    await vi.advanceTimersByTimeAsync(1_001);
    expect(await kv.get(key)).toBeNull();
  });
});
