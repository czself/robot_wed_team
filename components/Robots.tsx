"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { robots } from "@/data/robots";

export default function Robots() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRobot = robots[activeIndex];

  return (
    <section id="robots" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] text-rm-red uppercase mb-4">
            Our Robots
          </p>
          <h2 className="text-4xl md:text-6xl font-black">
            钢铁战士
          </h2>
        </motion.div>

        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {robots.map((robot, index) => (
            <motion.button
              key={robot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => setActiveIndex(index)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeIndex === index
                  ? "bg-rm-red text-white shadow-[0_0_20px_rgba(217,4,41,0.3)]"
                  : "bg-white/5 text-rm-gray hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {robot.name}
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
            <div className="relative aspect-square max-h-[500px] rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden flex items-center justify-center">
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
              <div className="absolute top-4 left-4 text-xs text-rm-blue/50 font-mono hud-corner px-2 py-1">
                {activeRobot.id.toUpperCase()}_UNIT
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-rm-blue/50 font-mono">
                STATUS: OPERATIONAL
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-black mb-2">
                {activeRobot.name}
              </h3>
              <p className="text-rm-red text-sm tracking-wider mb-6">
                {activeRobot.nameCn}
              </p>
              <p className="text-rm-gray text-lg leading-relaxed mb-8">
                {activeRobot.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {activeRobot.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-4 rounded-lg border border-white/5 bg-white/[0.02]"
                  >
                    <p className="text-xs text-rm-gray mb-1">{spec.label}</p>
                    <p className="text-xl font-bold text-white">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeRobot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs bg-rm-blue/10 text-rm-blue rounded-full border border-rm-blue/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}