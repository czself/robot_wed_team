import "server-only";

import { NextRequest, NextResponse } from "next/server";

function sameOrigin(value: string | null, allowedOrigins: Set<string>): boolean {
  if (!value) return true;
  try {
    return allowedOrigins.has(new URL(value).origin);
  } catch {
    return false;
  }
}

function requestOrigins(req: NextRequest): Set<string> {
  const origins = new Set([req.nextUrl.origin]);
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const host = forwardedHost || req.headers.get("host")?.trim();
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwardedProto || req.nextUrl.protocol.replace(":", "");

  if (host && (protocol === "http" || protocol === "https")) {
    try {
      origins.add(new URL(`${protocol}://${host}`).origin);
    } catch {}
  }

  return origins;
}

export function rejectCrossOriginMutation(req: NextRequest): NextResponse | null {
  const allowedOrigins = requestOrigins(req);
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const fetchSite = req.headers.get("sec-fetch-site");

  const invalidFetchSite =
    fetchSite !== null &&
    fetchSite !== "same-origin" &&
    fetchSite !== "same-site" &&
    fetchSite !== "none";
  const missingSource = !origin && !referer;

  if (
    invalidFetchSite ||
    missingSource ||
    !sameOrigin(origin, allowedOrigins) ||
    !sameOrigin(referer, allowedOrigins)
  ) {
    return NextResponse.json(
      { ok: false, error: "请求来源无效" },
      { status: 403 }
    );
  }

  return null;
}
