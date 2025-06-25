import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavButton from "@/components/NavButton";
import HomeIcon from "@/assets/img/Home.png";
import LaunchIcon from "@/assets/img/Launch.png";
import PersonIcon from "@/assets/img/Person.png";
import ConditionalNavigation from "@/components/ConditionalNavigation";

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
        <main className="pb-24">{children}</main>
        <ConditionalNavigation />
      </body>
    </html>
  );
}
