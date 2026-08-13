import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  hashPassword,
  validateUserInput,
  validateUserUpdateInput,
  verifyPassword,
} from "@/lib/auth";

describe("account input validation", () => {
  it("normalizes a valid account and role", () => {
    expect(
      validateUserInput({
        username: " 20260001 ",
        name: " 新队员 ",
        password: "control2026",
        group: "嵌入式组",
        role: "admin",
      })
    ).toEqual({
      username: "20260001",
      name: "新队员",
      password: "control2026",
      group: "嵌入式组",
      role: "admin",
    });
  });

  it("rejects invalid identifiers, roles, groups, and weak passwords", () => {
    expect(
      validateUserInput({ username: "name", name: "队员", password: "control2026" })
    ).toMatch(/用户名/);
    expect(
      validateUserInput({
        username: "20260001",
        name: "队员",
        password: "control2026",
        role: "owner",
      })
    ).toMatch(/权限/);
    expect(
      validateUserInput({
        username: "20260001",
        name: "队员",
        password: "control2026",
        group: "不存在的组",
      })
    ).toMatch(/组别/);
    expect(
      validateUserInput({ username: "20260001", name: "队员", password: "1234567890" })
    ).toMatch(/字母和数字/);
  });

  it("rejects malformed or empty account updates", () => {
    expect(validateUserUpdateInput({ id: "invalid", name: "队员" })).toMatch(/ID/);
    expect(validateUserUpdateInput({ id: "20260001", role: "owner" })).toMatch(/权限/);
    expect(validateUserUpdateInput({ id: "20260001" })).toMatch(/没有可更新内容/);
  });
});

describe("password hashing", () => {
  it("verifies the right password without storing it directly", async () => {
    const password = "control2026";
    const hash = await hashPassword(password);

    expect(hash).toMatch(/^scrypt:[a-f0-9]+:[a-f0-9]+$/);
    expect(hash).not.toContain(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong2026", hash)).resolves.toBe(false);
  });
});
