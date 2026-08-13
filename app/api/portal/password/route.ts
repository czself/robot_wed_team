import { NextRequest, NextResponse } from "next/server";
import { changeOwnPassword } from "@/lib/auth";
import { rejectCrossOriginMutation } from "@/lib/csrf";
import { currentApiUser } from "@/lib/api-auth";
import { clearSessionCookie } from "@/lib/session";
import { apiServerError } from "@/lib/api-response";

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
    const isInputError =
      message.startsWith("密码长度应为 ") ||
      [
        "账号不存在",
        "密码必须同时包含字母和数字",
        "新密码不能与当前密码相同",
        "当前密码不正确",
      ].includes(message);
    if (isInputError) {
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
    return apiServerError(err, "password change failed", "修改失败");
  }
}
