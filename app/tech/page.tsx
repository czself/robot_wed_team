import Navbar from "@/components/Navbar";
import TechStarMap from "@/components/TechStarMap";
import TrainingPath from "@/components/TrainingPath";
import Footer from "@/components/Footer";

export default function TechPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <TechStarMap />
        <TrainingPath />
      </main>
      <Footer />
    </>
  );
}