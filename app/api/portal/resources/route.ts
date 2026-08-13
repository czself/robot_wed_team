import { NextRequest, NextResponse } from "next/server";
import {
  createResource,
  deleteResource,
  listResources,
  updateResource,
  validateResourceInput,
} from "@/lib/resources";
import { currentApiAdmin } from "@/lib/api-auth";
import { rejectCrossOriginMutation } from "@/lib/csrf";
import { apiServerError } from "@/lib/api-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    return NextResponse.json({ ok: true, data: await listResources() });
  } catch (err) {
    return apiServerError(err, "resource list failed");
  }
}

export async function POST(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    const body = await req.json().catch(() => null);
    const result = validateResourceInput(body);
    if (typeof result === "string") {
      return NextResponse.json({ ok: false, error: result }, { status: 400 });
    }

    const resource = await createResource(result);
    return NextResponse.json({ ok: true, data: resource });
  } catch (err) {
    return apiServerError(err, "resource create failed");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    const body = await req.json().catch(() => null);
    const id = typeof body?.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ ok: false, error: "缺少资料 ID" }, { status: 400 });
    }

    const result = validateResourceInput(body);
    if (typeof result === "string") {
      return NextResponse.json({ ok: false, error: result }, { status: 400 });
    }

    const resource = await updateResource(id, result);
    return NextResponse.json({ ok: true, data: resource });
  } catch (err) {
    const message = err instanceof Error ? err.message : "更新失败";
    if (["默认资料不能编辑", "资料不存在"].includes(message)) {
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
    return apiServerError(err, "resource update failed", "更新失败");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) {
      return NextResponse.json({ ok: false, error: "缺少资料 ID" }, { status: 400 });
    }

    const result = await deleteResource(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "删除失败";
    if (message === "默认资料不能删除") {
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
    return apiServerError(err, "resource delete failed", "删除失败");
  }
}
