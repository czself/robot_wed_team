import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Robots from "@/components/Robots";
import TechTree from "@/components/TechTree";
import Development from "@/components/Development";
import Competition from "@/components/Competition";
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
        <Team />
        <Robots />
        <TechTree />
        <Development />
        <Competition />
        <Gallery />
        <Join />
      </main>
      <Footer />
    </>
  );
}