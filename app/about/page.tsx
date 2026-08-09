import Navbar from "@/components/Navbar";
import Team from "@/components/Team";
import Robots from "@/components/Robots";
import Competition from "@/components/Competition";
import Gallery from "@/components/Gallery";
import Development from "@/components/Development";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Team />
        <Robots />
        <Competition />
        <Development />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}