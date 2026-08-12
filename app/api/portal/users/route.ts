import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  validateUserInput,
  validateUserUpdateInput,
} from "@/lib/auth";
import { currentApiAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    return NextResponse.json({ ok: true, data: await listUsers() });
  } catch (err) {
    console.error("user list failed:", err);
    return NextResponse.json(
      { ok: false, error: "服务器暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    const body = await req.json().catch(() => null);
    const result = validateUserInput(body);
    if (typeof result === "string") {
      return NextResponse.json({ ok: false, error: result }, { status: 400 });
    }

    const createdUser = await createUser(result);
    return NextResponse.json({ ok: true, data: createdUser });
  } catch (err) {
    const message = err instanceof Error ? err.message : "创建失败";
    const status = message === "账号已存在" ? 409 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    const body = await req.json().catch(() => null);
    const result = validateUserUpdateInput(body);
    if (typeof result === "string") {
      return NextResponse.json({ ok: false, error: result }, { status: 400 });
    }

    const updatedUser = await updateUser(result, auth.user.id);
    return NextResponse.json({ ok: true, data: updatedUser });
  } catch (err) {
    const message = err instanceof Error ? err.message : "更新失败";
    const status = ["账号不存在", "不能禁用当前登录账号", "不能取消当前登录账号的管理员权限"].includes(message)
      ? 400
      : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) {
      return NextResponse.json({ ok: false, error: "缺少账号 ID" }, { status: 400 });
    }

    const result = await deleteUser(id, auth.user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "删除失败";
    const status = ["缺少账号 ID", "不能删除当前登录账号"].includes(message)
      ? 400
      : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
