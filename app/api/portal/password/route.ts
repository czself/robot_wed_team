import { NextRequest, NextResponse } from "next/server";
import { changeOwnPassword } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/csrf";
import { currentApiUser } from "@/lib/api-auth";
import { clearSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const auth = await currentApiUser();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    const currentPassword =
      typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const nextPassword =
      typeof body?.nextPassword === "string" ? body.nextPassword : "";

    if (!currentPassword || !nextPassword) {
      return NextResponse.json(
        { ok: false, error: "请输入当前密码和新密码" },
        { status: 400 }
      );
    }

    await changeOwnPassword({
      userId: auth.user.id,
      currentPassword,
      nextPassword,
    });
    await clearSessionCookie();

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "修改失败";
    const status = ["账号不存在", "新密码长度应为 6-72 位", "新密码不能与当前密码相同", "当前密码不正确"].includes(message)
      ? 400
      : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
