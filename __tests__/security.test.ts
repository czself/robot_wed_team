import { describe, expect, it } from "vitest";
import {
  MIN_PASSWORD_LENGTH,
  safeInternalPath,
  validatePassword,
} from "@/lib/security";

describe("password policy", () => {
  it("accepts a password with the required length, letters, and numbers", () => {
    expect(validatePassword("robot2026yz")).toBeNull();
  });

  it("rejects weak or oversized passwords", () => {
    expect(validatePassword("a1".padEnd(MIN_PASSWORD_LENGTH - 1, "a"))).toMatch(
      /长度/
    );
    expect(validatePassword("abcdefghijk")).toMatch(/字母和数字/);
    expect(validatePassword("1234567890")).toMatch(/字母和数字/);
    expect(validatePassword(`a1${"x".repeat(71)}`)).toMatch(/长度/);
  });
});

describe("safeInternalPath", () => {
  it("keeps an internal path with its query and fragment", () => {
    expect(safeInternalPath("/portal/docs?level=入门#start")).toBe(
      "/portal/docs?level=%E5%85%A5%E9%97%A8#start"
    );
  });

  it.each([
    "https://evil.example/steal",
    "//evil.example/steal",
    "/\\\\evil.example/steal",
    "javascript:alert(1)",
    "portal",
    "",
  ])("rejects a non-local redirect target: %s", (value) => {
    expect(safeInternalPath(value, "/fallback")).toBe("/fallback");
  });
});
