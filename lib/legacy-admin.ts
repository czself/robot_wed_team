import "server-only";

import type { NextRequest } from "next/server";

export function isLegacyAdminRequest(req: NextRequest): boolean {
  if (process.env.ALLOW_LEGACY_ADMIN_KEY !== "true") return false;

  const adminKey = process.env.ADMIN_KEY;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return Boolean(adminKey && token === adminKey);
}
