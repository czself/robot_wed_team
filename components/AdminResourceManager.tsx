"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Save, Trash2 } from "lucide-react";
import type { TeamResource } from "@/data/portal";

const categories: TeamResource["category"][] = ["嵌入式", "机械", "视觉", "算法", "运营", "战队管理"];
const levels: TeamResource["level"][] = ["入门", "进阶", "项目", "规范"];

export default function AdminResourceManager({
  initialResources,
}: {
  initialResources: TeamResource[];
}) {
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setResource = (id: string, patch: Partial<TeamResource>) => {
    setResources((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
    setError(null);
  };

  const saveResource = async (resource: TeamResource) => {
    if (resource.source === "default" || busyId) return;
    setBusyId(resource.id);
    setError(null);
    try {
      const res = await fetch("/api/portal/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "保存失败");
      setResource(resource.id, json.data);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const removeResource = async (resource: TeamResource) => {
    if (resource.source === "default" || busyId) return;
    setBusyId(resource.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/portal/resources?id=${encodeURIComponent(resource.id)}`,
        { method: "DELETE" }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "删除失败");
      setResources((prev) => prev.filter((item) => item.id !== resource.id));
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="font-black text-white">资料索引管理</h3>
        <p className="mt-1 text-xs text-rm-gray">
          默认资料只读，管理员新增的资料可以编辑和删除。
        </p>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 py-2 text-sm text-rm-red">
          {error}
        </div>
      )}

      <div className="divide-y divide-white/5">
        {resources.map((resource) => {
          const readonly = resource.source === "default";
          return (
            <div
              key={resource.id}
              className="grid gap-3 px-5 py-4 text-sm xl:grid-cols-[1fr_130px_110px_1fr_150px]"
            >
              <div className="space-y-2">
                <input
                  value={resource.title}
                  onChange={(e) => setResource(resource.id, { title: e.target.value })}
                  disabled={readonly}
                  className="h-9 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm font-bold text-white outline-none focus:border-rm-blue/50 disabled:opacity-60"
                />
                <input
                  value={resource.href}
                  onChange={(e) => setResource(resource.id, { href: e.target.value })}
                  disabled={readonly}
                  className="h-9 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 font-mono text-xs text-rm-gray outline-none focus:border-rm-red/50 disabled:opacity-60"
                />
              </div>

              <select
                value={resource.category}
                onChange={(e) =>
                  setResource(resource.id, {
                    category: e.target.value as TeamResource["category"],
                  })
                }
                disabled={readonly}
                className="h-9 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-blue/50 disabled:opacity-60"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

              <select
                value={resource.level}
                onChange={(e) =>
                  setResource(resource.id, {
                    level: e.target.value as TeamResource["level"],
                  })
                }
                disabled={readonly}
                className="h-9 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-red/50 disabled:opacity-60"
              >
                {levels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>

              <textarea
                value={resource.summary}
                onChange={(e) => setResource(resource.id, { summary: e.target.value })}
                disabled={readonly}
                rows={3}
                className="rounded-lg border border-white/10 bg-rm-dark/70 px-3 py-2 text-sm text-rm-gray outline-none focus:border-rm-blue/50 disabled:opacity-60"
              />

              <div className="flex items-start gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                    readonly
                      ? "border-white/10 text-rm-gray"
                      : "border-rm-blue/30 bg-rm-blue/10 text-rm-blue"
                  }`}
                >
                  {readonly ? "默认" : "自定义"}
                </span>
                <button
                  type="button"
                  onClick={() => void saveResource(resource)}
                  disabled={readonly || busyId === resource.id}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rm-blue/30 bg-rm-blue/10 text-rm-blue transition-colors hover:bg-rm-blue/15 disabled:opacity-40"
                  aria-label="保存资料"
                  title="保存资料"
                >
                  {busyId === resource.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void removeResource(resource)}
                  disabled={readonly || busyId === resource.id}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rm-red/30 bg-rm-red/10 text-rm-red transition-colors hover:bg-rm-red/15 disabled:opacity-40"
                  aria-label="删除资料"
                  title="删除资料"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
