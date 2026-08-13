"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface TechNode {
  id: string;
  label: string;
  description: string;
  children?: TechNode[];
}

const techTree: TechNode[] = [
  {
    id: "rm2026",
    label: "RM2026",
    description: "RoboMaster 2026 赛季 3v3 对抗，步兵/英雄/哨兵三台机器人协同作战",
    children: [
      {
        id: "electrical",
        label: "Electrical Control",
        description: "电控组负责 STM32 + FreeRTOS 实时控制、电机闭环、通信与视觉自瞄模块",
        children: [
          { id: "stm32f407", label: "STM32F407", description: "168MHz Cortex-M4F，步兵主控 MCU" },
          { id: "freertos", label: "FreeRTOS", description: "实时操作系统，多任务调度与看门狗守护" },
          { id: "can", label: "CAN Bus", description: "双 CAN 总线，驱动 M3508/GM6020 电机" },
          { id: "pid", label: "PID", description: "速度环+电流环串级 PID，底盘/云台核心控制" },
        ],
      },
      {
        id: "sensing",
        label: "Sensing",
        description: "IMU 姿态解算 + 裁判系统通信，构建机器人感知与安全链路",
        children: [
          { id: "bmi088", label: "BMI088", description: "六轴 IMU，1kHz 姿态更新" },
          { id: "ekf", label: "QuaternionEKF", description: "四元数扩展卡尔曼滤波，融合陀螺仪与加速度计" },
          { id: "referee", label: "Referee 2026", description: "裁判系统 V1.2 协议，功率/热量/血量实时联锁" },
          { id: "et08", label: "ET08 + VT", description: "ET08 遥控器 + VT03/VT13 图传链路" },
        ],
      },
      {
        id: "vision-autoaim",
        label: "Vision & Auto Aim",
        description: "电控方向内的视觉自瞄模块：感知、识别、解算与云台联动",
        children: [
          { id: "yolo", label: "YOLOv8", description: "装甲板实时检测与识别" },
          { id: "tensorrt", label: "TensorRT", description: "边缘端模型推理加速" },
          { id: "opencv", label: "OpenCV", description: "相机标定与图像处理管线" },
          { id: "autoaim", label: "Auto Aim", description: "PnP 解算、弹道补偿与云台控制联动" },
        ],
      },
    ],
  },
];

function TechNodeCard({
  node,
  depth,
  isInView,
}: {
  node: TechNode;
  depth: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isRoot = depth === 0;

  const colors = [
    "border-rm-red/40 text-rm-red bg-rm-red/5",
    "border-rm-blue/40 text-rm-blue bg-rm-blue/5",
    "border-white/20 text-white bg-white/5",
  ];

  const colorClass = colors[depth % colors.length];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: depth * 0.2, duration: 0.5 }}
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`px-6 py-3 rounded-lg border ${colorClass} font-mono text-sm font-bold cursor-default transition-all duration-300 ${
            isRoot ? "text-lg px-8 py-4" : ""
          } ${hovered ? "shadow-[0_0_20px_rgba(0,200,255,0.2)]" : ""}`}
        >
          {node.label}
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-4 rounded-lg glass text-sm text-white leading-relaxed"
            >
              {node.description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-8 bg-gradient-to-b from-rm-blue/30 to-rm-red/30" />
          <div className="flex gap-6 md:gap-10 flex-wrap justify-center">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <TechNodeCard
                  node={child}
                  depth={depth + 1}
                  isInView={isInView}
                />
                {child.children && child.children.length > 0 && (
                  <>
                    <div className="w-px h-6 bg-gradient-to-b from-rm-red/20 to-rm-blue/20" />
                    <div className="flex gap-3 flex-wrap justify-center">
                      {child.children.map((leaf) => (
                        <TechNodeCard
                          key={leaf.id}
                          node={leaf}
                          depth={depth + 2}
                          isInView={isInView}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TechTree() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tech" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-radial-blue opacity-30" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Tech</span>{" "}
            <span className="text-rm-blue">nology</span>
          </p>
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            技术栈
          </h2>
        </motion.div>

        <div className="flex justify-center overflow-x-auto pb-8">
          {techTree.map((node) => (
            <TechNodeCard
              key={node.id}
              node={node}
              depth={0}
              isInView={isInView}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <a
          href="https://www.robomaster.com/zh-CN"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-rm-blue/80 hover:text-rm-blue border-b border-rm-blue/30 hover:border-rm-blue pb-1 transition-colors group"
        >
          了解 RoboMaster 赛事技术体系
          <span className="group-hover:translate-x-1 transition-transform">↗</span>
        </a>
      </motion.div>
    </section>
  );
}
