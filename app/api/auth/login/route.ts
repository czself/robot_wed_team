import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, ensureBootstrapAdmin, publicUser } from "@/lib/auth";
import { createSession, setSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = await checkRateLimit(`login:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "登录太频繁，请稍后再试" },
        { status: 429 }
      );
    }

    await ensureBootstrapAdmin();

    const body = await req.json().catch(() => null);
    const username =
      typeof body?.username === "string"
        ? body.username
        : typeof body?.email === "string"
          ? body.email
          : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "请输入学号和密码" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(username, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "账号或密码不正确" },
        { status: 401 }
      );
    }

    const token = await createSession(user.id);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, data: publicUser(user) });
  } catch (err) {
    console.error("login failed:", err);
    return NextResponse.json(
      { ok: false, error: "服务器暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}
