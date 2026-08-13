import { NextResponse } from "next/server";
import { getKvStatus } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  const kv = getKvStatus();
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_TO
  );
  const ok = kv.configured;

  return NextResponse.json(
    {
      ok,
      services: {
        kv,
        smtp: { configured: smtpConfigured },
      },
    },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
