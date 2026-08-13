import Link from "next/link";
import { rmul2026Teams, regions, type RmulTeam } from "@/data/rmul2026";

const rowWidths = [
  "w-[86%] md:w-[70%]",
  "w-[94%] md:w-[82%]",
  "w-[78%] md:w-[62%]",
  "w-full md:w-[88%]",
  "w-[88%] md:w-[74%]",
  "w-[96%] md:w-[80%]",
  "w-[82%] md:w-[66%]",
  "w-full md:w-[92%]",
  "w-[90%] md:w-[76%]",
];

const rowOffsets = [
  "ml-0",
  "ml-auto",
  "ml-[8%] md:ml-[14%]",
  "ml-0",
  "ml-auto",
  "ml-[4%] md:ml-[10%]",
  "ml-auto",
  "ml-0",
  "ml-[6%] md:ml-[12%]",
];

const TEAMS_PER_ROW = 7;

function shuffleTeams<T>(items: T[], seed: number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const target = (seed * (index + 1) * 7 + index * 13) % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function rowTeams(teams: RmulTeam[], seed: number): RmulTeam[] {
  const selected = shuffleTeams(teams, seed).slice(0, TEAMS_PER_ROW);
  const yzControl = teams.find((team) => team.school === "豫章师范学院");
  if (yzControl && !selected.some((team) => team.school === yzControl.school)) {
    selected[selected.length - 1] = yzControl;
  }
  return selected;
}

function MarqueeRow({
  items,
  speed,
  direction,
  accent,
  widthClass,
  offsetClass,
}: {
  items: RmulTeam[];
  speed: number;
  direction: "left" | "right";
  accent: "red" | "blue";
  widthClass: string;
  offsetClass: string;
}) {
  const doubled = [...items, ...items];
  const accentColor = accent === "red" ? "#D90429" : "#00C8FF";

  return (
    <div
      className={`marquee-row overflow-hidden whitespace-nowrap py-2.5 ${widthClass} ${offsetClass}`}
    >
      <div
        className={`marquee-track inline-flex gap-3 ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {doubled.map((item, index) => {
          const highlighted = item.school === "豫章师范学院";
          return (
            <span
              key={`${item.school}-${index}`}
              className={`inline-flex items-center gap-2 rounded border transition-colors duration-200 ${
                highlighted
                  ? "border-rm-red bg-gradient-to-r from-rm-red to-rm-blue bg-clip-text px-5 py-2.5 text-sm font-black text-transparent shadow-lg shadow-rm-red/30"
                  : "px-3 py-1.5 text-xs font-medium hover:text-white"
              }`}
              style={
                highlighted
                  ? undefined
                  : {
                      color: accentColor,
                      borderColor: `${accentColor}40`,
                      background:
                        accent === "red"
                          ? "linear-gradient(90deg, rgba(217,4,41,0.12), rgba(217,4,41,0.03))"
                          : "linear-gradient(90deg, rgba(0,200,255,0.12), rgba(0,200,255,0.03))",
                    }
              }
            >
              {item.school}
              <span className="text-rm-gray font-normal">|</span>
              {item.team}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamShowcase() {
  const rows = regions.map((region, index) => ({
    region: region.name,
    items: rowTeams(
      rmul2026Teams.filter((team) => team.region === region.name),
      index + 1
    ),
    speed: 48 + index * 4,
    direction: index % 2 === 0 ? ("left" as const) : ("right" as const),
    accent: index % 2 === 0 ? ("red" as const) : ("blue" as const),
    widthClass: rowWidths[index % rowWidths.length],
    offsetClass: rowOffsets[index % rowOffsets.length],
  }));

  return (
    <section id="teams" className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-grid opacity-15" />

      <div className="relative mx-auto mb-12 max-w-2xl px-4">
        <div className="relative rounded-2xl border-2 border-rm-red/50 bg-gradient-to-br from-rm-red/10 to-rm-blue/10 p-6 shadow-2xl shadow-rm-red/20 backdrop-blur-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rm-red px-4 py-1 text-xs font-bold tracking-wider text-white">
            ⚡ YZ Control ⚡
          </div>
          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="text-2xl text-rm-red">⚡</span>
            <div className="text-center">
              <p className="bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-2xl font-black text-transparent md:text-3xl">
                豫章师范学院
              </p>
              <p className="mt-1 text-lg font-bold tracking-wider text-rm-blue md:text-xl">
                YZ Control
              </p>
            </div>
            <span className="text-2xl text-rm-red">⚡</span>
          </div>
          <p className="mt-3 text-center text-xs text-rm-gray">
            上海站 · 2026.04 · 高校联盟赛记录
          </p>
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em]">
          <span className="text-rm-red">RoboMaster</span>{" "}
          <span className="text-rm-blue">2026</span>
        </p>
        <h2 className="bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-3xl font-black text-transparent md:text-5xl">
          高校联盟赛参赛队伍
        </h2>
        <p className="mt-4 text-sm text-rm-gray">
          全国 {regions.length} 大赛区 · {rmul2026Teams.length} 支战队 · 赛季参赛阵容
        </p>
      </div>

      <div className="relative max-w-full">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-[#0A0A0A] to-transparent md:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent md:w-32" />

        {rows.map((row) => (
          <div key={row.region} className="relative py-1.5">
            <div
              className="relative z-20 mb-1 ml-4 inline-flex items-center gap-2 rounded border bg-[#0A0A0A]/85 px-2.5 py-1 text-[10px] font-bold tracking-widest shadow-lg backdrop-blur-sm md:ml-8"
              style={{
                color: row.accent === "red" ? "#ff4d6a" : "#00C8FF",
                borderColor: row.accent === "red" ? "#D904294D" : "#00C8FF4D",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: row.accent === "red" ? "#D90429" : "#00C8FF",
                }}
              />
              {row.region}
            </div>
            <MarqueeRow {...row} />
          </div>
        ))}
      </div>

      <div className="relative mt-10 text-center">
        <Link
          href="/teams"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-rm-blue/40 bg-rm-blue/10 px-5 text-sm font-bold text-rm-blue transition-colors hover:bg-rm-blue/15 hover:text-white"
        >
          查看完整参赛名单 →
        </Link>
      </div>
    </section>
  );
}
