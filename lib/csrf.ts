import "server-only";

import { NextRequest, NextResponse } from "next/server";

function sameOrigin(value: string | null, requestOrigin: string): boolean {
  if (!value) return true;
  try {
    return new URL(value).origin === requestOrigin;
  } catch {
    return false;
  }
}

export function rejectCrossOriginMutation(req: NextRequest): NextResponse | null {
  const requestOrigin = req.nextUrl.origin;
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (!sameOrigin(origin, requestOrigin) || !sameOrigin(referer, requestOrigin)) {
    return NextResponse.json(
      { ok: false, error: "请求来源无效" },
      { status: 403 }
    );
  }

  return null;
}
