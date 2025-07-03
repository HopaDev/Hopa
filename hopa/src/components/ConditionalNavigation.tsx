"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from "@/assets/img/navi/navi_bar.png";
import HomeIcon from "@/assets/img/navi/home_icon.png";
import GroupIcon from "@/assets/img/navi/group_icon.png";
import MessageIcon from "@/assets/img/navi/message_icon.png";
import MypageIcon from "@/assets/img/navi/mypage_icon.png";
import path from 'path';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const hideNavigation = pathname === '/launch' || pathname === '/result' || pathname === '/fill' || pathname == '/sign';

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      if (hideNavigation) {
        main.style.paddingBottom = '0';
      } else {
        main.style.paddingBottom = '6rem'; // pb-24 = 6rem
      }
    }
  }, [hideNavigation]);

  if (hideNavigation) {
    return null;
  }

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-2/3 z-50">
      {/* 导航栏背景 - 允许内容超出容器 */}
      <div className="relative overflow-visible">
        <Image 
          src={NavBar} 
          alt="navigation bar" 
          className="w-full h-auto"
          priority
        />
        
        {/* 导航按钮覆盖层 */}
        <div className="absolute inset-0 flex justify-around items-end px-4 pb-2">
          {/* 首页 */}
          <Link href="/" className="flex items-end justify-center flex-1">
            <Image src={HomeIcon} alt="首页" className="w-12 h-12" />
          </Link>
          
          {/* 共识圈子 */}
          <Link href="/launch" className="flex items-end justify-center flex-1">
            <Image src={GroupIcon} alt="共识圈子" className="w-12 h-12" />
          </Link>
          
          {/* 消息 */}
          <Link href="/message" className="flex items-end justify-center flex-1">
            <Image src={MessageIcon} alt="消息" className="w-12 h-12" />
          </Link>
          
          {/* 个人中心 */}
          <Link href="/mypage" className="flex items-end justify-center flex-1">
            <Image src={MypageIcon} alt="个人中心" className="w-12 h-12" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
