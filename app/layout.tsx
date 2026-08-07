import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YZ Control | RoboMaster 2026",
  description:
    "YZ Control — RoboMaster 2026 步兵对抗赛国二、3v3 国三。步兵、工程、哨兵三台机器人，从 STM32 嵌入式到视觉自瞄，我们用代码和钢铁征服赛场。",
  keywords: ["RoboMaster", "3v3", "步兵对抗赛", "YZ Control", "机器人", "战队", "招新", "RM2026"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        {children}
      </body>
    </html>
  );
}