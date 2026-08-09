import { NextRequest, NextResponse } from "next/server";
import {
  listMessages,
  createMessage,
  likeMessage,
  deleteMessage,
  isValidParentId,
  type SortKey,
} from "@/lib/wall";

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
    const result = await listMessages({
      sort: sort === "new" ? "new" : "hot",
      offset: Number.isFinite(offset) ? offset : 0,
      limit: Number.isFinite(limit) ? limit : 10,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
      const voter = `${clientIp(req)}#${(
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
    const parentId =
      isValidParentId(body.parentId) ? body.parentId : null;

    const msg = await createMessage({ nickname, content, parentId });
    return NextResponse.json({ ok: true, data: msg });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const key = url.searchParams.get("key");

    const adminKey = process.env.ADMIN_KEY || "yz-control-admin-2026";
    if (key !== adminKey) {
      return NextResponse.json(
        { ok: false, error: "未授权" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "缺少 id" },
        { status: 400 }
      );
    }
    const result = await deleteMessage(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}