"use client";

import { useState } from "react";
import { Check, RefreshCw, Trash2 } from "lucide-react";
import type { WallMessageWithReplies } from "@/lib/wall";

function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

function flattenMessages(messages: WallMessageWithReplies[]) {
  return messages.flatMap((message) => [
    { ...message, depth: 0 },
    ...(message.replies || []).map((reply) => ({ ...reply, depth: 1 })),
  ]);
}

export default function AdminWallManager({
  initialMessages,
  canDelete = true,
}: {
  initialMessages: WallMessageWithReplies[];
  canDelete?: boolean;
}) {
  const [messages, setMessages] = useState(flattenMessages(initialMessages));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deleteMessage = async (id: string) => {
    if (!canDelete) return;
    if (busyId) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/wall?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "删除失败");
      setMessages((prev) => prev.filter((message) => message.id !== id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const approveMessage = async (id: string) => {
    if (!canDelete || busyId) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/wall", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "审核失败");
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, status: "approved" } : message
        )
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-2xl font-black text-white">留言管理</h2>
        <p className="mt-2 text-sm text-rm-gray">
          队员可查看已显示的留言，管理员可审核待显示内容并删除不合适的留言。
        </p>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 py-2 text-sm text-rm-red">
          {error}
        </div>
      )}

      <div className="divide-y divide-white/5">
        {messages.map((message) => (
          <article
            key={message.id}
            className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1fr_150px_80px_170px]"
          >
            <div className={message.depth ? "border-l border-white/10 pl-4" : ""}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-bold text-white">{message.nickname}</span>
                {message.depth ? (
                  <span className="rounded-full border border-rm-blue/30 bg-rm-blue/10 px-2 py-0.5 text-[10px] font-bold text-rm-blue">
                    回复
                  </span>
                ) : (
                  <span className="rounded-full border border-rm-red/30 bg-rm-red/10 px-2 py-0.5 text-[10px] font-bold text-rm-red">
                    主留言
                  </span>
                )}
                {(message.status ?? "approved") === "pending" ? (
                  <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                    待审核
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    已显示
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap break-words leading-7 text-rm-gray">
                {message.content}
              </p>
            </div>
            <div className="font-mono text-xs text-rm-gray">
              {formatTime(message.createdAt)}
            </div>
            <div className="font-mono text-sm text-rm-blue">{message.likes} 赞</div>
            {canDelete ? (
              <div className="flex gap-2">
                {(message.status ?? "approved") === "pending" && (
                  <button
                    type="button"
                    onClick={() => void approveMessage(message.id)}
                    disabled={busyId === message.id}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-400/15 disabled:opacity-40"
                  >
                    {busyId === message.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    通过
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void deleteMessage(message.id)}
                  disabled={busyId === message.id}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:opacity-40"
                >
                  {busyId === message.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  删除
                </button>
              </div>
            ) : (
              <div className="inline-flex h-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-rm-gray">
                只读
              </div>
            )}
          </article>
        ))}

        {!messages.length && (
          <div className="px-5 py-16 text-center text-sm text-rm-gray">
            暂无留言
          </div>
        )}
      </div>
    </section>
  );
}
