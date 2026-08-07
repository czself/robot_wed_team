export interface Robot {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
}

export const robots: Robot[] = [
  {
    id: "infantry",
    name: "Infantry",
    nameCn: "步兵机器人",
    description:
      "3v3 赛场上的核心输出。四全向轮底盘 + 双轴云台 + 摩擦轮发射，小陀螺模式下的机动与精准打击让对手无处可藏。",
    specs: [
      { label: "最大平移速度", value: "~2.0 m/s" },
      { label: "云台响应", value: "1 kHz INS" },
      { label: "底盘电机", value: "4×M3508" },
      { label: "云台电机", value: "2×GM6020" },
      { label: "控制周期", value: "50 Hz / 200 Hz" },
      { label: "MCU", value: "STM32F407" },
    ],
    tags: ["STM32F407", "FreeRTOS", "PID", "CAN", "BMI088", "EKF"],
  },
  {
    id: "engineer",
    name: "Engineer",
    nameCn: "工程机器人",
    description:
      "3v3 赛场的资源核心。自主取弹兑换，机械臂与视觉引导协同，在激烈对抗中稳定保障弹药供给。",
    specs: [
      { label: "取弹时间", value: "< 8s" },
      { label: "机械臂自由度", value: "5 DOF" },
      { label: "视觉引导", value: "YOLOv8" },
      { label: "底盘电机", value: "4×M3508" },
    ],
    tags: ["YOLOv8", "机械臂", "视觉引导", "自主取弹"],
  },
  {
    id: "sentry",
    name: "Sentry",
    nameCn: "哨兵机器人",
    description:
      "3v3 赛场上的自动防线。全自动巡逻与目标追踪，无需操作手操控，独立守护基地安全。",
    specs: [
      { label: "巡逻速度", value: "~2 m/s" },
      { label: "追踪精度", value: "±2°" },
      { label: "自主决策", value: "强化学习" },
      { label: "底盘电机", value: "4×M3508" },
    ],
    tags: ["强化学习", "TensorRT", "自动巡逻", "目标追踪"],
  },
];