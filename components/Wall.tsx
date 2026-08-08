"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WallMessageWithReplies, SortKey } from "@/lib/wall";

const PAGE_SIZE = 10;

const COLORS = [
  "from-rm-red to-rm-blue",
  "from-rm-blue to-rm-red",
  "from-rm-red to-pink-500",
  "from-cyan-500 to-rm-blue",
];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s} 秒前`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} 个月前`;
  return `${Math.floor(mo / 12)} 年前`;
}

function Avatar({ name, seed }: { name: string; seed: string }) {
  const first = name.slice(0, 1).toUpperCase();
  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorFor(
        seed
      )} flex items-center justify-center font-black text-white shrink-0 shadow-lg`}
    >
      {first}
    </div>
  );
}

interface MessageCardProps {
  msg: WallMessageWithReplies;
  onLike: (id: string) => void;
  onReply: (parentId: string, nickname: string) => void;
  likedIds: Set<string>;
}

function MessageCard({
  msg,
  onLike,
  onReply,
  likedIds,
}: MessageCardProps) {
  const liked = likedIds.has(msg.id);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/15 transition-colors group"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rm-red/40 to-rm-blue/40 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <Avatar name={msg.nickname} seed={msg.id} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-white text-sm truncate">
                {msg.nickname}
              </span>
              <span className="text-[10px] text-rm-gray font-mono">
                {timeAgo(msg.createdAt)}
              </span>
            </div>
            <p className="text-rm-gray leading-relaxed break-words text-[15px] whitespace-pre-wrap">
              {msg.content}
            </p>

            <div className="flex items-center gap-1 mt-3">
              <button
                onClick={() => onLike(msg.id)}
                aria-label={liked ? "取消点赞" : "点赞"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  liked
                    ? "bg-rm-red/20 text-rm-red border border-rm-red/40"
                    : "bg-white/5 text-rm-gray hover:bg-rm-red/10 hover:text-rm-red border border-white/5"
                }`}
              >
                <motion.span
                  key={liked ? "on" : "off"}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  {liked ? "❤" : "♡"}
                </motion.span>
                <span className="tabular-nums">{msg.likes}</span>
              </button>
              <button
                onClick={() => onReply(msg.id, msg.nickname)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-rm-gray hover:bg-rm-blue/10 hover:text-rm-blue border border-white/5 transition-all"
              >
                回复
              </button>
            </div>

            <AnimatePresence>
              {msg.replies && msg.replies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 pl-1 border-l border-white/5"
                >
                  {msg.replies.map((r) => {
                    const rliked = likedIds.has(r.id);
                    return (
                      <div key={r.id} className="flex gap-2.5 pl-3">
                        <Avatar name={r.nickname} seed={r.id} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-white text-xs truncate">
                              {r.nickname}
                            </span>
                            <span className="text-[10px] text-rm-gray font-mono">
                              {timeAgo(r.createdAt)}
                            </span>
                          </div>
                          <p className="text-rm-gray text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {r.content}
                          </p>
                          <button
                            onClick={() => onLike(r.id)}
                            className={`flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                              rliked
                                ? "bg-rm-red/20 text-rm-red border border-rm-red/40"
                                : "bg-white/5 text-rm-gray hover:bg-rm-red/10 hover:text-rm-red border border-white/5"
                            }`}
                          >
                            <motion.span
                              key={rliked ? "on" : "off"}
                              initial={{ scale: 0.6 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 20,
                              }}
                            >
                              {rliked ? "❤" : "♡"}
                            </motion.span>
                            <span className="tabular-nums">{r.likes}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Wall() {
  const [messages, setMessages] = useState<WallMessageWithReplies[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("hot");
  const [page, setPage] = useState(0);

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<{
    parentId: string;
    nickname: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const offset = page * PAGE_SIZE;
    const url = `/api/wall?sort=${sort}&offset=${offset}&limit=${PAGE_SIZE}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "加载失败");
      setMessages(json.data || []);
      setTotal(json.total || 0);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [sort, page]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wall:liked") || "[]");
      if (Array.isArray(saved)) setLikedIds(new Set(saved));
    } catch {}
    refresh();
  }, [refresh]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const changeSort = (s: SortKey) => {
    setSort(s);
    setPage(0);
  };

  const goToPage = (p: number) => {
    setPage(Math.max(0, Math.min(p, totalPages - 1)));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLike = async (id: string) => {
    const wasLiked = likedIds.has(id);
    const next = new Set(likedIds);
    if (wasLiked) next.delete(id);
    else next.add(id);
    setLikedIds(next);
    try {
      localStorage.setItem("wall:liked", JSON.stringify([...next]));
    } catch {}

    setMessages((prev) => {
      const map = (m: WallMessageWithReplies): WallMessageWithReplies => {
        if (m.id === id)
          return {
            ...m,
            likes: Math.max(0, m.likes + (wasLiked ? -1 : 1)),
          };
        if (m.replies) {
          return {
            ...m,
            replies: m.replies.map((r) =>
              r.id === id
                ? {
                    ...r,
                    likes: Math.max(0, r.likes + (wasLiked ? -1 : 1)),
                  }
                : r
            ),
          };
        }
        return m;
      };
      return prev.map(map);
    });

    try {
      await fetch("/api/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", id }),
      });
    } catch {}
  };

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          content,
          parentId: replyTo?.parentId || null,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "发送失败");
      setContent("");
      setReplyTo(null);
      setPage(0);
      setSort("new");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const sorted = messages;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 md:p-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rm-red/10 blur-3xl opacity-60" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-rm-blue/10 blur-3xl opacity-60" />

          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="昵称（可选）"
            maxLength={24}
            className="w-full mb-3 px-4 py-2.5 rounded-lg bg-rm-dark/60 border border-white/10 focus:border-rm-red/50 focus:ring-1 focus:ring-rm-red/30 outline-none transition-all text-sm placeholder:text-rm-gray/60"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              replyTo
                ? `回复 @${replyTo.nickname}...`
                : "留下你想对 YZ Control 说的..."
            }
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-rm-dark/60 border border-white/10 focus:border-rm-blue/50 focus:ring-1 focus:ring-rm-blue/30 outline-none transition-all text-sm placeholder:text-rm-gray/60 resize-none"
          />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-[11px] text-rm-gray/60 font-mono">
              {replyTo ? (
                <>
                  <span className="text-rm-blue">
                    ↳ 回复 @{replyTo.nickname}
                  </span>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-rm-gray hover:text-white"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span>{content.length}/200</span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              className="px-5 py-2 bg-gradient-to-r from-rm-red to-rm-blue text-white text-sm font-bold rounded-lg transition-all hover:shadow-[0_0_24px_rgba(217,4,41,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "发送中..." : "发送 →"}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between mb-4 px-1 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeSort("hot")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              sort === "hot"
                ? "bg-rm-red text-white border border-rm-red/40 shadow-[0_0_12px_rgba(217,4,41,0.3)]"
                : "bg-white/5 text-rm-gray hover:text-white border border-white/5"
            }`}
          >
            🔥 热门
          </button>
          <button
            onClick={() => changeSort("new")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              sort === "new"
                ? "bg-rm-blue text-white border border-rm-blue/40 shadow-[0_0_12px_rgba(0,200,255,0.3)]"
                : "bg-white/5 text-rm-gray hover:text-white border border-white/5"
            }`}
          >
            🕒 最新
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-rm-gray/60 font-mono">
          <span>
            {total > 0 ? `${total} 条留言` : "BE THE FIRST"}
          </span>
          <button
            onClick={refresh}
            className="hover:text-rm-blue transition-colors flex items-center gap-1"
          >
            刷新 ↻
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-rm-gray text-sm">
          加载中...
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-rm-red text-sm mb-2">{error}</p>
          <button
            onClick={refresh}
            className="text-rm-blue hover:underline text-sm"
          >
            重试
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">💬</p>
          <p className="text-rm-gray text-sm">
            还没有留言，来当第一个留下印记的人吧
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sorted.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                onLike={handleLike}
                onReply={(parentId, nick) =>
                  setReplyTo({ parentId, nickname: nick })
                }
                likedIds={likedIds}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && !loading && !error && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:text-rm-red transition-colors"
            aria-label="上一页"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-mono transition-all ${
                page === p
                  ? "bg-gradient-to-br from-rm-red to-rm-blue text-white shadow-lg"
                  : "glass text-rm-gray hover:text-white"
              }`}
            >
              {p + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:text-rm-blue transition-colors"
            aria-label="下一页"
          >
            ›
          </button>
        </div>
      )}

      <div className="mt-10 text-center text-[10px] tracking-[0.3em] text-rm-gray/30 font-mono uppercase">
        <span className="w-8 h-px inline-block bg-rm-red/30 align-middle mr-2" />
        END OF WALL
        <span className="w-8 h-px inline-block bg-rm-blue/30 align-middle ml-2" />
      </div>
    </div>
  );
}
