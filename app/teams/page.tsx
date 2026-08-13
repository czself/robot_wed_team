import type { Metadata } from "next";
import Link from "next/link";
import { rmul2026Teams, regions } from "@/data/rmul2026";

export const metadata: Metadata = {
  title: "RoboMaster 2026 参赛队伍",
  description: "RoboMaster 2026 高校联盟赛九大赛区参赛学校与战队名单。",
};

export default function TeamsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 pb-24 pt-32">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em]">
            <span className="text-rm-red">RMUL</span>{" "}
            <span className="text-rm-blue">2026</span>
          </p>
          <h1 className="bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-4xl font-black text-transparent md:text-6xl">
            高校联盟赛参赛名单
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-rm-gray md:text-base">
            共 {regions.length} 个赛区、{rmul2026Teams.length} 支战队。名单按赛区整理，首页仅展示代表性队伍以保持加载轻量。
          </p>
          <Link
            href="/#teams"
            className="mt-6 inline-flex text-sm font-bold text-rm-blue hover:text-white"
          >
            ← 返回首页
          </Link>
        </header>

        <div className="space-y-10">
          {regions.map((region) => {
            const teams = rmul2026Teams.filter(
              (team) => team.region === region.name
            );
            return (
              <section key={region.name} aria-labelledby={`region-${region.name}`}>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2
                      id={`region-${region.name}`}
                      className="text-2xl font-black text-white"
                    >
                      {region.name}
                    </h2>
                    <p className="mt-1 text-xs text-rm-gray">赛程：{region.date}</p>
                  </div>
                  <span className="font-mono text-xs text-rm-gray">
                    {teams.length} 支战队
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {teams.map((team) => {
                    const highlighted = team.school === "豫章师范学院";
                    return (
                      <article
                        key={`${team.region}-${team.school}`}
                        className={`rounded-lg border p-4 ${
                          highlighted
                            ? "border-rm-red/60 bg-gradient-to-br from-rm-red/15 to-rm-blue/10"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <h3 className="font-bold text-white">{team.school}</h3>
                        <p className={`mt-2 text-sm ${highlighted ? "text-rm-blue" : "text-rm-gray"}`}>
                          {team.team}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
