"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { teamGroups, recruitmentLinks } from "@/data/members";

export default function Join() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="join" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-5xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Re</span>{" "}
            <span className="text-rm-blue">cruitment</span>
          </p>

          <h2 className="text-5xl md:text-7xl font-black mb-4 text-rm-blue">
            Don&apos;t Watch.
          </h2>
          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-rm-red to-rm-blue bg-clip-text text-transparent">
            Join.
          </h2>

          <p className="text-xl text-rm-gray mb-2">
            不要只是观看。
          </p>
          <p className="text-2xl font-bold">
            成为<span className="bg-gradient-to-r from-rm-red to-rm-blue bg-clip-text text-transparent">创造者</span>。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {teamGroups.map((group, index) => (
            <motion.a
              key={group.id}
              href={recruitmentLinks[group.id]}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center card-hover group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {group.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{group.name}</h3>
              <p className="text-xs text-rm-gray tracking-wider uppercase mb-3">
                {group.nameEn}
              </p>
              <p className="text-sm text-rm-gray leading-relaxed mb-4">
                {group.description}
              </p>
              <div className="inline-flex items-center gap-2 text-rm-red text-sm font-medium group-hover:gap-3 transition-all">
                加入 <span>→</span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <a
            href="/recruit"
            className="inline-block px-12 py-5 bg-rm-red hover:bg-red-700 text-white text-lg font-bold rounded-lg transition-all hover:shadow-[0_0_40px_rgba(217,4,41,0.4)] animate-glow-pulse"
          >
            加入我们 →
          </a>

          <div className="mt-10 inline-flex flex-col items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 card-hover">
            <Image
              src="/images/qq-group-qr.jpg"
              alt="YZ Control QQ 群二维码"
              width={144}
              height={144}
              className="w-36 h-36 rounded-lg border border-white/10 bg-white p-2"
            />
            <p className="text-sm text-rm-gray">
              QQ群：
              <span className="text-white font-bold tracking-wider">
                484851368
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}