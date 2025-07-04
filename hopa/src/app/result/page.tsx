'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import MachineImg from '../../assets/img/result/machine.png';
import MachineLayerImg from '../../assets/img/result/machine_layer.png';
import BackgroundImg from '../../assets/img/result/background.png';
import TicketImg from '../../assets/img/result/ticket.png';
import BackImg from '../../assets/img/result/back.png';
import ButtonImg from '../../assets/img/result/button.png';
import BarImg from '../../assets/img/result/bar.png';

export default function ResultPage() {
  const [showTicket, setShowTicket] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // 页面加载完毕后开始票据动画
    const ticketTimer = setTimeout(() => {
      setShowTicket(true);
    }, 500);

    // 文字和bar图片延迟0.5秒出现
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    // 彩带特效在1秒后出现
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
      // 彩带特效持续3秒后自动消失
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }, 1000);

    return () => {
      clearTimeout(ticketTimer);
      clearTimeout(textTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={BackgroundImg}
          alt="背景图片"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* 左上角 back 按钮 */}
      <div className="absolute top-18 left-5 z-30">
        <Image
          src={BackImg}
          alt="返回按钮"
          width={0}
          height={0}
          className="w-auto h-auto"
          sizes="4vw"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      {/* 右上角 button 按钮 */}
      <div className="absolute top-18 right-5 z-30">
        <Image
          src={ButtonImg}
          alt="按钮"
          className="w-18 h-auto"
        />
      </div>

      {/* 标题文字 */}
      <div className="absolute top-28 left-0 right-0 z-30 text-center">
        <h1 
          className="text-4xl font-bold text-white font-alimama transition-opacity duration-2000 ease-out"
          style={{
            opacity: showText ? 1 : 0,
          }}
        >
          共识已达成！
        </h1>
        
        {/* Bar 图片 */}
        <div 
          className="mt-4 flex justify-center transition-opacity duration-2000 ease-out"
          style={{
            opacity: showText ? 1 : 0,
          }}
        >
          <Image
            src={BarImg}
            alt="进度条"
            width={0}
            height={0}
            className="w-auto h-auto"
            sizes="60vw"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>

      {/* 彩带特效 */}
      {showConfetti && (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          {/* 彩带粒子 */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-8 opacity-90 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${2 + Math.random() * 2}s linear infinite`,
              }}
            />
          ))}
          
          {/* CSS动画定义 */}
          <style jsx>{`
            @keyframes fall {
              0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Machine 图片 - 底层 */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <Image
          src={MachineImg}
          alt="机器图片"
          width={0}
          height={0}
          className="w-full h-auto"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* Machine Layer 容器 - 用于获取高度 */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        {/* Ticket 图片 - 相对于 machine layer 定位 */}
        <Image
          src={TicketImg}
          alt="票据图片"
          width={100}
          height={100}
          className="absolute left-1/2 transition-transform duration-2000 ease-out"
          sizes="77vw"
          style={{ 
            width: 'auto',
            height: 'auto',
            top: '0px',
            transform: showTicket 
              ? 'translateX(-50%) translateY(-100%)' 
              : 'translateX(-50%) translateY(100vh)',
          }}
        />
        
        <Image
          src={MachineLayerImg}
          alt="机器图层"
          width={0}
          height={0}
          className="w-full h-auto relative z-10"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}