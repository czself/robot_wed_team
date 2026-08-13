"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { teamGroups } from "@/data/members";

export default function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="team" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-radial-blue opacity-50" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Our</span>{" "}
            <span className="text-rm-blue">Team</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            两大技术方向
          </h1>
        </motion.div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {teamGroups.map((group, index) => (
            <motion.article
              key={group.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
              className={`p-6 rounded-xl border bg-white/[0.02] transition-all duration-300 hud-corner ${
                expandedId === group.id
                  ? index % 2 === 0
                    ? "border-rm-red/50 shadow-[0_0_30px_rgba(217,4,41,0.15)]"
                    : "border-rm-blue/50 shadow-[0_0_30px_rgba(0,200,255,0.15)]"
                  : "border-white/5 hover:border-rm-red/30 hover:shadow-[0_0_20px_rgba(217,4,41,0.1)]"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{group.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{group.name}</h3>
                  <p className="text-xs text-rm-gray tracking-wider uppercase">
                    {group.nameEn}
                  </p>
                </div>
              </div>

              <p className="text-rm-gray text-sm leading-relaxed mb-4">
                {group.description}
              </p>

              <div id={`team-skills-${group.id}`}>
                <AnimatePresence>
                  {expandedId === group.id && (
                    <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      {group.skills.map((skill, si) => (
                        <span
                          key={skill}
                          className={`px-3 py-1 text-xs rounded-full border ${
                            si % 2 === 0
                              ? "bg-rm-red/10 text-rm-red border-rm-red/20"
                              : "bg-rm-blue/10 text-rm-blue border-rm-blue/20"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  type="button"
                  aria-expanded={expandedId === group.id}
                  aria-controls={`team-skills-${group.id}`}
                  onClick={() =>
                    setExpandedId(expandedId === group.id ? null : group.id)
                  }
                  className="text-rm-gray hover:text-white flex items-center gap-1 transition-colors"
                >
                  <motion.span
                    animate={{ rotate: expandedId === group.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.span>
                  {expandedId === group.id ? "收起" : "展开技能树"}
                </button>
                <a
                  href="/recruit"
                  className="text-rm-red/80 hover:text-rm-red transition-colors"
                >
                  加入 →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
