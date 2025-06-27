import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavButton from "@/components/NavButton";
import HomeIcon from "@/assets/img/Home.png";
import LaunchIcon from "@/assets/img/Launch.png";
import PersonIcon from "@/assets/img/Person.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "合拍Hopa",
  description: "合拍Hopa：你的共识达成”未来式“",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="pb-24">{children}</main> {/* Add padding to bottom to avoid overlap */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-sm mx-auto bg-gray-100/70 backdrop-blur-lg rounded-full shadow-lg p-1">
          <div className="flex justify-around items-center">
            <NavButton href="/" imgSrc={HomeIcon} text="首页" />
            <NavButton href="/launch" imgSrc={LaunchIcon} text="发起" />
            <NavButton href="/mypage" imgSrc={PersonIcon} text="我的" />
          </div>
        </nav>
      </body>
    </html>
  );
}
