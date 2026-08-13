import { NextRequest, NextResponse } from "next/server";
import {
  listMessages,
  createMessage,
  likeMessage,
  approveMessage,
  deleteMessage,
  isValidParentId,
  type SortKey,
} from "@/lib/wall";
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sort = (url.searchParams.get("sort") as SortKey) || "hot";
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const includePending = url.searchParams.get("includePending") === "1";
    if (includePending) {
      const auth = await currentApiAdmin();
      if (!auth.ok) return auth.response;
    }

    const result = await listMessages({
      sort: sort === "new" ? "new" : "hot",
      offset: Number.isFinite(offset) ? offset : 0,
      limit: Number.isFinite(limit) ? limit : 10,
      includePending,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return apiServerError(err, "wall list failed");
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
    const status = typeof body?.status === "string" ? body.status : "";
    if (!id || status !== "approved") {
      return NextResponse.json(
        { ok: false, error: "请求体无效" },
        { status: 400 }
      );
    }

    const message = await approveMessage(id);
    return NextResponse.json({ ok: true, data: message });
  } catch (err) {
    const message = err instanceof Error ? err.message : "审核失败";
    if (message === "留言不存在") {
      return NextResponse.json({ ok: false, error: message }, { status: 404 });
    }
    return apiServerError(err, "wall approve failed", "审核失败");
  }
}

export async function POST(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "请求体无效" },
        { status: 400 }
      );
    }

    const { action } = body;
    if (action === "like") {
      const { id } = body;
      if (typeof id !== "string" || !id) {
        return NextResponse.json(
          { ok: false, error: "缺少 id" },
          { status: 400 }
        );
      }
      const ip = clientIp(req);
      const rl = await checkRateLimit(`wall:like:${ip}`);
      if (!rl.allowed) {
        return NextResponse.json(
          { ok: false, error: "操作太频繁，请稍后再试" },
          { status: 429 }
        );
      }
      const voter = `${ip}#${(
        req.headers.get("user-agent") || ""
      ).slice(0, 32)}`;
      const res = await likeMessage(id, voter);
      return NextResponse.json({ ok: true, ...res });
    }

    const nickname = typeof body.nickname === "string" ? body.nickname : "";
    const content = typeof body.content === "string" ? body.content : "";
    if (!content.trim()) {
      return NextResponse.json(
        { ok: false, error: "内容不能为空" },
        { status: 400 }
      );
    }

    const ip = clientIp(req);
    const rl = await checkRateLimit(`wall:post:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "操作太频繁，请稍后再试" },
        { status: 429 }
      );
    }

    const parentId =
      isValidParentId(body.parentId) ? body.parentId : null;

    const msg = await createMessage({ nickname, content, parentId });
    return NextResponse.json({ ok: true, data: msg });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "留言不存在") {
      return NextResponse.json({ ok: false, error: message }, { status: 404 });
    }
    return apiServerError(err, "wall post failed");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const csrf = rejectCrossOriginMutation(req);
    if (csrf) return csrf;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const auth = await currentApiAdmin();
    if (!auth.ok) return auth.response;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "缺少 id" },
        { status: 400 }
      );
    }
    const result = await deleteMessage(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return apiServerError(err, "wall delete failed");
  }
}
