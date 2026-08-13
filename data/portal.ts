import type { TeamResourceCategory } from "@/data/team-directions";

export interface TeamResource {
  id: string;
  title: string;
  category: TeamResourceCategory;
  level: "入门" | "进阶" | "项目" | "规范";
  href: string;
  summary: string;
  updatedAt: number;
  source?: "default" | "custom";
}

export const defaultResources: TeamResource[] = [
  {
    id: "electrical-stm32-roadmap",
    title: "电控入门路线",
    category: "电控",
    level: "入门",
    href: "/tech",
    summary: "C 语言、GPIO、UART、CAN、FreeRTOS 到电机闭环的学习路径。",
    updatedAt: Date.UTC(2026, 7, 12),
  },
  {
    id: "electrical-vision-checklist",
    title: "电控视觉上车检查清单",
    category: "电控",
    level: "项目",
    href: "/tech",
    summary: "相机标定、模型部署、串口协议、延迟和弹道补偿检查项。",
    updatedAt: Date.UTC(2026, 7, 12),
  },
  {
    id: "mechanical-assembly-rules",
    title: "机械装配与维护规范",
    category: "机械",
    level: "规范",
    href: "/about#robots",
    summary: "装配记录、螺纹胶、线束固定、赛前机械状态巡检。",
    updatedAt: Date.UTC(2026, 7, 12),
  },
];
