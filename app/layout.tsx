import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = localFont({
  src: "../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yz-control.top"),
  title: "YZ Control | RoboMaster 2026",
  description:
    "YZ Control — RoboMaster 2026 步兵对抗赛国二、3v3 国三。步兵、英雄、哨兵三台机器人，从 STM32 嵌入式到视觉自瞄，我们用代码和钢铁征服赛场。",
  keywords: ["RoboMaster", "3v3", "步兵对抗赛", "YZ Control", "机器人", "战队", "招新", "RM2026"],
  openGraph: {
    title: "YZ Control | 豫章师范学院 RoboMaster 战队",
    description:
      "从 STM32 到 AI 自瞄，零基础也能成为机甲大师。2026 赛季招新中！",
    images: [{ url: "/images/gallery/gallery-17.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
