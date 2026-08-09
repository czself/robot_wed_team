"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { step: "01", title: "在线报名", desc: "填写信息，选择意向方向", icon: "📝" },
  { step: "02", title: "技术交流", desc: "与学长面对面交流，了解团队", icon: "💬" },
  { step: "03", title: "基础考核", desc: "完成入门任务，展示学习能力", icon: "🎯" },
  { step: "04", title: "进入训练营", desc: "系统学习，参与实际项目", icon: "🚀" },
  { step: "05", title: "成为正式队员", desc: "加入战队，征战 RoboMaster", icon: "⚡" },
];

export default function RecruitProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-5xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Recruitment</span>{" "}
            <span className="text-rm-blue">Process</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            招新流程
          </h2>
          <p className="mt-4 text-rm-gray text-sm">
            不用担心不会，每一步我们都会带你走
          </p>
        </motion.div>

        <div className="relative">
          {/* 连接线 */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rm-red/50 via-rm-blue/30 to-rm-red/50" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              className={`flex items-center gap-6 mb-12 md:mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="hidden md:flex flex-1 justify-end" />
              <div className="relative z-10 flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl border-2 border-rm-red/40 bg-rm-red/10 flex items-center justify-center text-rm-red text-2xl font-black shadow-lg shadow-rm-red/10">
                  {item.step}
                </div>
              </div>
              <div className="flex-1 md:max-w-sm">
                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-rm-red/30 hover:bg-rm-red/[0.03] transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-rm-gray text-sm">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href="/recruit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-rm-red hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-[0_0_40px_rgba(217,4,41,0.4)]"
          >
            开始报名 →
          </a>
        </motion.div>
      </div>
    </section>
  );
}