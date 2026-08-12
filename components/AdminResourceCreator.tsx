"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, Plus, RefreshCw } from "lucide-react";
import type { TeamResource } from "@/data/portal";

const categories: TeamResource["category"][] = ["嵌入式", "机械", "视觉", "算法", "运营", "战队管理"];
const levels: TeamResource["level"][] = ["入门", "进阶", "项目", "规范"];

export default function AdminResourceCreator() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    category: "嵌入式" as TeamResource["category"],
    level: "入门" as TeamResource["level"],
    href: "",
    summary: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
    setError(null);
  };

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/portal/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "添加失败");
      setMessage("资料已添加。");
      router.refresh();
      setForm({
        title: "",
        category: "嵌入式",
        level: "入门",
        href: "",
        summary: "",
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rm-blue/30 bg-rm-blue/10 text-rm-blue">
          <FilePlus className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-black text-white">添加资料索引</h3>
          <p className="text-xs text-rm-gray">先添加受控链接，不把私有文件放入 public</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="资料标题"
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
        />
        <input
          value={form.href}
          onChange={(e) => update("href", e.target.value)}
          placeholder="资料链接，例如 /portal/docs 或网盘链接"
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-red/50"
        />
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none focus:border-rm-blue/50"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={form.level}
          onChange={(e) => update("level", e.target.value)}
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none focus:border-rm-red/50"
        >
          {levels.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <textarea
        value={form.summary}
        onChange={(e) => update("summary", e.target.value)}
        placeholder="资料简介"
        rows={3}
        className="mt-3 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 py-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
      />

      {message && (
        <div className="mt-3 rounded-lg border border-rm-blue/30 bg-rm-blue/10 px-3 py-2 text-sm text-rm-blue">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 py-2 text-sm text-rm-red">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rm-blue/40 bg-rm-blue/10 px-4 text-sm font-bold text-rm-blue transition-colors hover:bg-rm-blue/15 disabled:opacity-40"
      >
        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        添加资料
      </button>
    </section>
  );
}
