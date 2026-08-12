"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const phases = [
  {
    year: "大一上",
    title: "入门 · 点亮第一个 LED",
    color: "from-rm-blue/20 to-rm-blue/5",
    borderColor: "border-rm-blue/40",
    glowColor: "shadow-rm-blue/10",
    skills: [
      "C 语言基础",
      "STM32 GPIO 控制",
      "串口通信 UART",
      "点亮 LED / 蜂鸣器",
      "搭建开发环境",
    ],
  },
  {
    year: "大一下",
    title: "进阶 · 让电机转起来",
    color: "from-rm-blue/30 to-rm-red/5",
    borderColor: "border-rm-blue/50",
    glowColor: "shadow-rm-blue/20",
    skills: [
      "CAN 总线通信",
      "PID 控制算法",
      "FreeRTOS 入门",
      "电机驱动与控制",
      "机器人模块拆解",
    ],
  },
  {
    year: "大二上",
    title: "实战 · 独立负责模块",
    color: "from-rm-red/20 to-rm-blue/5",
    borderColor: "border-rm-red/40",
    glowColor: "shadow-rm-red/10",
    skills: [
      "自主开发子系统",
      "IMU 姿态解算",
      "OpenCV 图像处理",
      "YOLO 目标检测",
      "参与实际比赛",
    ],
  },
  {
    year: "大二下",
    title: "领航 · 带队 & 带新人",
    color: "from-rm-red/30 to-rm-blue/10",
    borderColor: "border-rm-red/50",
    glowColor: "shadow-rm-red/20",
    skills: [
      "担任技术负责人",
      "指导新人培训",
      "系统架构设计",
      "自主决策探索",
      "RoboMaster 核心",
    ],
  },
];

export default function TrainingPath() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activePhase, setActivePhase] = useState<number | null>(null);

  return (
    <section id="training" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-rm-blue/5 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Growth</span>{" "}
            <span className="text-rm-blue">Path</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            新人培养路线
          </h2>
          <p className="mt-4 text-rm-gray text-sm">
            从零开始，一步步成长为机器人工程师
          </p>
          <p className="text-rm-gray/60 text-xs mt-2">
            不会没关系，我们教
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.year}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              onMouseEnter={() => setActivePhase(index)}
              onMouseLeave={() => setActivePhase(null)}
              className={`relative p-5 rounded-xl border ${phase.borderColor} bg-gradient-to-b ${phase.color} backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                activePhase === index
                  ? `scale-105 shadow-xl ${phase.glowColor}`
                  : "hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black ${
                  index < 2 ? "bg-rm-blue/20 text-rm-blue" : "bg-rm-red/20 text-rm-red"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs font-mono text-rm-gray tracking-wider">
                    {phase.year}
                  </p>
                  <p className="text-sm font-bold text-white">
                    {phase.title}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {phase.skills.map((skill, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                      activePhase === index
                        ? "text-white translate-x-1"
                        : "text-rm-gray"
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <span className={`w-1 h-1 rounded-full transition-colors ${
                      activePhase === index
                        ? index < 2 ? "bg-rm-blue" : "bg-rm-red"
                        : "bg-rm-gray/40"
                    }`} />
                    {skill}
                  </li>
                ))}
              </ul>

              {/* 箭头连接 */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-rm-gray/40 text-xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
