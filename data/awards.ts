export interface Award {
  year: string;
  title: string;
  event: string;
  level: "national" | "provincial" | "regional";
  certificate?: string;
}

export const awards: Award[] = [
  {
    year: "2026",
    title: "全国二等奖",
    event: "RoboMaster 2026 步兵对抗赛",
    level: "national",
    certificate: "/images/awards/rmul-2nd-infantry.jpg",
  },
  {
    year: "2026",
    title: "全国三等奖",
    event: "RoboMaster 2026 3v3 步兵机器人组",
    level: "national",
    certificate: "/images/awards/rmul-3rd-infantry-3v3.jpg",
  },
  {
    year: "2026",
    title: "全国三等奖",
    event: "RoboMaster 2026 3v3 英雄机器人组",
    level: "national",
    certificate: "/images/awards/rmul-3rd-hero-3v3.jpg",
  },
  {
    year: "2026",
    title: "优秀奖",
    event: "RoboMaster 2026 3v3 哨兵机器人组",
    level: "national",
    certificate: "/images/awards/rmul-excellence-sentry-3v3.jpg",
  },
];

export const timeline = [
  { year: "2025", events: ["战队成立", "步兵 V1 首次亮相", "首战即国二国三"] },
  { year: "2026", events: ["步兵 V2 升级", "3v3 赛制转型", "哨兵自主系统开发"] },
];