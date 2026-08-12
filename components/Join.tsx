"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MessageCircle, QrCode } from "lucide-react";
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
          className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent p-5 md:p-7"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rm-red/60 to-rm-blue/60" />
          <div className="absolute -left-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-rm-red/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-36 w-36 rounded-full bg-rm-blue/10 blur-3xl" />

          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="text-left">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-rm-blue">
                Ready to build
              </p>
              <h3 className="text-2xl font-black text-white md:text-3xl">
                提交报名，进入招新群
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-rm-gray">
                先填写报名信息，负责人会根据你的方向联系你；QQ群用于后续通知、答疑和训练安排。
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/recruit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-rm-red px-6 text-sm font-black text-white transition-all hover:bg-red-700 hover:shadow-[0_0_28px_rgba(217,4,41,0.32)]"
                >
                  加入我们
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="inline-flex items-center gap-2 text-sm text-rm-gray">
                  <MessageCircle className="h-4 w-4 text-rm-blue" />
                  <span>QQ群</span>
                  <span className="font-mono text-base font-black tracking-wider text-white">
                    484851368
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-rm-dark/70 p-3 md:min-w-[278px]">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white p-1.5">
                <Image
                  src="/images/qq-group-qr.jpg"
                  alt="YZ Control QQ 群二维码"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 text-left">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rm-blue/30 bg-rm-blue/10 px-2.5 py-1 text-[11px] font-bold text-rm-blue">
                  <QrCode className="h-3.5 w-3.5" />
                  扫码入群
                </div>
                <p className="text-sm font-bold text-white">RoboMaster 招新群</p>
                <p className="mt-1 text-xs leading-5 text-rm-gray">
                  备注姓名和意向组别，方便管理员通过。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
