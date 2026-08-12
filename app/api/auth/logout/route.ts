import { NextRequest, NextResponse } from "next/server";
import { rejectCrossOriginMutation } from "@/lib/csrf";
import { clearSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const csrf = rejectCrossOriginMutation(req);
  if (csrf) return csrf;

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
