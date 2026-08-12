"use client";

import { useMemo, useState } from "react";
import { rmul2026Teams, regions } from "@/data/rmul2026";

const rowWidths = [
  "w-[86%] md:w-[70%]",
  "w-[94%] md:w-[82%]",
  "w-[78%] md:w-[62%]",
  "w-[100%] md:w-[88%]",
  "w-[88%] md:w-[74%]",
  "w-[96%] md:w-[80%]",
  "w-[82%] md:w-[66%]",
  "w-[100%] md:w-[92%]",
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

function shuffleTeams<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (seed * (i + 1) * 7 + i * 13) % a.length;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MarqueeRow({
  items,
  speed,
  direction,
  accent,
  paused,
  onHover,
  widthClass,
  offsetClass,
}: {
  items: { school: string; team: string }[];
  speed: number;
  direction: "left" | "right";
  accent: "red" | "blue";
  paused: boolean;
  onHover: (hovered: boolean) => void;
  widthClass: string;
  offsetClass: string;
}) {
  const doubled = useMemo(() => [...items, ...items], [items]);
  const isRed = accent === "red";
  const accentColor = isRed ? "#D90429" : "#00C8FF";

  return (
    <div
      className={`overflow-hidden whitespace-nowrap py-2.5 ${widthClass} ${offsetClass}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div
        className={`inline-flex gap-3 ${direction === "left" ? "marquee-left" : "marquee-right"} ${paused ? "marquee-paused" : ""}`}
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {doubled.map((item, i) => {
          const isHighlight = item.school === "豫章师范学院";
          return (
            <span
              key={`${item.school}-${i}`}
              className={`inline-flex items-center gap-2 rounded border transition-all duration-200 cursor-pointer group ${
                isHighlight
                  ? "px-5 py-2.5 text-sm font-black bg-gradient-to-r from-rm-red to-rm-blue bg-clip-text text-transparent border-rm-red shadow-lg shadow-rm-red/30 animate-pulse hover:scale-110 hover:shadow-rm-red/60 hover:shadow-xl"
                  : "px-3 py-1.5 text-xs font-medium hover:scale-110 hover:shadow-md"
              }`}
              style={
                isHighlight
                  ? { borderColor: "#D90429" }
                  : {
                      color: accentColor,
                      borderColor: `${accentColor}40`,
                      background: isRed
                        ? "linear-gradient(90deg, rgba(217,4,41,0.12), rgba(217,4,41,0.03))"
                        : "linear-gradient(90deg, rgba(0,200,255,0.12), rgba(0,200,255,0.03))",
                      boxShadow: `0 0 18px ${accentColor}12`,
                    }
              }
            >
              {isHighlight ? (
                <span className="inline-flex items-center gap-2">
                  <span className="text-rm-red group-hover:animate-bounce">⚡</span>
                  <span>{item.school}</span>
                  <span className="text-rm-blue font-bold">|</span>
                  <span className="text-rm-blue">{item.team}</span>
                  <span className="text-rm-red group-hover:animate-bounce">⚡</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 group-hover:text-white transition-colors">
                  {item.school}
                  <span className="text-rm-gray font-normal">|</span>
                  {item.team}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamShowcase() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const teamsByRegion = useMemo(() => {
    const grouped: Record<string, { school: string; team: string }[]> = {};
    for (const t of rmul2026Teams) {
      if (!grouped[t.region]) grouped[t.region] = [];
      grouped[t.region].push({ school: t.school, team: t.team });
    }
    return grouped;
  }, []);

  const rows = useMemo(() => {
    const result: { items: { school: string; team: string }[]; speed: number; direction: "left" | "right"; region: string; accent: "red" | "blue"; widthClass: string; offsetClass: string }[] = [];

    const regionNames = Object.keys(teamsByRegion);
    for (let i = 0; i < regionNames.length; i++) {
      const region = regionNames[i];
      const teams = teamsByRegion[region];
      result.push({
        items: shuffleTeams(teams, i + 1),
        speed: 54 + teams.length * 2 + (i % 3) * 6,
        direction: i % 2 === 0 ? "left" : "right",
        region,
        accent: i % 2 === 0 ? "red" : "blue",
        widthClass: rowWidths[i % rowWidths.length],
        offsetClass: rowOffsets[i % rowOffsets.length],
      });
    }

    return result;
  }, [teamsByRegion]);

  const totalTeams = rmul2026Teams.length;
  const totalRegions = regions.length;

  return (
    <section id="teams" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" />

      {/* 豫章师范学院 - 突出展示 */}
      <div className="relative max-w-2xl mx-auto mb-12 px-4">
        <div className="relative p-6 rounded-2xl border-2 border-rm-red/50 bg-gradient-to-br from-rm-red/10 to-rm-blue/10 backdrop-blur-sm shadow-2xl shadow-rm-red/20 hover:shadow-rm-red/40 hover:border-rm-red transition-all duration-500 cursor-pointer group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rm-red text-white text-xs font-bold px-4 py-1 rounded-full tracking-wider">
            ⚡ YZ Control ⚡
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-rm-red text-2xl group-hover:animate-bounce">⚡</span>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
                豫章师范学院
              </p>
              <p className="text-lg md:text-xl font-bold text-rm-blue mt-1 tracking-wider">
                YZ Control
              </p>
            </div>
            <span className="text-rm-red text-2xl group-hover:animate-bounce">⚡</span>
          </div>
          <p className="text-center text-rm-gray text-xs mt-3">
            上海站 · 4.2-4.5 · 高校联盟赛
          </p>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-sm tracking-[0.3em] uppercase mb-3">
          <span className="text-rm-red">RoboMaster</span>{" "}
          <span className="text-rm-blue">2026</span>
        </p>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
          高校联盟赛参赛队伍
        </h2>
        <p className="mt-4 text-rm-gray text-sm">
          全国 {totalRegions} 大赛区 · {totalTeams} 支战队 · 蓄势待发
        </p>
      </div>

      <div className="relative max-w-full">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        {rows.map((row, idx) => (
          <div key={row.region} className="relative py-1.5">
            <div
              className="relative z-20 mb-1 ml-4 md:ml-8 inline-flex items-center gap-2 rounded border bg-[#0A0A0A]/85 px-2.5 py-1 text-[10px] font-bold tracking-widest shadow-lg backdrop-blur-sm transition-opacity duration-300"
              style={{
                color: row.accent === "red" ? "#ff4d6a" : "#00C8FF",
                borderColor: row.accent === "red" ? "#D904294D" : "#00C8FF4D",
                opacity: hoveredRow === idx ? 1 : 0.9,
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
            <MarqueeRow
              items={row.items}
              speed={row.speed}
              direction={row.direction}
              accent={row.accent}
              paused={hoveredRow === idx}
              widthClass={row.widthClass}
              offsetClass={row.offsetClass}
              onHover={(hovered) => setHoveredRow(hovered ? idx : null)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
