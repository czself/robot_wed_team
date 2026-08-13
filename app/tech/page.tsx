import type { Metadata } from "next";
import TechStarMap from "@/components/TechStarMap";
import TrainingPath from "@/components/TrainingPath";

export const metadata: Metadata = {
  title: "技术星图",
  description:
    "探索 YZ Control 机械、嵌入式、视觉、算法等技术方向及队员训练成长路线。",
};

export default function TechPage() {
  return (
    <main className="pt-20">
      <TechStarMap />
      <TrainingPath />
    </main>
  );
}
