"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { value: 20, suffix: "+", label: "队员", href: "/about#team" },
  { value: 1, suffix: "年", label: "建队即国二", href: "/about#competition" },
  { value: 2, suffix: "项", label: "国家级奖项", href: "https://www.robomaster.com/zh-CN", external: true },
  { value: 168, suffix: "MHz", label: "主频", href: "/tech" },
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
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">About</span>{" "}
            <span className="text-rm-blue">Us</span>
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            我们不是在学习机器人
          </h2>
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            我们正在创造机器人
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 items-center mb-20">
          <motion.a
            href="/about"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative aspect-square max-w-sm mx-auto w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgba(217,4,41,0.5)] group block"
          >
            <Image
              src="/images/gallery/gallery-01.jpg"
              alt="YZ Control 战队三机合影"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 80vw, 30vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute left-4 top-4 w-8 h-8 border-l border-t border-rm-red/70" />
            <div className="absolute right-4 bottom-4 w-8 h-8 border-r border-b border-rm-blue/70" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-2">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-rm-blue/80 font-mono uppercase mb-1">
                  Est. 2025
                </p>
                <p className="text-white font-black text-xl tracking-wider">
                  YZ CONTROL
                </p>
              </div>
              <span className="text-[10px] text-white/70 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                了解我们 →
              </span>
            </div>
          </motion.a>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.a
                key={stat.label}
                href={stat.href}
                target={stat.external ? "_blank" : undefined}
                rel={stat.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.12, duration: 0.6 }}
                className="relative text-left p-6 md:p-7 rounded-2xl border border-white/5 bg-white/[0.02] card-hover overflow-hidden group block cursor-pointer"
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
                  <p className="text-rm-gray text-sm tracking-wider uppercase flex items-center gap-1.5">
                    {stat.label}
                    <span className="text-rm-gray/40 group-hover:text-rm-red group-hover:translate-x-0.5 transition-all">
                      {stat.external ? "↗" : "→"}
                    </span>
                  </p>
                </div>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-rm-red to-rm-blue" />
              </motion.a>
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
            机械组负责结构与装配，电控组覆盖嵌入式控制、视觉自瞄与控制算法；我们用代码和钢铁，
            在赛场上书写属于我们的传奇。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
