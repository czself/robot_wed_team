"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { value: 20, suffix: "+", label: "队员" },
  { value: 1, suffix: "年", label: "建队即国二" },
  { value: 2, suffix: "项", label: "国家级奖项" },
  { value: 168, suffix: "MHz", label: "主频" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] text-rm-red uppercase mb-4">
            About Us
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            我们不是在学习机器人
          </h2>
          <h2 className="text-4xl md:text-6xl font-black text-gradient-red">
            我们正在创造机器人
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              className="text-center p-8 rounded-xl border border-white/5 bg-white/[0.02] card-hover hud-corner"
            >
              <div className="text-4xl md:text-5xl font-black text-rm-red mb-2">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  "0"
                )}
              </div>
              <p className="text-rm-gray text-sm tracking-wider uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <p className="text-rm-gray text-lg leading-relaxed">
            YZ Control，2025 年成立，首战即斩获 RoboMaster 步兵对抗赛国二、3v3 国三。
            从机械结构到 STM32 嵌入式，从视觉自瞄到哨兵自主决策，我们用代码和钢铁，
            在赛场上书写属于我们的传奇。
          </p>
        </motion.div>
      </div>
    </section>
  );
}