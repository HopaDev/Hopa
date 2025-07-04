"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ThemeContextType = {
  isWhiteTheme: boolean;
  isTransitioning: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  isWhiteTheme: false,
  isTransitioning: false,
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isWhiteTheme, setIsWhiteTheme] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const shouldBeWhite = pathname === '/result';
    
    if (shouldBeWhite !== isWhiteTheme) {
      setIsTransitioning(true);
      
      // 延迟更改主题以便开始渐变
      setTimeout(() => {
        setIsWhiteTheme(shouldBeWhite);
      }, 50);
      
      // 渐变完成后停止过渡状态
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }
  }, [pathname, isWhiteTheme]);

  return (
    <ThemeContext.Provider value={{ isWhiteTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}
