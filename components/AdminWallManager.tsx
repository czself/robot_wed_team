"use client";

import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
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
}: {
  initialMessages: WallMessageWithReplies[];
}) {
  const [messages, setMessages] = useState(flattenMessages(initialMessages));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deleteMessage = async (id: string) => {
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

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-2xl font-black text-white">留言管理</h2>
        <p className="mt-2 text-sm text-rm-gray">
          删除不合适的留言或回复。回复删除后不会影响主留言。
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
            className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1fr_150px_80px_80px]"
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
              </div>
              <p className="whitespace-pre-wrap break-words leading-7 text-rm-gray">
                {message.content}
              </p>
            </div>
            <div className="font-mono text-xs text-rm-gray">
              {formatTime(message.createdAt)}
            </div>
            <div className="font-mono text-sm text-rm-blue">{message.likes} 赞</div>
            <button
              type="button"
              onClick={() => void deleteMessage(message.id)}
              disabled={busyId === message.id}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:opacity-40"
            >
              {busyId === message.id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              删除
            </button>
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
