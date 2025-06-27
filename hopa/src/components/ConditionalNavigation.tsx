"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NavButton from "@/components/NavButton";
import HomeIcon from "@/assets/img/Home.png";
import LaunchIcon from "@/assets/img/Launch.png";
import PersonIcon from "@/assets/img/Person.png";

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const hideNavigation = pathname === '/launch' || pathname === '/result' || pathname === '/fill';

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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-sm mx-auto bg-gray-100/70 backdrop-blur-lg rounded-full shadow-lg p-1">
      <div className="flex justify-around items-center">
        <NavButton href="/" imgSrc={HomeIcon} text="首页" />
        <NavButton href="/launch" imgSrc={LaunchIcon} text="圈子" />
        <NavButton href="/mypage" imgSrc={PersonIcon} text="我的" />
      </div>
    </nav>
  );
}
