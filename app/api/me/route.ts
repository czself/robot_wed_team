import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { apiServerError } from "@/lib/api-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    return apiServerError(err, "current user lookup failed");
  }
}
