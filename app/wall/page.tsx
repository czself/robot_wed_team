import Navbar from "@/components/Navbar";
import Wall from "@/components/Wall";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export const metadata = {
  title: "留言墙 · YZ Control | RoboMaster 2026",
  description:
    "YZ Control 留言墙 — 给战队留言、点赞、回复，与我们一起书写传奇。",
};

export const dynamic = "force-dynamic";

export default function WallPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-rm-red/10 blur-[140px] pointer-events-none" aria-hidden />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-rm-blue/10 blur-[140px] pointer-events-none" aria-hidden />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-[0.3em] uppercase mb-4">
              <span className="text-rm-red">Message</span>{" "}
              <span className="text-rm-blue">Wall</span>
            </p>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
              留言墙
            </h1>
            <p className="mt-5 text-rm-gray text-sm max-w-xl mx-auto">
              每一条留言都是赛场上并肩的回响 · 点赞最高的评论将顶上来
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-rm-gray/60 text-xs font-mono tracking-widest">
              <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-red/50 to-transparent" />
              <span className="animate-tick">OPEN TO ALL</span>
              <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-blue/50 to-transparent" />
            </div>
          </motion.div>

          <Wall />
        </div>
      </main>
      <Footer />
    </>
  );
}
