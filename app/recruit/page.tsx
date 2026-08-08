import Navbar from "@/components/Navbar";
import RecruitForm from "@/components/RecruitForm";
import Footer from "@/components/Footer";

export const metadata = {
  title: "招新报名 · YZ Control | RoboMaster 2026",
  description:
    "加入 YZ Control 战队 — 机械、嵌入式、视觉、算法、运营组别火热招新中。",
};

export const dynamic = "force-dynamic";

export default function RecruitPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-rm-red/10 blur-[140px] pointer-events-none" aria-hidden />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-rm-blue/10 blur-[140px] pointer-events-none" aria-hidden />

        <div className="relative">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-sm tracking-[0.3em] uppercase mb-4">
              <span className="text-rm-red">Join</span>{" "}
              <span className="text-rm-blue">Us</span>
            </p>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
              战队招新
            </h1>
            <p className="mt-5 text-rm-gray text-sm max-w-xl mx-auto">
              填写下方表单报名，加入 YZ Control 与我们一起征战 RoboMaster
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-rm-gray/60 text-xs font-mono tracking-widest">
              <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-red/50 to-transparent" />
              <span className="animate-tick">RECRUIT 2026</span>
              <span className="h-px w-12 bg-gradient-to-r from-transparent via-rm-blue/50 to-transparent" />
            </div>
          </div>

          <RecruitForm />
        </div>
      </main>
      <Footer />
    </>
  );
}