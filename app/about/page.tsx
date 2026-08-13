import type { Metadata } from "next";
import Team from "@/components/Team";
import Robots from "@/components/Robots";
import Competition from "@/components/Competition";
import Gallery from "@/components/Gallery";
import Development from "@/components/Development";

export const metadata: Metadata = {
  title: "关于战队",
  description:
    "了解 YZ Control 的六大技术方向、参赛机器人、比赛经历、成长历程与战队影像。",
};

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
