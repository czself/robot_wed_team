export interface Robot {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
  images?: string[];
}

export const robots: Robot[] = [
  {
    id: "hero",
    name: "Hero",
    nameCn: "英雄机器人",
    description:
      "3v3 赛场上的火力核心。42mm 大弹丸发射器 + 双轴云台精准打击，在关键时刻扭转战局。",
    specs: [
      { label: "弹丸类型", value: "42mm 大弹丸" },
      { label: "云台响应", value: "1 kHz INS" },
      { label: "底盘电机", value: "4×M3508" },
      { label: "云台电机", value: "2×GM6020" },
      { label: "控制周期", value: "50 Hz / 200 Hz" },
      { label: "MCU", value: "STM32F407" },
    ],
    tags: ["STM32F407", "FreeRTOS", "大弹丸", "CAN", "BMI088", "EKF"],
    images: [
      "/images/robots/hero-1.png",
      "/images/robots/hero-2.png",
      "/images/robots/hero-3.png",
      "/images/robots/hero-4.png",
    ],
  },
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
    images: [
      "/images/robots/infantry-1.png",
      "/images/robots/infantry-2.png",
      "/images/robots/infantry-3.png",
      "/images/robots/infantry-4.png",
    ],
  },
  {
    id: "sentry",
    name: "Sentry",
    nameCn: "哨兵机器人",
    description:
      "3v3 赛场上的自动防线。自主巡逻、目标识别与策略决策协同工作，独立守护基地安全。",
    specs: [
      { label: "巡逻速度", value: "~2 m/s" },
      { label: "追踪精度", value: "±2°" },
      { label: "自主决策", value: "导航与策略" },
      { label: "底盘电机", value: "4×M3508" },
    ],
    tags: ["路径规划", "TensorRT", "自动巡逻", "目标追踪"],
    images: [
      "/images/robots/sentry-1.png",
      "/images/robots/sentry-2.png",
      "/images/robots/sentry-3.png",
      "/images/robots/sentry-4.png",
    ],
  },
];
