'use client';

import Image from 'next/image';
import BackgroundImg from '../../assets/img/Result Background.png';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // 页面加载后立即开始动画
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300); // 稍微延迟一下让页面完全加载

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-orange-400 overflow-hidden">
      {/* 图片容器 - 从横线下方推出 */}
      <div 
        className="absolute z-20"
        style={{
          width: 'calc(4/5 * 100% * 0.9)', // 横线宽度的90%
          top: '10px', // 图片顶部与横线顶部对齐
          left: '50%',
          transform: `translateX(-50%) translateY(${showAnimation ? '20px' : '-85%'})`,
          transition: 'transform 3000ms ease-out'
        }}
      >
        <div className="relative w-full">
          {/* 使用 Next.js Image 组件 */}
          <Image
            src={BackgroundImg}
            alt="结果页面背景"
            width={0}
            height={0}
            priority
            className="w-full h-auto"
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      {/* 打印机横线 - 简单的一条横线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4/5 h-2 bg-gray-800 rounded-sm z-10 shadow-lg" style={{ top: '10px' }}></div>

      {/* 遮罩层 - 覆盖横线上方区域，隐藏图片 */}
      <div className="absolute top-0 left-0 w-full bg-orange-400 z-30" style={{ height: '10px' }}></div>

      {/* 文字内容 */}
      <div 
        className={`absolute bottom-30 left-1/2 transform -translate-x-1/2 w-4/5 text-center transition-all duration-1000 delay-2000 ${
          showAnimation 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-white text-xl font-bold mb-2">共识结果已生成</h2>
        <p className="text-white/80 text-sm">您的共识内容已准备就绪</p>
      </div>
    </div>
  );
}