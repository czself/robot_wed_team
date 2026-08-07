"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const titles = [
  "BUILD THE FUTURE",
  "YZ CONTROL",
  "创造机器人",
  "未来，从这里开始",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * w,
        y: Math.random() * h,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? currentTitle.slice(0, displayText.length - 1)
              : currentTitle.slice(0, displayText.length + 1)
          );
        },
        isDeleting ? 40 : 80
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="absolute inset-0 bg-radial-glow" />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-transparent via-rm-red/30 to-transparent" />
        <div className="absolute top-40 right-20 w-px h-48 bg-gradient-to-b from-transparent via-rm-blue/20 to-transparent" />
        <div className="absolute bottom-40 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-rm-red/20 to-transparent" />
        <div className="absolute bottom-60 right-1/3 w-48 h-px bg-gradient-to-r from-transparent via-rm-blue/15 to-transparent" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-rm-red/30 rounded-full"
            initial={{
              x: p.x,
              y: p.y,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-rm-red/10 border border-rm-red/30 flex items-center justify-center animate-glow-pulse">
            <span className="text-3xl font-black text-rm-red">YZ</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm tracking-[0.3em] text-rm-gray uppercase mb-6"
        >
          YZ Control Robotics
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="text-gradient-red">{displayText}</span>
            <span className="inline-block w-[3px] h-[0.8em] bg-rm-red ml-2 align-middle" style={{ animation: "typing-cursor 1s step-end infinite" }} />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg md:text-xl text-rm-gray mb-12 max-w-2xl mx-auto"
        >
          RoboMaster 2026 · 步兵对抗赛 & 3v3
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#about"
            className="px-8 py-3.5 bg-rm-red hover:bg-red-700 text-white font-medium rounded transition-all hover:shadow-[0_0_30px_rgba(217,4,41,0.4)]"
          >
            探索更多
          </a>
          <a
            href="#join"
            className="px-8 py-3.5 border border-white/20 hover:border-rm-red/50 text-white font-medium rounded transition-all hover:shadow-[0_0_20px_rgba(217,4,41,0.2)]"
          >
            加入我们
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-rm-gray hover:text-white transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border border-rm-gray/50 rounded-full flex justify-center pt-1"
          >
            <div className="w-1 h-2 bg-rm-gray rounded-full" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}