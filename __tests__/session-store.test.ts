import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createSessionRecord,
  getSessionRecord,
  revokeUserSessions,
} from "@/lib/session-store";

describe("server-side sessions", () => {
  it("creates opaque tokens and revokes every session for an account", async () => {
    const userId = `test-${randomUUID()}`;
    const first = await createSessionRecord(userId);
    const second = await createSessionRecord(userId);

    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(second).not.toBe(first);
    expect((await getSessionRecord(first))?.userId).toBe(userId);
    expect((await getSessionRecord(second))?.userId).toBe(userId);

    await revokeUserSessions(userId);
    await expect(getSessionRecord(first)).resolves.toBeNull();
    await expect(getSessionRecord(second)).resolves.toBeNull();
  });
});
