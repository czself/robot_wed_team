import { kv as vercelKv } from "@vercel/kv";

export type KvMode = "remote" | "memory" | "unconfigured";

interface KvSetOptions {
  ex?: number;
  nx?: boolean;
}

export interface KvClient {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: KvSetOptions): Promise<"OK" | null>;
  del(...keys: string[]): Promise<number>;
  mget<T = unknown>(...keys: string[]): Promise<Array<T | null>>;
  lrange<T = string>(key: string, start: number, stop: number): Promise<T[]>;
  lpush<T>(key: string, ...values: T[]): Promise<number>;
  lrem<T>(key: string, count: number, value: T): Promise<number>;
  sadd<T>(key: string, ...members: T[]): Promise<number>;
  srem<T>(key: string, ...members: T[]): Promise<number>;
  smembers<T = string>(key: string): Promise<T[]>;
  scard(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}

interface MemoryEntry {
  value: unknown;
  expiresAt?: number;
}

type KvGlobals = typeof globalThis & {
  __yzKvMemory?: Map<string, MemoryEntry>;
  __yzKvMemoryWarningShown?: boolean;
};

const globals = globalThis as KvGlobals;
const memory = globals.__yzKvMemory ?? new Map<string, MemoryEntry>();
globals.__yzKvMemory = memory;

function clone<T>(value: T): T {
  if (value instanceof Set) return new Set(value) as T;
  return structuredClone(value);
}

function readEntry(key: string): MemoryEntry | undefined {
  const entry = memory.get(key);
  if (entry?.expiresAt && entry.expiresAt <= Date.now()) {
    memory.delete(key);
    return undefined;
  }
  return entry;
}

function readList<T>(key: string): T[] {
  const value = readEntry(key)?.value;
  return Array.isArray(value) ? (clone(value) as T[]) : [];
}

function readSet<T>(key: string): Set<T> {
  const value = readEntry(key)?.value;
  return value instanceof Set ? (clone(value) as Set<T>) : new Set<T>();
}

const memoryKv: KvClient = {
  async get<T>(key: string) {
    const entry = readEntry(key);
    return entry ? clone(entry.value as T) : null;
  },
  async set<T>(key: string, value: T, options?: KvSetOptions) {
    if (options?.nx && readEntry(key)) return null;
    memory.set(key, {
      value: clone(value),
      expiresAt: options?.ex ? Date.now() + options.ex * 1000 : undefined,
    });
    return "OK";
  },
  async del(...keys: string[]) {
    let deleted = 0;
    for (const key of keys) {
      readEntry(key);
      if (memory.delete(key)) deleted++;
    }
    return deleted;
  },
  async mget<T>(...keys: string[]) {
    return Promise.all(keys.map((key) => memoryKv.get<T>(key)));
  },
  async lrange<T>(key: string, start: number, stop: number) {
    const list = readList<T>(key);
    const from = start < 0 ? Math.max(0, list.length + start) : start;
    const through = stop < 0 ? list.length + stop : stop;
    if (from >= list.length || through < from) return [];
    return list.slice(from, through + 1);
  },
  async lpush<T>(key: string, ...values: T[]) {
    const list = readList<T>(key);
    for (const value of values) list.unshift(clone(value));
    memory.set(key, { value: list });
    return list.length;
  },
  async lrem<T>(key: string, count: number, value: T) {
    const list = readList<T>(key);
    let removed = 0;
    const matches = (item: T) => Object.is(item, value);

    if (count >= 0) {
      const limit = count === 0 ? Number.POSITIVE_INFINITY : count;
      const next = list.filter((item) => {
        if (removed < limit && matches(item)) {
          removed++;
          return false;
        }
        return true;
      });
      memory.set(key, { value: next });
    } else {
      const reversed = [...list].reverse();
      const limit = Math.abs(count);
      const next = reversed
        .filter((item) => {
          if (removed < limit && matches(item)) {
            removed++;
            return false;
          }
          return true;
        })
        .reverse();
      memory.set(key, { value: next });
    }
    return removed;
  },
  async sadd<T>(key: string, ...members: T[]) {
    const set = readSet<T>(key);
    let added = 0;
    for (const member of members) {
      if (!set.has(member)) {
        set.add(clone(member));
        added++;
      }
    }
    memory.set(key, { value: set });
    return added;
  },
  async srem<T>(key: string, ...members: T[]) {
    const set = readSet<T>(key);
    let removed = 0;
    for (const member of members) {
      if (set.delete(member)) removed++;
    }
    memory.set(key, { value: set });
    return removed;
  },
  async smembers<T>(key: string) {
    return [...readSet<T>(key)].map(clone);
  },
  async scard(key: string) {
    return readSet(key).size;
  },
  async incr(key: string) {
    const entry = readEntry(key);
    const current = Number(entry?.value ?? 0);
    if (!Number.isFinite(current)) throw new Error("KV value is not a number");
    const next = current + 1;
    memory.set(key, { value: next, expiresAt: entry?.expiresAt });
    return next;
  },
  async expire(key: string, seconds: number) {
    const entry = readEntry(key);
    if (!entry) return 0;
    memory.set(key, { ...entry, expiresAt: Date.now() + seconds * 1000 });
    return 1;
  },
};

export class KvConfigurationError extends Error {
  constructor() {
    super("KV data service is not configured");
    this.name = "KvConfigurationError";
  }
}

function unavailable(): never {
  throw new KvConfigurationError();
}

const unavailableKv: KvClient = {
  get: async () => unavailable(),
  set: async () => unavailable(),
  del: async () => unavailable(),
  mget: async () => unavailable(),
  lrange: async () => unavailable(),
  lpush: async () => unavailable(),
  lrem: async () => unavailable(),
  sadd: async () => unavailable(),
  srem: async () => unavailable(),
  smembers: async () => unavailable(),
  scard: async () => unavailable(),
  incr: async () => unavailable(),
  expire: async () => unavailable(),
};

const remoteConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);
const memoryAllowed =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test" ||
  process.env.ALLOW_IN_MEMORY_KV === "true";

export const kvMode: KvMode = remoteConfigured
  ? "remote"
  : memoryAllowed
    ? "memory"
    : "unconfigured";

if (
  kvMode === "memory" &&
  process.env.NODE_ENV !== "test" &&
  !globals.__yzKvMemoryWarningShown
) {
  console.warn("KV remote configuration missing; using development memory storage");
  globals.__yzKvMemoryWarningShown = true;
}

export const kv: KvClient =
  kvMode === "remote"
    ? (vercelKv as unknown as KvClient)
    : kvMode === "memory"
      ? memoryKv
      : unavailableKv;

export function isKvConfigurationError(error: unknown): boolean {
  return error instanceof KvConfigurationError;
}

export function getKvStatus(): { mode: KvMode; configured: boolean } {
  return { mode: kvMode, configured: kvMode !== "unconfigured" };
}
