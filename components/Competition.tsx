"use client";

import { useEffect, useRef, useState } from "react";
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

const levelMedal = {
  national: "🥇",
  provincial: "🥈",
  regional: "🥉",
};

export default function Competition() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [certificate, setCertificate] = useState<Award | null>(null);

  useEffect(() => {
    if (!certificate) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCertificate(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [certificate]);

  return (
    <section id="competition" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-30" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-rm-red/10 blur-[140px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-rm-blue/10 blur-[140px] pointer-events-none" aria-hidden />

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
          <div className="mt-6 flex items-center justify-center gap-3 text-rm-gray/60 text-xs font-mono tracking-widest">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-red/50 to-transparent" />
            <span className="animate-tick">HONOR · GLORY</span>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-blue/50 to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-rm-red/60 via-rm-blue/40 to-transparent" />

            <div className="space-y-10">
              {timeline.map((year, yearIndex) => (
                <motion.div
                  key={year.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + yearIndex * 0.15, duration: 0.6 }}
                  className="relative pl-14"
                >
                  <div className={`absolute left-0 top-0 w-10 h-10 rounded-full bg-rm-dark border-2 flex items-center justify-center shadow-lg ${
                    yearIndex % 2 === 0
                      ? "border-rm-red shadow-rm-red/20"
                      : "border-rm-blue shadow-rm-blue/20"
                  }`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${yearIndex % 2 === 0 ? "bg-rm-red" : "bg-rm-blue"} animate-tick`} />
                  </div>

                  <div className="flex items-baseline gap-3 mb-3">
                    <div className={`text-3xl font-black bg-gradient-to-r ${yearIndex % 2 === 0 ? "from-rm-red to-rm-red/50" : "from-rm-blue to-rm-blue/50"} bg-clip-text text-transparent`}>
                      {year.year}
                    </div>
                    <span className="text-[10px] tracking-[0.3em] text-rm-gray/50 font-mono uppercase">
                      Chapter {String(yearIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {year.events.map((event, eventIndex) => (
                      <motion.div
                        key={eventIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + yearIndex * 0.15 + eventIndex * 0.08 }}
                        className="flex items-start gap-3 text-rm-gray group/event"
                      >
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          eventIndex % 2 === 0 ? "bg-rm-red/60" : "bg-rm-blue/60"
                        } group-hover/event:scale-150 transition-transform`} />
                        <span className="text-sm group-hover/event:text-white transition-colors">{event}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {awards.map((award, index) => (
              <motion.div
                key={`${award.year}-${award.title}-${index}`}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.12, duration: 0.6 }}
                className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] card-hover hover:border-white/15"
              >
                <div className="absolute top-3 left-3 z-10 text-[10px] font-mono text-white/30 tracking-wider">
                  #{String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex flex-col sm:flex-row">
                  {award.certificate && (
                    <button
                      onClick={() => setCertificate(award)}
                      aria-label={`查看奖状大图 · ${award.title}`}
                      className="relative sm:w-44 shrink-0 aspect-[3/4] sm:aspect-auto overflow-hidden bg-rm-dark border-b sm:border-b-0 sm:border-r border-white/5 group/cert"
                    >
                      <Image
                        src={award.certificate}
                        alt={`${award.title} 奖状`}
                        fill
                        className="object-cover group-hover/cert:scale-110 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, 176px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 sm:bg-gradient-to-r" />
                      <div className="absolute left-2 top-2 w-5 h-5 border-l border-t border-rm-red/70" />
                      <div className="absolute right-2 bottom-2 w-5 h-5 border-r border-b border-rm-blue/70" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cert:opacity-100 transition-opacity">
                        <span className="px-3 py-1.5 rounded-full glass text-[10px] text-white font-mono tracking-wider">
                          查看大图 ↗
                        </span>
                      </div>
                    </button>
                  )}
                  <div className="relative flex-1 p-5 pl-12 sm:pl-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tracking-wider text-white/40">
                        {award.year}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${levelColors[award.level]}`}
                      >
                        <span className="text-xs">{levelMedal[award.level]}</span>
                        {levelLabels[award.level]}
                      </span>
                    </div>

                    <h4 className="text-xl md:text-2xl font-black mb-1.5 text-white flex items-center gap-2">
                      {award.title}
                    </h4>
                    <p className="text-sm text-rm-gray mb-4">{award.event}</p>

                    <div className="h-px w-full bg-gradient-to-r from-rm-red/30 via-rm-blue/30 to-transparent mb-4" />

                    <a
                      href="https://www.robomaster.com/zh-CN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-rm-blue/80 hover:text-rm-blue font-mono transition-colors group/link"
                    >
                      RoboMaster 官网
                      <span className="group-hover/link:translate-x-0.5 transition-transform">↗</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="pt-2 flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] text-rm-gray/40 font-mono uppercase"
            >
              <span className="w-8 h-px bg-rm-red/40" />
              2 Awards · National Level
              <span className="w-8 h-px bg-rm-blue/40" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {certificate && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${certificate.title} 奖状大图`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative max-w-2xl w-full max-h-[90vh] rounded-2xl overflow-hidden border border-white/15 shadow-[0_30px_120px_-20px_rgba(217,4,41,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute left-3 top-3 w-7 h-7 border-l-2 border-t-2 border-rm-red z-20" />
              <div className="absolute right-3 top-3 w-7 h-7 border-r-2 border-t-2 border-rm-blue z-20" />
              <div className="absolute left-3 bottom-3 w-7 h-7 border-l-2 border-b-2 border-rm-blue z-20" />
              <div className="absolute right-3 bottom-3 w-7 h-7 border-r-2 border-b-2 border-rm-red z-20" />

              <Image
                src={certificate.certificate!}
                alt={`${certificate.title} 奖状`}
                width={1200}
                height={1600}
                className="w-full h-auto object-contain max-h-[90vh]"
              />

              <div className="absolute top-5 right-5 z-20">
                <button
                  onClick={() => setCertificate(null)}
                  aria-label="关闭"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/85 to-transparent">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.4em] mb-2 font-mono uppercase flex items-center gap-2">
                      <span className="text-rm-red">{certificate.year}</span>
                      <span className="text-white/30">·</span>
                      <span className="text-rm-blue">{levelLabels[certificate.level]}</span>
                    </p>
                    <p className="text-white font-black text-2xl mb-1 flex items-center gap-2">
                      <span>{levelMedal[certificate.level]}</span>
                      {certificate.title}
                    </p>
                    <p className="text-sm text-rm-gray">{certificate.event}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] tracking-[0.3em] text-white/40 font-mono uppercase mb-1">YZ Control</p>
                    <p className="text-xs text-white/60 font-mono">CERTIFICATE</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
