import Team from "@/components/Team";
import Robots from "@/components/Robots";
import Competition from "@/components/Competition";
import Gallery from "@/components/Gallery";
import Development from "@/components/Development";

export default function AboutPage() {
  return (
    <main className="pt-20">
      <Team />
      <Robots />
      <Competition />
      <Development />
      <Gallery />
    </main>
  );
}