import { NextRequest, NextResponse } from "next/server";
import {
  validateEntry,
  createEntry,
  sendMailNotice,
  listEntries,
  deleteEntry,
} from "@/lib/recruit";
import { checkRateLimit } from "@/lib/rate-limit";
import { currentApiAdmin } from "@/lib/api-auth";
import { rejectCrossOriginMutation } from "@/lib/csrf";
import { apiServerError } from "@/lib/api-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
}

export async function GET() {
  try {
    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;

    const entries = await listEntries();
    entries.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ ok: true, data: entries });
  } catch (err) {
    return apiServerError(err, "recruit list failed");
  }
}

export async function POST(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const ip = clientIp(req);
    const rl = await checkRateLimit(`recruit:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "提交太频繁，请稍后再试" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = validateEntry(body);
    if (typeof result === "string") {
      return NextResponse.json({ ok: false, error: result }, { status: 400 });
    }

    const entry = await createEntry(result);
    await sendMailNotice(entry).catch((e) => {
      console.error("mail send failed:", e);
    });

    return NextResponse.json({ ok: true, data: { id: entry.id } });
  } catch (err) {
    return apiServerError(err, "recruit submit failed");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "缺少 id" },
        { status: 400 }
      );
    }

    const result = await deleteEntry(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return apiServerError(err, "recruit delete failed");
  }
}
