"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const statusItems = [
  { label: "LAST BATTLE", value: "2026.04", state: "上海站", color: "text-rm-blue" },
  { label: "INFANTRY", value: "步兵对抗赛", state: "国二", color: "text-yellow-400" },
  { label: "SQUAD", value: "3v3 对抗赛", state: "国三", color: "text-green-400" },
  { label: "ROBOTS", value: "步兵/工程/哨兵", state: "3台", color: "text-rm-blue" },
  { label: "MEMBERS", value: "YZ Control", state: "Recruiting", color: "text-rm-red" },
];

export default function SystemStatus() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("zh-CN", { hour12: false }) +
          "." +
          String(now.getMilliseconds()).padStart(3, "0")
      );
    };
    update();
    const timer = setInterval(update, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-4xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">System</span>{" "}
            <span className="text-rm-blue">Status</span>
          </p>
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            战队战绩
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative p-6 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-sm overflow-hidden"
        >
          {/* HUD 装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rm-blue/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rm-red/30 to-transparent" />

          {/* 头部 */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              <span className="text-xs font-mono text-green-400 tracking-wider">
                SYS::ONLINE
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-rm-gray/60 tracking-wider">
                YZ-CONTROL
              </span>
              <span className="text-xs font-mono text-rm-blue/70 tracking-wider">
                {time}
              </span>
            </div>
          </div>

          {/* 状态网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statusItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                className={`p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all ${
                  item.state === "Recruiting"
                    ? "hover:border-rm-red/30 hover:bg-rm-red/[0.03]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-rm-gray/50 tracking-wider uppercase">
                    {item.label}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.color} ${
                    item.state === "Recruiting" ? "animate-pulse" : ""
                  }`} />
                </div>
                <div className="text-sm font-mono text-white/90">
                  {item.value}
                </div>
                <div className={`text-[10px] font-mono tracking-wider mt-0.5 ${item.color}`}>
                  [{item.state}]
                </div>
              </motion.div>
            ))}
          </div>

          {/* 底部扫描线 */}
          <div className="mt-6 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-rm-gray/40">
              <span className="w-16 h-px bg-gradient-to-r from-rm-gray/30 to-transparent" />
              <span>LOG: All systems operational</span>
            </div>
          </div>

          <div className="hud-sweep" />
        </motion.div>
      </div>
    </section>
  );
}