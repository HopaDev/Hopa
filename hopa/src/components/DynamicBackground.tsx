"use client";

import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import IslandIcon from "@/assets/img/island.png";
import WhiteIslandIcon from "@/assets/img/white_island.png";

export default function DynamicBackground() {
  const { isWhiteTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 w-full z-114514 pointer-events-none">
      {/* 普通岛屿背景 */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${
        isWhiteTheme ? 'opacity-0' : 'opacity-100'
      }`}>
        <Image 
          src={IslandIcon} 
          alt="Island background" 
          className="w-full h-auto"
          priority
        />
      </div>
      
      {/* 白色岛屿背景 */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${
        isWhiteTheme ? 'opacity-100' : 'opacity-0'
      }`}>
        <Image 
          src={WhiteIslandIcon} 
          alt="White Island background" 
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
