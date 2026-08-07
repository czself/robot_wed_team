export interface Award {
  year: string;
  title: string;
  event: string;
  level: "national" | "provincial" | "regional";
}

export const awards: Award[] = [
  {
    year: "2026",
    title: "全国二等奖",
    event: "RoboMaster 2026 步兵对抗赛",
    level: "national",
  },
  {
    year: "2026",
    title: "全国三等奖",
    event: "RoboMaster 2026 机甲大师超级对抗赛 3v3",
    level: "national",
  },
];

export const timeline = [
  { year: "2025", events: ["战队成立", "步兵 V1 首次亮相", "首战即国二国三"] },
  { year: "2026", events: ["步兵 V2 升级", "3v3 赛制转型", "哨兵自主系统开发"] },
];