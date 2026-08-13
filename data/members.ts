import type { RecruitDirectionKey } from "@/data/team-directions";

export interface TeamGroup {
  id: RecruitDirectionKey;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  skills: string[];
}

export const teamGroups: TeamGroup[] = [
  {
    id: "mechanical",
    name: "机械组",
    nameEn: "Mechanical",
    icon: "⚙️",
    description: "从零设计每一代机器人结构，CAD 建模、加工装配、结构优化，让钢铁拥有灵魂。",
    skills: ["SolidWorks", "3D打印", "CNC", "碳纤维", "结构优化"],
  },
  {
    id: "electrical",
    name: "电控组",
    nameEn: "Electrical Control",
    icon: "⚡",
    description: "机器人的神经与感知系统。STM32 固件、电机控制、通信、视觉自瞄与控制算法都在这里协同完成。",
    skills: ["STM32", "FreeRTOS", "CAN", "PID", "OpenCV", "YOLO", "自瞄"],
  },
];

export const recruitmentLinks: Record<RecruitDirectionKey, string> = {
  mechanical: "/recruit",
  electrical: "/recruit",
};
