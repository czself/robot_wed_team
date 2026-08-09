"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { starFields, trainingLevels, type StarField } from "@/data/tech-star";

function TechDetail({ field, onBack }: { field: StarField; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-rm-gray hover:text-white transition-colors"
      >
        <span>←</span> 返回星图
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-2xl border ${field.borderColor} ${field.bgColor} flex items-center justify-center text-3xl`}>
          {field.icon}
        </div>
        <div>
          <h2 className={`text-2xl font-black ${field.color}`}>{field.name}</h2>
          <p className="text-xs text-rm-gray tracking-wider uppercase">{field.nameEn}</p>
        </div>
      </div>

      <p className="text-rm-gray mb-8 leading-relaxed">{field.description}</p>

      <div className="space-y-6">
        {field.tree.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`p-5 rounded-xl border ${field.borderColor}/30 ${field.bgColor} hover:border-opacity-60 transition-all`}
          >
            <h3 className="text-base font-bold text-white mb-3">{node.label}</h3>

            {node.items && (
              <div className="flex flex-wrap gap-2 mb-2">
                {node.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-xs text-rm-gray"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {node.desc && (
              <p className="text-xs text-rm-gray/60 mt-2">{node.desc}</p>
            )}

            {node.children && (
              <div className="mt-3 space-y-3">
                {node.children.map((child) => (
                  <div key={child.id}>
                    <p className="text-xs font-bold text-rm-gray/70 mb-1.5">{child.label}</p>
                    {child.items && (
                      <div className="flex flex-wrap gap-1.5">
                        {child.items.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-0.5 rounded-md border border-white/5 bg-white/[0.02] text-[11px] text-rm-gray/70"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    {child.desc && (
                      <p className="text-[11px] text-rm-gray/50 mt-1">{child.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TechStarMap() {
  const [activeField, setActiveField] = useState<StarField | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBack = useCallback(() => setActiveField(null), []);

  return (
    <section className="relative min-h-screen py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />

      {/* 轨道环 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative" ref={containerRef}>
        <AnimatePresence mode="wait">
          {activeField ? (
            <TechDetail key="detail" field={activeField} onBack={handleBack} />
          ) : (
            <motion.div
              key="starmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 标题 */}
              <div className="text-center mb-16">
                <p className="text-sm tracking-[0.3em] uppercase mb-4">
                  <span className="text-rm-red">Tech</span>{" "}
                  <span className="text-rm-blue">Star Map</span>
                </p>
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
                  技术星图
                </h1>
                <p className="mt-4 text-rm-gray text-sm max-w-lg mx-auto">
                  点击星球，探索YZ Control的完整技术体系
                </p>
              </div>

              {/* 星球网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                {starFields.map((field, index) => (
                  <motion.button
                    key={field.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => setActiveField(field)}
                    className={`group relative p-6 rounded-2xl border ${field.borderColor} ${field.bgColor} backdrop-blur-sm text-left hover:scale-105 transition-all duration-300 cursor-pointer ${field.glowColor} hover:shadow-lg`}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {field.icon}
                    </div>
                    <h3 className={`text-lg font-bold ${field.color} mb-1`}>
                      {field.name}
                    </h3>
                    <p className="text-xs text-rm-gray tracking-wider uppercase mb-2">
                      {field.nameEn}
                    </p>
                    <p className="text-xs text-rm-gray/60 leading-relaxed">
                      {field.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-rm-gray/40 group-hover:text-rm-gray/60 transition-colors">
                      <span>点击探索</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* 新人成长路线 */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <p className="text-sm tracking-[0.3em] uppercase mb-3">
                    <span className="text-rm-blue">Growth</span>{" "}
                    <span className="text-rm-red">Path</span>
                  </p>
                  <h2 className="text-3xl font-black text-white">
                    新人成长路线 🌱
                  </h2>
                  <p className="mt-2 text-rm-gray text-sm">
                    从零开始，一步步成为机器人工程师
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trainingLevels.map((level, index) => (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
                      className={`p-4 rounded-xl border ${level.color} backdrop-blur-sm`}
                    >
                      <div className="text-xs font-mono text-rm-gray/50 mb-2">
                        {level.level}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-3">
                        {level.title}
                      </h4>
                      <ul className="space-y-1.5">
                        {level.items.map((item) => (
                          <li
                            key={item}
                            className="text-xs text-rm-gray/70 flex items-start gap-1.5"
                          >
                            <span className="text-rm-gray/30 mt-0.5">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}