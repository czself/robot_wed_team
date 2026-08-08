"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";

const galleryItems = [
  { id: 1, src: "/images/gallery/gallery-01.jpg", label: "三机合影" },
  { id: 2, src: "/images/gallery/gallery-02.jpg", label: "3v3 对抗赛" },
  { id: 3, src: "/images/gallery/gallery-03.jpg", label: "赛场观战" },
  { id: 4, src: "/images/gallery/gallery-04.jpg", label: "赛场实况" },
  { id: 5, src: "/images/gallery/gallery-05.jpg", label: "三机协同" },
  { id: 6, src: "/images/gallery/gallery-06.jpg", label: "颁奖合影" },
  { id: 7, src: "/images/gallery/gallery-07.jpg", label: "国赛领奖" },
  { id: 8, src: "/images/gallery/gallery-08.jpg", label: "对抗瞬间" },
  { id: 9, src: "/images/gallery/gallery-09.jpg", label: "哨兵特写" },
  { id: 10, src: "/images/gallery/gallery-10.jpg", label: "国赛大合影" },
  { id: 11, src: "/images/gallery/gallery-11.jpg", label: "遥控操作" },
  { id: 12, src: "/images/gallery/gallery-12.jpg", label: "RM 精神" },
  { id: 13, src: "/images/gallery/gallery-13.jpg", label: "团队时刻" },
  { id: 14, src: "/images/gallery/gallery-14.jpg", label: "热血瞬间" },
  { id: 15, src: "/images/gallery/gallery-15.jpg", label: "队徽" },
  { id: 16, src: "/images/gallery/gallery-16.jpg", label: "IP 形象" },
  { id: 17, src: "/images/gallery/gallery-17.jpg", label: "队徽" },
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<number | null>(null);

  const currentIndex = selected !== null
    ? galleryItems.findIndex((i) => i.id === selected)
    : -1;

  const goNext = useCallback(() => {
    setSelected((prev) => {
      if (prev === null) return null;
      const idx = galleryItems.findIndex((i) => i.id === prev);
      return galleryItems[(idx + 1) % galleryItems.length].id;
    });
  }, []);

  const goPrev = useCallback(() => {
    setSelected((prev) => {
      if (prev === null) return null;
      const idx = galleryItems.findIndex((i) => i.id === prev);
      return galleryItems[(idx - 1 + galleryItems.length) % galleryItems.length].id;
    });
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, goNext, goPrev]);

  return (
    <section id="gallery" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-4">
            <span className="text-rm-red">Gal</span>{" "}
            <span className="text-rm-blue">lery</span>
          </p>
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            光影记录
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.03 + index * 0.04, duration: 0.5 }}
              className={`aspect-square rounded-xl border border-white/5 cursor-pointer overflow-hidden relative group ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onClick={() => setSelected(item.id)}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-xl transition-all active:scale-90"
              aria-label="上一张"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-xl transition-all active:scale-90"
              aria-label="下一张"
            >
              ›
            </button>

            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-w-4xl w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems.find((i) => i.id === selected) && (
                <Image
                  src={galleryItems.find((i) => i.id === selected)!.src}
                  alt={galleryItems.find((i) => i.id === selected)!.label}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              )}

              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white text-sm transition-all z-10"
                aria-label="关闭"
              >
                ✕
              </button>

              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-white text-xs font-mono z-10">
                {currentIndex + 1} / {galleryItems.length}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium">
                  {galleryItems.find((i) => i.id === selected)?.label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}