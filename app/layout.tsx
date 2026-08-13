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
import MotionProvider from "@/components/MotionProvider";
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
  title: {
    default: "YZ Control | RoboMaster 2026",
    template: "%s · YZ Control",
  },
  description:
    "YZ Control 是豫章师范学院 RoboMaster 战队，专注机器人机械设计、嵌入式控制、计算机视觉、导航算法与赛事运营。",
  keywords: ["RoboMaster", "3v3", "步兵对抗赛", "YZ Control", "机器人", "战队", "招新", "RM2026"],
  openGraph: {
    title: "YZ Control | 豫章师范学院 RoboMaster 战队",
    description:
      "从机械结构、嵌入式控制到视觉自瞄和自主导航，我们一起把机器人送上赛场。",
    url: "/",
    siteName: "YZ Control",
    locale: "zh_CN",
    images: [
      {
        url: "/images/gallery/gallery-02.jpg",
        width: 1920,
        height: 1080,
        alt: "YZ Control RoboMaster 战队",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YZ Control | 豫章师范学院 RoboMaster 战队",
    description: "用代码与工程实践打造能上场的 RoboMaster 机器人。",
    images: ["/images/gallery/gallery-02.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        <MotionProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
