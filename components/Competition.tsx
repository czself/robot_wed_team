"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { timeline, awards, type Award } from "@/data/awards";

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
  const [certificate, setCertificate] = useState<Award | null>(null);

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
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Compe</span>{" "}
            <span className="text-rm-blue">tition</span>
          </p>
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            赛场荣耀
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-rm-red/60 via-rm-blue/40 to-transparent" />

            <div className="space-y-12">
              {timeline.map((year, yearIndex) => (
                <motion.div
                  key={year.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + yearIndex * 0.15, duration: 0.6 }}
                  className="relative pl-12"
                >
                  <div className={`absolute left-0 top-0 w-8 h-8 rounded-full bg-rm-dark border-2 flex items-center justify-center ${
                    yearIndex % 2 === 0 ? "border-rm-red" : "border-rm-blue"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${yearIndex % 2 === 0 ? "bg-rm-red" : "bg-rm-blue"}`} />
                  </div>

                  <div className={`text-2xl font-black mb-3 bg-gradient-to-r ${yearIndex % 2 === 0 ? "from-rm-red to-rm-red/60" : "from-rm-blue to-rm-blue/60"} bg-clip-text text-transparent`}>
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
              <motion.div
                key={`${award.year}-${award.title}`}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="group relative p-0 rounded-2xl overflow-hidden border bg-white/[0.02] card-hover"
              >
                <div className="flex flex-col sm:flex-row">
                  {award.certificate && (
                    <button
                      onClick={() => setCertificate(award)}
                      aria-label={`查看奖状大图 · ${award.title}`}
                      className="relative sm:w-40 shrink-0 aspect-[3/4] sm:aspect-auto overflow-hidden bg-rm-dark border-b sm:border-b-0 sm:border-r border-white/5 hover:z-10"
                    >
                      <Image
                        src={award.certificate}
                        alt={`${award.title} 奖状`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, 160px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
                      <span className="absolute bottom-2 left-2 right-2 text-[10px] text-white/80 font-mono tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        点击放大 ↗
                      </span>
                    </button>
                  )}
                  <div className={`relative flex-1 p-5 ${levelColors[award.level]}`}>
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
                    <a
                      href="https://www.robomaster.com/zh-CN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-[11px] text-rm-blue/80 hover:text-rm-blue font-mono transition-colors"
                    >
                      RoboMaster 官网 <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {certificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-w-2xl w-full max-h-[88vh] rounded-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={certificate.certificate!}
                alt={`${certificate.title} 奖状`}
                width={1200}
                height={1600}
                className="w-full h-auto object-contain max-h-[88vh]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 to-transparent">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-rm-blue/80 font-mono uppercase mb-1">
                      {certificate.year} · {levelLabels[certificate.level]}
                    </p>
                    <p className="text-white font-bold text-lg">
                      {certificate.title}
                    </p>
                    <p className="text-sm text-rm-gray">{certificate.event}</p>
                  </div>
                  <button
                    onClick={() => setCertificate(null)}
                    aria-label="关闭"
                    className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}