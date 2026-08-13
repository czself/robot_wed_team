import type { Metadata } from "next";
import TechStarMap from "@/components/TechStarMap";
import TrainingPath from "@/components/TrainingPath";

export const metadata: Metadata = {
  title: "技术星图",
  description:
    "探索 YZ Control 的机械与电控两大方向；视觉自瞄与控制算法归入电控训练路线。",
};

export default function TechPage() {
  return (
    <main className="pt-20">
      <TechStarMap />
      <TrainingPath />
    </main>
  );
}
