import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Robots from "@/components/Robots";
import TechTree from "@/components/TechTree";
import TrainingPath from "@/components/TrainingPath";
import SystemStatus from "@/components/SystemStatus";
import Development from "@/components/Development";
import Competition from "@/components/Competition";
import TeamShowcase from "@/components/TeamShowcase";
import WhyJoin from "@/components/WhyJoin";
import RecruitProcess from "@/components/RecruitProcess";
import Gallery from "@/components/Gallery";
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
        <TechTree />
        <TrainingPath />
        <TeamShowcase />
        <WhyJoin />
        <RecruitProcess />
        <Team />
        <Robots />
        <Development />
        <Competition />
        <Gallery />
        <Join />
      </main>
      <Footer />
    </>
  );
}