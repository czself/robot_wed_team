"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { trainingTracks } from "@/data/tech-star";

export default function TrainingPath() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activePhase, setActivePhase] = useState<string | null>(null);

  return (
    <section id="training" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-rm-blue/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
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
            机械设计制造与电控研发各有完整路线，从零开始也能找到自己的方向
          </p>
          <p className="text-rm-gray/60 text-xs mt-2">
            不会没关系，我们教
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trainingTracks.map((track, trackIndex) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + trackIndex * 0.15, duration: 0.6 }}
              className={`relative p-5 md:p-6 rounded-2xl border ${track.borderColor} ${track.bgColor} backdrop-blur-sm`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl border ${track.borderColor} bg-black/20 flex items-center justify-center text-2xl`}>
                  {track.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-black ${track.color}`}>{track.name}</h3>
                  <p className="text-xs text-rm-gray/60 tracking-wider uppercase">{track.nameEn}</p>
                </div>
              </div>

              <p className="text-sm text-rm-gray leading-relaxed mb-6">{track.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {track.stages.map((stage, stageIndex) => {
                  const phaseId = `${track.id}-${stage.level}`;
                  const isActive = activePhase === phaseId;

                  return (
                    <div
                      key={stage.level}
                      onMouseEnter={() => setActivePhase(phaseId)}
                      onMouseLeave={() => setActivePhase(null)}
                      className={`relative p-4 rounded-xl border border-white/10 bg-black/20 transition-all duration-300 ${
                        isActive ? "-translate-y-1 border-white/25 shadow-xl" : "hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-sm font-black ${track.bgColor} ${track.color}`}>
                          {stageIndex + 1}
                        </div>
                        <div>
                          <p className="text-xs font-mono text-rm-gray/60">{stage.period}</p>
                          <p className="text-sm font-bold text-white">{stage.title}</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {stage.items.map((item) => (
                          <li
                            key={item}
                            className={`flex items-start gap-2 text-xs transition-colors ${isActive ? "text-white" : "text-rm-gray"}`}
                          >
                            <span className={`mt-1.5 w-1 h-1 shrink-0 rounded-full ${track.dotColor}`} />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {stageIndex % 2 === 0 && stageIndex < track.stages.length - 1 && (
                        <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-rm-gray/30 text-lg">
                          →
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
