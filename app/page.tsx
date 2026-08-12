import Hero from "@/components/Hero";
import About from "@/components/About";
import SystemStatus from "@/components/SystemStatus";
import TeamShowcase from "@/components/TeamShowcase";
import Robots from "@/components/Robots";
import WhyJoin from "@/components/WhyJoin";
import RecruitProcess from "@/components/RecruitProcess";
import Join from "@/components/Join";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <SystemStatus />
        <TeamShowcase />
        <Robots />
        <WhyJoin />
        <RecruitProcess />
        <Join />
      </main>
    </>
  );
}
