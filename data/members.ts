export interface TeamGroup {
  id: string;
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
    id: "embedded",
    name: "嵌入式组",
    nameEn: "Embedded",
    icon: "🔌",
    description: "底层硬件的灵魂工程师。STM32 固件开发、FreeRTOS 实时调度、CAN 总线通信、PID 闭环控制，让每个执行器精准响应。",
    skills: ["STM32F407", "FreeRTOS", "CAN", "PID", "BMI088", "EKF"],
  },
  {
    id: "vision",
    name: "视觉组",
    nameEn: "Vision",
    icon: "👁️",
    description: "赋予机器人感知世界的能力。装甲板识别、弹道预测、自瞄系统，让机器看见战场。",
    skills: ["YOLOv8", "OpenCV", "TensorRT", "相机标定", "弹道预测"],
  },
  {
    id: "algorithm",
    name: "算法组",
    nameEn: "Algorithm",
    icon: "🧠",
    description: "战场上的决策大脑。哨兵自主巡逻、路径规划、强化学习，让机器人学会独立思考。",
    skills: ["ROS2", "SLAM", "强化学习", "路径规划", "C++"],
  },
  {
    id: "operations",
    name: "运营组",
    nameEn: "Operations",
    icon: "📢",
    description: "战队的对外窗口与后勤保障。宣传推广、赛事运营、赞助对接，让团队无后顾之忧。",
    skills: ["新媒体", "赛事运营", "赞助", "设计", "视频剪辑"],
  },
];

export const recruitmentLinks: Record<string, string> = {
  mechanical: "/recruit",
  embedded: "/recruit",
  vision: "/recruit",
  algorithm: "/recruit",
  operations: "/recruit",
};