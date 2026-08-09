import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SystemStatus from "@/components/SystemStatus";
import TeamShowcase from "@/components/TeamShowcase";
import WhyJoin from "@/components/WhyJoin";
import RecruitProcess from "@/components/RecruitProcess";
import Join from "@/components/Join";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SystemStatus />
        <TeamShowcase />
        <WhyJoin />
        <RecruitProcess />
        <Join />
      </main>
      <Footer />
    </>
  );
}