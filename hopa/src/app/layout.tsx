import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavButton from "@/components/NavButton";
import HomeIcon from "@/assets/img/Home.png";
import LaunchIcon from "@/assets/img/Launch.png";
import PersonIcon from "@/assets/img/Person.png";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import HomeIndIcon from "@/assets/img/home_ind.png";
import Image from "next/image";
import TimeDisplay from "@/components/TimeDisplay";
import ThemeProvider from "@/components/ThemeProvider";
import DynamicBackground from "@/components/DynamicBackground";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#FF6B35" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-navbutton-color" content="#FF6B35" />
      </head>      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {/* iOS风格时间显示 */}
          <TimeDisplay />
          
          {/* 顶部固定背景图片 - 动态切换 */}
          <DynamicBackground />
          
          {/* 底部固定背景图片 */}
          <div className="fixed bottom-0 left-0 w-full z-114514 pointer-events-none">
            <Image 
              src={HomeIndIcon} 
              alt="Home indicator background" 
              className="w-full h-auto"
              priority
            />
          </div>
          
          <main className="relative z-20">{children}</main>
          {/* <ConditionalNavigation /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
