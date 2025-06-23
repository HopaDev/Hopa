import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
        <nav className="flex gap-4 p-4 border-b">
          <Link href="/" className="hover:text-blue-600">首页</Link>
          <Link href="/launch" className="hover:text-blue-600">Launch</Link>
          <Link href="/mypage" className="hover:text-blue-600">我的</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
