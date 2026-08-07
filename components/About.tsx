"use client";

import { useRef } from "react";
import Image from "next/image";
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
      <div
        className="absolute top-1/2 -right-40 w-[28rem] h-[28rem] rounded-full bg-rm-red/10 blur-[140px] pointer-events-none"
        aria-hidden
      />

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative aspect-square max-w-sm mx-auto w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgba(217,4,41,0.5)] group"
          >
            <Image
              src="/images/gallery/gallery-17.jpg"
              alt="YZ Control 战队"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 80vw, 30vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute left-4 top-4 w-8 h-8 border-l border-t border-rm-red/70" />
            <div className="absolute right-4 bottom-4 w-8 h-8 border-r border-b border-rm-blue/70" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[10px] tracking-[0.4em] text-rm-blue/80 font-mono uppercase mb-1">
                Est. 2025
              </p>
              <p className="text-white font-black text-xl tracking-wider">
                YZ CONTROL
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.12, duration: 0.6 }}
                className="relative text-left p-6 md:p-7 rounded-2xl border border-white/5 bg-white/[0.02] card-hover overflow-hidden group"
              >
                <div
                  className={`absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity ${
                    index % 2 === 0 ? "bg-rm-red" : "bg-rm-blue"
                  }`}
                />
                <div className="relative">
                  <div
                    className={`text-4xl md:text-5xl font-black mb-2 ${
                      index % 2 === 0 ? "text-rm-red" : "text-rm-blue"
                    }`}
                  >
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
                </div>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-rm-red to-rm-blue" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 max-w-3xl mx-auto text-center"
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