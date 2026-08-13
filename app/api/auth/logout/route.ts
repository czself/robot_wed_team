import { NextRequest, NextResponse } from "next/server";
import { rejectCrossOriginMutation } from "@/lib/csrf";
import { clearSessionCookie } from "@/lib/session";
import { apiServerError } from "@/lib/api-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiServerError(error, "logout failed");
  }
}
