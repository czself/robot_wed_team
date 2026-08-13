import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { TeamResource } from "@/data/portal";
import { RESOURCE_CATEGORIES } from "@/data/team-directions";
import { listResources } from "@/lib/resources";
import { requirePasswordReadyUser } from "@/lib/session";

export const metadata = {
  title: "队内资料库",
};

export const dynamic = "force-dynamic";

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

const levels: Array<TeamResource["level"] | "全部"> = ["全部", "入门", "进阶", "项目", "规范"];
const categories: Array<TeamResource["category"] | "全部"> = [
  "全部",
  ...RESOURCE_CATEGORIES,
];

function pickFilter(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "全部" : value || "全部";
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export default async function PortalDocsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string | string[]; category?: string | string[] }>;
}) {
  await requirePasswordReadyUser();
  const params = await searchParams;
  const level = pickFilter(params.level);
  const category = pickFilter(params.category);
  const resources = await listResources();
  const filteredResources = resources.filter((item) => {
    const levelMatched = level === "全部" || item.level === level;
    const categoryMatched = category === "全部" || item.category === category;
    return levelMatched && categoryMatched;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-rm-blue">
            Knowledge Base
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">队内资料库</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-rm-gray">
            第一阶段以资料索引为主，真实文件不要放在 public 目录；后续可接对象存储和细粒度权限。
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap gap-2">
          {levels.map((item) => (
            <Link
              key={item}
              href={`/portal/docs?level=${encodeURIComponent(item)}${
                category !== "全部" ? `&category=${encodeURIComponent(category)}` : ""
              }`}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                level === item
                  ? "border-rm-red/50 bg-rm-red/15 text-rm-red"
                  : "border-white/10 bg-white/[0.03] text-rm-gray hover:text-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Link
              key={item}
              href={`/portal/docs?category=${encodeURIComponent(item)}${
                level !== "全部" ? `&level=${encodeURIComponent(level)}` : ""
              }`}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                category === item
                  ? "border-rm-blue/50 bg-rm-blue/15 text-rm-blue"
                  : "border-white/10 bg-white/[0.03] text-rm-gray hover:text-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-rm-blue/30 bg-rm-blue/10 px-2.5 py-1 text-xs font-bold text-rm-blue">
                {item.category}
              </span>
              <span className="rounded-full border border-rm-red/30 bg-rm-red/10 px-2.5 py-1 text-xs font-bold text-rm-red">
                {item.level}
              </span>
            </div>
            <h3 className="text-lg font-black text-white">{item.title}</h3>
            <p className="mt-3 min-h-20 text-sm leading-7 text-rm-gray">{item.summary}</p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <span className="font-mono text-xs text-rm-gray/70">
                {formatDate(item.updatedAt)}
              </span>
              {isExternalHref(item.href) ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-rm-blue hover:text-white"
                >
                  打开
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-rm-blue hover:text-white"
                >
                  打开
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {!filteredResources.length && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-16 text-center text-sm text-rm-gray">
          当前筛选下暂无资料
        </div>
      )}
    </div>
  );
}
