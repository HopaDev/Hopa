import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import ButtonPNG from '../assets/img/launch/button.png';

// 导入所有可能的图标
import BookPNG from '../assets/img/launch/icon/book.png';
import BookSelectPNG from '../assets/img/launch/icon/book_select.png';
import CoffeePNG from '../assets/img/launch/icon/coffee.png';
import CoffeeSelectPNG from '../assets/img/launch/icon/coffee_select.png';
import FacePNG from '../assets/img/launch/icon/face.png';
import FaceSelectPNG from '../assets/img/launch/icon/face_select.png';
import FilePNG from '../assets/img/launch/icon/file.png';
import FileSelectPNG from '../assets/img/launch/icon/file_select.png';
import TravelPNG from '../assets/img/launch/icon/travel.png';
import TravelSelectPNG from '../assets/img/launch/icon/travel_select.png';

interface IconButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  className?: string;
  delay?: number; // 延迟显示时间（毫秒）
}

// 图标映射
const iconMap: { [key: string]: any } = {
  'book': BookPNG,
  'book_select': BookSelectPNG,
  'coffee': CoffeePNG,
  'coffee_select': CoffeeSelectPNG,
  'face': FacePNG,
  'face_select': FaceSelectPNG,
  'file': FilePNG,
  'file_select': FileSelectPNG,
  'travel': TravelPNG,
  'travel_select': TravelSelectPNG,
};

export default function IconButton({ icon, text, onClick, className = "", delay = 0 }: IconButtonProps) {
  const iconSrc = iconMap[icon];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [fontSize, setFontSize] = useState(0); // 初始设为0，避免闪烁
  const [isVisible, setIsVisible] = useState(false); // 控制显示状态

  useEffect(() => {
    // 延迟显示动画
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    const updateFontSize = () => {
      if (buttonRef.current) {
        // 查找按钮内的图片元素
        const imageElement = buttonRef.current.querySelector('img');
        if (imageElement && imageElement.offsetWidth > 0) {
          // 获取PNG图片的实际渲染宽度
          const imageWidth = imageElement.offsetWidth;
          const calculatedSize = imageWidth * 0.17;
          setFontSize(calculatedSize);
        }
      }
    };

    // 立即尝试更新一次
    updateFontSize();

    // 监听图片加载完成事件
    const handleImageLoad = () => {
      setTimeout(updateFontSize, 10);
    };

    // 为图片添加load事件监听
    const imageElement = buttonRef.current?.querySelector('img');
    if (imageElement) {
      if (imageElement.complete) {
        // 图片已经加载完成
        handleImageLoad();
      } else {
        // 图片还在加载中
        imageElement.addEventListener('load', handleImageLoad);
      }
    }

    // ResizeObserver 用于窗口大小变化时重新计算
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateFontSize, 10);
    });
    
    if (buttonRef.current) {
      resizeObserver.observe(buttonRef.current);
    }

    return () => {
      clearTimeout(showTimer);
      const img = buttonRef.current?.querySelector('img');
      if (img) {
        img.removeEventListener('load', handleImageLoad);
      }
      resizeObserver.disconnect();
    };
  }, [delay]);

  if (!iconSrc) {
    console.warn(`Icon "${icon}" not found in iconMap`);
    return null;
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95'
      } ${className}`}
    >
      {/* 底板图片 */}
      <Image
        src={ButtonPNG}
        alt="button background"
        className="w-full h-auto"
      />
      
      {/* 白色圆形和图标 - 位于上半部分 */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
        {/* 白色圆形背景 - 使用容器宽度的比例 */}
        <div className="w-[60%] aspect-square bg-white rounded-full flex items-center justify-center shadow-sm mx-auto">
          {/* 图标 - 使用父容器的60% */}
          <Image
            src={iconSrc}
            alt={`${icon} icon`}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      </div>

      {/* 文字 - 位于中间偏下部分 */}
      <div className="absolute top-3/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
        <div className="text-center">
          {fontSize > 0 && (
            <span 
              className="text-gray-600 whitespace-nowrap"
              style={{ 
                fontSize: `${fontSize}px`,
                fontFamily: 'SimHei, "Microsoft YaHei", "黑体", sans-serif',
                fontWeight: 'bold'
              }}
            >
              {text}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
