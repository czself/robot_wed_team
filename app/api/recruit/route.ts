import { NextRequest, NextResponse } from "next/server";
import { validateEntry, createEntry, sendMailNotice } from "@/lib/recruit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
