export const MIN_PASSWORD_LENGTH = 10;

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > 72) {
    return `密码长度应为 ${MIN_PASSWORD_LENGTH}-72 位`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "密码必须同时包含字母和数字";
  }
  return null;
}

export function safeInternalPath(
  value: string | null | undefined,
  fallback = "/portal"
): string {
  const candidate = value?.trim();
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return fallback;
  }

  try {
    const base = new URL("https://local.invalid");
    const parsed = new URL(candidate, base);
    if (parsed.origin !== base.origin) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
