import { NextRequest, NextResponse } from "next/server";
import {
  validateEntry,
  createEntry,
  sendMailNotice,
  listEntries,
} from "@/lib/recruit";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
}

function isAdmin(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_KEY;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return Boolean(adminKey && token === adminKey);
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json(
        { ok: false, error: "未授权" },
        { status: 401 }
      );
    }

    const entries = await listEntries();
    entries.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ ok: true, data: entries });
  } catch (err) {
    console.error("recruit list failed:", err);
    return NextResponse.json(
      { ok: false, error: "服务器暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
    console.error("recruit submit failed:", err);
    return NextResponse.json(
      { ok: false, error: "服务器暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}
