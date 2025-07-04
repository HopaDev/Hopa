"use client";

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function TimeDisplay() {
  // 初始化时就设置当前时间
  const getInitialTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return {
      hours: hours.toString(),
      minutes: minutes.toString().padStart(2, '0')
    };
  };

  const [currentTime, setCurrentTime] = useState(getInitialTime);
  const { isWhiteTheme } = useTheme();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTime({
        hours: hours.toString(),
        minutes: minutes.toString().padStart(2, '0')
      });
    };

    // 每分钟更新一次
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="fixed top-5 left-14 z-[999999] pointer-events-none">
      <div className={`text-lg font-sf tracking-tight flex items-center transition-colors duration-700 ${
        isWhiteTheme ? 'text-white' : 'text-black'
      }`}>
        <span>{currentTime.hours}</span>
        <span className="transform -translate-y-0.5 mx-px">:</span>
        <span>{currentTime.minutes}</span>
      </div>
    </div>
  );
}
