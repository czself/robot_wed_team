"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Lock, RefreshCw, Search, Trash2 } from "lucide-react";

interface RecruitEntry {
  id: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  group: string;
  note?: string;
  createdAt: number;
}

const GROUP_LABELS: Record<string, string> = {
  mechanical: "机械组",
  embedded: "嵌入式组",
  vision: "视觉组",
  algorithm: "算法组",
  operations: "运营组",
};

function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

function csvCell(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function RecruitAdmin({
  requireManualKey = true,
}: {
  requireManualKey?: boolean;
}) {
  const [adminKey, setAdminKey] = useState("");
  const [entries, setEntries] = useState<RecruitEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const group = GROUP_LABELS[entry.group] || entry.group;
      return [entry.name, entry.gender, entry.phone, entry.email, group, entry.note || ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [entries, query]);

  const groupStats = useMemo(() => {
    const stats = new Map<string, number>();
    for (const entry of entries) {
      const label = GROUP_LABELS[entry.group] || entry.group;
      stats.set(label, (stats.get(label) || 0) + 1);
    }
    return Array.from(stats.entries());
  }, [entries]);

  const loadEntries = async () => {
    if (requireManualKey && !adminKey.trim()) {
      setError("请输入管理密码");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (adminKey.trim()) headers.Authorization = `Bearer ${adminKey.trim()}`;

      const res = await fetch("/api/recruit", {
        headers,
        cache: "no-store",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "读取失败");
      }
      setEntries(json.data || []);
      setLoaded(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    const rows = filteredEntries.map((entry) => [
      formatTime(entry.createdAt),
      entry.name,
      entry.gender,
      entry.phone,
      entry.email,
      GROUP_LABELS[entry.group] || entry.group,
      entry.note || "",
      entry.id,
    ]);
    const headers = ["提交时间", "姓名", "性别", "电话", "邮箱", "意向组别", "备注", "ID"];
    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yz-control-recruit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteEntry = async (entry: RecruitEntry) => {
    if (deletingId) return;
    const ok = window.confirm(`确认删除 ${entry.name} 的报名记录？`);
    if (!ok) return;

    setDeletingId(entry.id);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (adminKey.trim()) headers.Authorization = `Bearer ${adminKey.trim()}`;

      const res = await fetch(`/api/recruit?id=${encodeURIComponent(entry.id)}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "删除失败");
      }
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-rm-blue">
            Admin Console
          </p>
          <h1 className="text-3xl font-black text-white md:text-5xl">
            报名记录
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-rm-gray">
            这里读取的是提交成功后写入 KV 的完整名单，QQ 邮箱只是提醒。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:flex">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="font-mono text-2xl font-black text-white">
              {entries.length}
            </div>
            <div className="text-xs text-rm-gray">总报名</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="font-mono text-2xl font-black text-rm-blue">
              {filteredEntries.length}
            </div>
            <div className="text-xs text-rm-gray">当前显示</div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(220px,320px)_auto_auto]">
          {requireManualKey ? (
            <label className="relative block">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rm-gray" />
              <input
                type="password"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadEntries();
                }}
                placeholder="ADMIN_KEY"
                className="h-11 w-full rounded-lg border border-white/10 bg-rm-dark/80 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-rm-gray/50 focus:border-rm-red/50"
              />
            </label>
          ) : (
            <div className="flex h-11 items-center rounded-lg border border-white/10 bg-rm-dark/80 px-3 text-sm text-rm-gray">
              已使用管理员登录态
            </div>
          )}

          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rm-gray" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索姓名、组别、电话"
              className="h-11 w-full rounded-lg border border-white/10 bg-rm-dark/80 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-rm-gray/50 focus:border-rm-blue/50"
            />
          </label>

          <button
            type="button"
            onClick={loadEntries}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rm-blue/40 bg-rm-blue/10 px-4 text-sm font-bold text-rm-blue transition-colors hover:bg-rm-blue/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            查看
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={!filteredEntries.length}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rm-red/40 bg-rm-red/10 px-4 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            导出
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-rm-red/30 bg-rm-red/10 px-4 py-2 text-sm text-rm-red">
            {error}
          </div>
        )}

        {!!groupStats.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {groupStats.map(([group, count], index) => (
              <span
                key={group}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                  index % 2 === 0
                    ? "border-rm-red/30 bg-rm-red/10 text-rm-red"
                    : "border-rm-blue/30 bg-rm-blue/10 text-rm-blue"
                }`}
              >
                {group} {count}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-rm-gray">
              <tr>
                <th className="px-4 py-3">提交时间</th>
                <th className="px-4 py-3">姓名</th>
                <th className="px-4 py-3">性别</th>
                <th className="px-4 py-3">电话</th>
                <th className="px-4 py-3">邮箱</th>
                <th className="px-4 py-3">组别</th>
                <th className="px-4 py-3">备注</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="text-rm-gray hover:bg-white/[0.03]">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                    {formatTime(entry.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-white">
                    {entry.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{entry.gender}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono">
                    {entry.phone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{entry.email}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full border border-rm-blue/30 bg-rm-blue/10 px-2.5 py-1 text-xs font-bold text-rm-blue">
                      {GROUP_LABELS[entry.group] || entry.group}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-rm-gray">
                    {entry.note || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteEntry(entry)}
                      disabled={deletingId === entry.id}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 text-xs font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === entry.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border border-white/10 bg-rm-dark/70 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">{entry.name}</h2>
                  <p className="mt-1 font-mono text-xs text-rm-gray">
                    {formatTime(entry.createdAt)}
                  </p>
                </div>
                <span className="rounded-full border border-rm-blue/30 bg-rm-blue/10 px-2.5 py-1 text-xs font-bold text-rm-blue">
                  {GROUP_LABELS[entry.group] || entry.group}
                </span>
              </div>
              <div className="grid gap-2 text-sm text-rm-gray">
                <div>性别：{entry.gender}</div>
                <div>电话：{entry.phone}</div>
                <div>邮箱：{entry.email}</div>
                <div>备注：{entry.note || "-"}</div>
              </div>
              <button
                type="button"
                onClick={() => deleteEntry(entry)}
                disabled={deletingId === entry.id}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-rm-red/30 bg-rm-red/10 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId === entry.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                删除记录
              </button>
            </article>
          ))}
        </div>

        {loaded && !filteredEntries.length && (
          <div className="px-4 py-16 text-center text-sm text-rm-gray">
            没有匹配的报名记录
          </div>
        )}

        {!loaded && (
          <div className="px-4 py-16 text-center text-sm text-rm-gray">
            {requireManualKey ? "输入 ADMIN_KEY 后查看报名名单" : "点击查看后读取报名名单"}
          </div>
        )}
      </div>
    </section>
  );
}
