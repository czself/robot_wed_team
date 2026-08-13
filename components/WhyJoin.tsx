"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const benefits = [
  {
    icon: "🤖",
    title: "从零开发机器人",
    desc: "亲手设计、焊接、编程一台能上场比赛的机器人",
  },
  {
    icon: "🏆",
    title: "全国赛事经历",
    desc: "征战 RoboMaster 高校联盟赛，与全国顶尖战队同台竞技",
  },
  {
    icon: "⚡",
    title: "电控与视觉能力",
    desc: "从 STM32、FreeRTOS、CAN、PID 到 OpenCV、YOLO 自瞄，视觉模块归入电控方向",
  },
  {
    icon: "🔧",
    title: "机械设计与制造",
    desc: "从 CAD 建模、加工装配到可靠性优化，让每一代机器人稳定上场",
  },
  {
    icon: "🧪",
    title: "整车联调实战",
    desc: "从 PCB 和线束到 3D 打印与整车调试，在真实赛场需求中完成闭环",
  },
  {
    icon: "👥",
    title: "一起造东西的人",
    desc: "加入一群热爱技术、乐于分享的队友，一起熬夜调车、一起捧杯",
  },
];

const requirements = [
  "喜欢折腾电脑和硬件的人",
  "喜欢拆东西、想搞懂原理的人",
  "想学习机器人技术的人",
  "愿意投入课余时间的人",
  "对技术有好奇心的人",
];

export default function WhyJoin() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-rm-red/5 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Why</span>{" "}
            <span className="text-rm-blue">Join Us</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            为什么加入我们
          </h2>
          <p className="mt-4 text-rm-gray text-sm max-w-lg mx-auto">
            我们不是招会技术的人，我们培养未来做机器人的人
          </p>
        </motion.div>

        {/* 收益 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-rm-red/20 hover:bg-rm-red/[0.02] transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-rm-gray leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 加入条件 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative p-8 rounded-2xl border border-rm-blue/20 bg-gradient-to-br from-rm-blue/[0.03] to-rm-red/[0.03]"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rm-blue/30 to-transparent" />

          <h3 className="text-xl font-bold text-center mb-6">
            <span className="text-rm-blue">我们欢迎</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {requirements.map((req, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-rm-gray hover:border-rm-blue/30 hover:text-white transition-all"
              >
                {req}
              </span>
            ))}
          </div>

          <p className="text-center text-lg font-bold text-white">
            不会没关系，<span className="bg-gradient-to-r from-rm-red to-rm-blue bg-clip-text text-transparent">我们教</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
