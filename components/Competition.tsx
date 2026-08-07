"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { timeline, awards } from "@/data/awards";

const levelColors = {
  national: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  provincial: "border-rm-red/50 text-rm-red bg-rm-red/10",
  regional: "border-rm-blue/50 text-rm-blue bg-rm-blue/10",
};

const levelLabels = {
  national: "国家级",
  provincial: "省级",
  regional: "区域级",
};

export default function Competition() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="competition" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-30" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] text-rm-red uppercase mb-4">
            Competition
          </p>
          <h2 className="text-4xl md:text-6xl font-black">
            赛场荣耀
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-rm-red/50 via-rm-blue/30 to-transparent" />

            <div className="space-y-12">
              {timeline.map((year, yearIndex) => (
                <motion.div
                  key={year.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + yearIndex * 0.15, duration: 0.6 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-rm-dark border-2 border-rm-red flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rm-red" />
                  </div>

                  <div className="text-2xl font-black text-gradient-red mb-3">
                    {year.year}
                  </div>

                  <div className="space-y-2">
                    {year.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="flex items-center gap-3 text-rm-gray"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-rm-blue/50" />
                        <span className="text-sm">{event}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {awards.map((award, index) => (
              <motion.a
                key={`${award.year}-${award.title}`}
                href="https://www.robomaster.com/zh-CN"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="group relative p-0 rounded-2xl overflow-hidden border bg-white/[0.02] card-hover block"
              >
                <div className="absolute inset-0">
                  <Image
                    src="/images/gallery/gallery-07.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/60" />
                </div>
                <div className={`relative p-5 ${levelColors[award.level]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono tracking-wider opacity-60">
                      {award.year}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        levelColors[award.level]
                      }`}
                    >
                      {levelLabels[award.level]}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1 text-white">
                    {award.title}
                  </h4>
                  <p className="text-sm text-rm-gray">{award.event}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-rm-blue/80 font-mono">
                    RoboMaster 官网 <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}