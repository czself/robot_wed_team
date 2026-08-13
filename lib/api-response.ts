import "server-only";

import { NextResponse } from "next/server";
import { isKvConfigurationError } from "@/lib/kv";

export function apiServerError(
  error: unknown,
  label: string,
  fallback = "服务器暂时不可用，请稍后再试"
): NextResponse {
  console.error(`${label}:`, error);
  if (isKvConfigurationError(error)) {
    return NextResponse.json(
      { ok: false, error: "数据服务尚未配置，请联系管理员" },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: false, error: fallback }, { status: 500 });
}
