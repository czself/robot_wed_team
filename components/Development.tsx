"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { label: "Idea", labelCn: "创意", icon: "💡" },
  { label: "CAD", labelCn: "建模", icon: "📐" },
  { label: "PCB", labelCn: "电路", icon: "🔌" },
  { label: "Solder", labelCn: "焊接", icon: "🔥" },
  { label: "Code", labelCn: "编码", icon: "⌨️" },
  { label: "PID Tuning", labelCn: "调参", icon: "🔧" },
  { label: "3v3 Battle", labelCn: "比赛", icon: "🏆" },
];

export default function Development() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] text-rm-red uppercase mb-4">
            Development
          </p>
          <h2 className="text-4xl md:text-6xl font-black">
            研发流程
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rm-red/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.12, duration: 0.6 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-rm-red/30 bg-rm-dark flex items-center justify-center text-2xl md:text-3xl mb-4 relative z-10 hover:border-rm-red hover:shadow-[0_0_20px_rgba(217,4,41,0.3)] transition-all duration-300">
                  {step.icon}
                </div>
                <p className="font-bold text-sm md:text-base mb-1">
                  {step.label}
                </p>
                <p className="text-rm-gray text-xs">{step.labelCn}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 md:top-12 -right-2 text-rm-red/40 text-lg">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-rm-gray text-lg max-w-2xl mx-auto leading-relaxed">
            从一个想法到赛场上的钢铁战士，每一步都凝聚着团队的智慧与汗水。
            我们不只是造机器人，更是在创造未来。
          </p>
        </motion.div>
      </div>
    </section>
  );
}