import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    console.warn("current user lookup failed:", err);
    return NextResponse.json({ ok: true, data: null });
  }
}
