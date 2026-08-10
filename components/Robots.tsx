"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { robots } from "@/data/robots";

export default function Robots() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const activeRobot = robots[activeIndex];
  const images = useMemo(() => activeRobot.images ?? [], [activeRobot]);
  const hasImages = images.length > 0;

  const handleSelectRobot = (index: number) => {
    setActiveIndex(index);
    setImageIndex(0);
  };

  const handlePrev = () =>
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () =>
    setImageIndex((prev) => (prev + 1) % images.length);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images]);

  const unitCode = String(activeIndex + 1).padStart(2, "0");

  return (
    <section id="robots" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-radial-glow opacity-40" />

      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-rm-red/10 blur-[120px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-rm-blue/10 blur-[120px] pointer-events-none"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Our</span>{" "}
            <span className="text-rm-blue">Robots</span>
          </p>
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            钢铁战士
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3 text-rm-gray/60 text-xs font-mono tracking-widest">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-red/50 to-transparent" />
            <span className="animate-tick">READY FOR COMBAT</span>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-blue/50 to-transparent" />
          </div>
        </motion.div>

        <div className="flex gap-3 justify-center mb-14 flex-wrap">
          {robots.map((robot, index) => (
            <motion.button
              key={robot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => handleSelectRobot(index)}
              className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden ${
                activeIndex === index
                  ? index % 2 === 0
                    ? "bg-rm-red text-white shadow-[0_0_24px_rgba(217,4,41,0.4)]"
                    : "bg-rm-blue text-white shadow-[0_0_24px_rgba(0,200,255,0.4)]"
                  : "bg-white/5 text-rm-gray hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {activeIndex === index && (
                <motion.span
                  layoutId="robot-tab-glow"
                  className="absolute inset-0 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span
                  className={`font-mono text-[10px] opacity-70 ${
                    activeIndex === index
                      ? "text-white"
                      : index % 2 === 0
                      ? "text-rm-red/70"
                      : "text-rm-blue/70"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {robot.name}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRobot.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="relative scan-frame rounded-3xl overflow-hidden lg:order-2">
              <div className="relative aspect-[4/5] sm:aspect-square max-h-[560px] rounded-3xl bg-white/[0.02] overflow-hidden flex items-center justify-center shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] p-[1px]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rm-red/40 via-white/10 to-rm-blue/40 opacity-60" />

                <div className="relative w-full h-full rounded-[calc(1.5rem-1px)] overflow-hidden bg-gradient-to-br from-white/12 via-[#131722] to-rm-blue/10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  {hasImages && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeRobot.id}-${imageIndex}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={images[imageIndex]}
                          alt={`${activeRobot.nameCn} 实拍 ${imageIndex + 1}`}
                          fill
                          className="object-contain p-6"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {!hasImages && (
                    <>
                      <div className="absolute inset-0 bg-radial-glow opacity-50" />
                      <div className="relative text-center">
                        <div className="text-8xl md:text-9xl font-black text-rm-red/10">
                          {activeRobot.name[0]}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-rm-red/20 flex items-center justify-center animate-float">
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border border-rm-red/10 flex items-center justify-center">
                              <span className="text-4xl md:text-5xl font-black text-gradient-red">
                                {activeRobot.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/15 pointer-events-none" />

                  {hasImages && images.length > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] z-30 bg-white/5">
                      <div
                        key={`${activeRobot.id}-${imageIndex}`}
                        className="h-full origin-left bg-gradient-to-r from-rm-red via-white to-rm-blue"
                        style={{
                          animation: "carousel-progress 3.5s linear forwards",
                        }}
                      />
                    </div>
                  )}

                  <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rm-red shadow-[0_0_8px_rgba(217,4,41,0.9)] animate-tick" />
                    <span className="text-[10px] text-rm-red/90 font-mono tracking-wider px-2 py-1 glass rounded">
                      {activeRobot.id.toUpperCase()}_UNIT
                    </span>
                  </div>
                  <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
                    <span className="text-[10px] text-rm-blue/90 font-mono px-2 py-1 glass rounded">
                      STATUS · OPERATIONAL
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rm-blue shadow-[0_0_8px_rgba(0,200,255,0.9)] animate-tick" />
                  </div>

                  <div className="absolute left-3 top-3 w-8 h-8 border-l border-t border-rm-red/70 z-20" />
                  <div className="absolute right-3 top-3 w-8 h-8 border-r border-t border-rm-blue/70 z-20" />
                  <div className="absolute left-3 bottom-3 w-8 h-8 border-l border-b border-rm-blue/70 z-20" />
                  <div className="absolute right-3 bottom-3 w-8 h-8 border-r border-b border-rm-red/70 z-20" />

                  <div className="absolute top-1/2 left-2.5 -translate-y-1/2 pointer-events-none z-10">
                    <div className="text-[10px] tracking-[0.5em] text-white/40 font-mono rotate-180 [writing-mode:vertical-rl]">
                      {activeRobot.nameCn} · YZ CONTROL
                    </div>
                  </div>

                  {hasImages && images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        aria-label="上一张"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
                      >
                        ‹
                      </button>
                      <button
                        onClick={handleNext}
                        aria-label="下一张"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {hasImages && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-10 bg-gradient-to-t from-black/85 to-transparent">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[9px] tracking-[0.3em] text-rm-blue/70 font-mono uppercase mb-1">
                            Live Feed · {String(imageIndex + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
                          </p>
                          <p className="text-white font-bold text-sm md:text-base truncate">
                            {activeRobot.name} · {activeRobot.nameCn}
                          </p>
                        </div>
                        {images.length > 1 && (
                          <div className="flex gap-1.5 shrink-0">
                            {images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setImageIndex(idx)}
                                aria-label={`查看第 ${idx + 1} 张图`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  imageIndex === idx
                                    ? "w-6 bg-rm-red shadow-[0_0_10px_rgba(217,4,41,0.7)]"
                                    : "w-1.5 bg-white/40 hover:bg-white/70"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-rm-gray/60 tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-rm-red/70" />
                  FRAME · {unitCode}/{String(robots.length).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-1.5">
                  FEED · LIVE
                  <span className="w-1 h-1 rounded-full bg-rm-blue/70" />
                </span>
              </div>
            </div>

            <div className="relative lg:order-1">
              <div className="absolute -top-8 -left-2 text-7xl md:text-8xl font-black text-white/[0.03] select-none pointer-events-none">
                {unitCode}
              </div>

              <div className="relative">
                <motion.p
                  key={`en-${activeRobot.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-xs tracking-[0.4em] text-rm-blue/70 font-mono uppercase mb-3"
                >
                  Unit {unitCode} · {activeRobot.id}
                </motion.p>

                <motion.h3
                  key={`name-${activeRobot.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-black mb-2 leading-none"
                >
                  {activeRobot.name}
                </motion.h3>

                <motion.p
                  key={`cn-${activeRobot.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 }}
                  className="text-rm-red text-base tracking-[0.2em] mb-7 flex items-center gap-3"
                >
                  {activeRobot.nameCn}
                  <span className="h-px flex-1 bg-gradient-to-r from-rm-red/40 to-transparent" />
                </motion.p>

                <motion.p
                  key={`desc-${activeRobot.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-rm-gray text-base md:text-lg leading-relaxed mb-8"
                >
                  {activeRobot.description}
                </motion.p>

                <div className="relative mb-8">
                  <p className="text-[10px] tracking-[0.3em] text-rm-gray/60 font-mono uppercase mb-3">
                    Specifications
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {activeRobot.specs.map((spec, i) => (
                      <motion.div
                        key={`${activeRobot.id}-${spec.label}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                        className="relative p-4 rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden group hover:border-rm-red/30 transition-colors duration-300"
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${
                            i % 2 === 0
                              ? "bg-gradient-to-b from-rm-red/60 to-transparent"
                              : "bg-gradient-to-b from-rm-blue/60 to-transparent"
                          }`}
                        />
                        <div
                          className={`absolute right-2 top-2 w-1 h-1 rounded-full ${
                            i % 2 === 0 ? "bg-rm-red/50" : "bg-rm-blue/50"
                          }`}
                        />
                        <p className="text-[11px] text-rm-gray mb-1 tracking-wide">
                          {spec.label}
                        </p>
                        <p className="text-lg font-bold text-white font-mono">
                          {spec.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.3em] text-rm-gray/60 font-mono uppercase mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeRobot.tags.map((tag, i) => (
                      <motion.span
                        key={`${activeRobot.id}-${tag}`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55 + i * 0.05 }}
                        className={`px-3 py-1.5 text-xs rounded-full border hover:-translate-y-0.5 transition-all cursor-default ${
                          i % 2 === 0
                            ? "bg-rm-red/10 text-rm-red border-rm-red/20 hover:bg-rm-red/20"
                            : "bg-rm-blue/10 text-rm-blue border-rm-blue/20 hover:bg-rm-blue/20"
                        }`}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  <motion.a
                    href="https://www.robomaster.com/zh-CN"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 inline-flex items-center gap-2 text-sm text-rm-blue/80 hover:text-rm-blue border-b border-rm-blue/30 hover:border-rm-blue pb-1 transition-colors group/link"
                  >
                    查看赛事规则
                    <span className="group-hover/link:translate-x-1 transition-transform">↗</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
