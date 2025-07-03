import React, { useState, useRef, useEffect } from 'react';
import IconButton from './IconButton';

// 统一的按钮间距常量
const BUTTON_SPACING = 80;

interface IconButtonData {
  icon: string;
  text: string;
  onClick?: () => void;
}

interface IconButtonCarouselProps {
  buttons: IconButtonData[];
  delay?: number; // 整体延迟显示时间
}

export default function IconButtonCarousel({ buttons, delay = 0 }: IconButtonCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.min(2, Math.max(0, buttons.length - 1))); // 安全的默认中心位置
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  
  // 惯性滚动相关状态
  const [velocity, setVelocity] = useState(0);
  const [isInertiaScrolling, setIsInertiaScrolling] = useState(false);
  const lastMoveTimeRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);
  const inertiaAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    // 延迟显示动画
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(showTimer);
      // 清理惯性动画
      if (inertiaAnimationRef.current) {
        cancelAnimationFrame(inertiaAnimationRef.current);
      }
    };
  }, [delay]);

  // 添加触摸事件监听器以支持被动事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    // 添加被动监听器
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  // 计算边界阻力
  const getBoundaryResistance = (translateX: number, currentIndex: number) => {
    const dragOffset = translateX / BUTTON_SPACING;
    const effectiveCenter = currentIndex - dragOffset;
    
    // 计算超出边界的距离
    let overflowDistance = 0;
    if (effectiveCenter < 0) {
      // 左边界溢出
      overflowDistance = Math.abs(effectiveCenter);
    } else if (effectiveCenter > buttons.length - 1) {
      // 右边界溢出
      overflowDistance = effectiveCenter - (buttons.length - 1);
    }
    
    if (overflowDistance === 0) return 1; // 在边界内，无阻力
    
    // 阻力系数：超出越多阻力越大
    const resistance = Math.max(0.1, 1 - overflowDistance * 0.3);
    return resistance;
  };

  // 应用边界限制的translateX
  const getConstrainedTranslateX = (newTranslateX: number) => {
    const dragOffset = newTranslateX / BUTTON_SPACING;
    const effectiveCenter = currentIndex - dragOffset;
    
    // 最大允许的超出距离（1.5个按钮单位）
    const maxOverflow = 1.5;
    
    if (effectiveCenter < -maxOverflow) {
      // 限制左边界
      return (currentIndex + maxOverflow) * BUTTON_SPACING;
    } else if (effectiveCenter > buttons.length - 1 + maxOverflow) {
      // 限制右边界
      return (currentIndex - (buttons.length - 1 + maxOverflow)) * BUTTON_SPACING;
    }
    
    return newTranslateX;
  };
  
  const getButtonStyle = (index: number) => {
    // 计算当前有效的中心位置（包含拖拽偏移）
    const dragOffset = translateX / BUTTON_SPACING;
    const effectiveCenter = currentIndex - dragOffset;
    
    // 计算距离有效中心的距离
    const distance = Math.abs(index - effectiveCenter);
    
    // 调整缩放和透明度曲线，让更多按钮可见
    const scale = Math.max(0.5, 1 - distance * 0.2);
    const opacity = Math.max(0.4, 1 - distance * 0.25);
    const zIndex = Math.max(1, 10 - Math.floor(distance));
    
    // 计算相对于中心的偏移位置 - 增大间距
    const baseOffset = (index - currentIndex) * BUTTON_SPACING;
    const totalOffset = baseOffset + translateX;
    
    return {
      transform: `translateX(${totalOffset}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: (isDragging || isInertiaScrolling) ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // 阻止默认行为
    
    // 停止任何正在进行的惯性滚动
    if (inertiaAnimationRef.current) {
      cancelAnimationFrame(inertiaAnimationRef.current);
      inertiaAnimationRef.current = null;
    }
    setIsInertiaScrolling(false);
    
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    
    // 初始化速度计算
    lastMoveTimeRef.current = Date.now();
    lastMoveXRef.current = clientX;
    setVelocity(0);
  };

  // 处理拖拽移动
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rawDiff = clientX - startX;
    
    // 应用边界阻力
    const resistance = getBoundaryResistance(rawDiff, currentIndex);
    const diff = rawDiff * resistance;
    
    // 应用边界限制
    const constrainedDiff = getConstrainedTranslateX(diff);
    setTranslateX(constrainedDiff);
    
    // 计算速度（使用原始移动距离，不受阻力影响）
    const now = Date.now();
    const timeDiff = now - lastMoveTimeRef.current;
    
    if (timeDiff > 0) {
      const xDiff = clientX - lastMoveXRef.current;
      const newVelocity = xDiff / timeDiff; // px/ms
      setVelocity(newVelocity);
      
      lastMoveTimeRef.current = now;
      lastMoveXRef.current = clientX;
    }
  };

  // 惯性滚动动画
  const startInertiaAnimation = (initialVelocity: number, initialTranslateX: number) => {
    if (Math.abs(initialVelocity) < 0.1) return; // 速度太小，不启动惯性
    
    setIsInertiaScrolling(true);
    let currentVelocity = initialVelocity * 1000; // 转换为 px/s
    let currentTranslateX = initialTranslateX;
    const baseFriction = 0.95; // 基础摩擦系数
    const minVelocity = 10; // 最小速度阈值
    
    const animate = () => {
      // 根据边界情况调整摩擦力
      const boundaryResistance = getBoundaryResistance(currentTranslateX, currentIndex);
      const dynamicFriction = baseFriction * boundaryResistance;
      
      currentVelocity *= dynamicFriction;
      const newTranslateX = currentTranslateX + currentVelocity / 60; // 假设60fps
      
      // 应用边界限制
      currentTranslateX = getConstrainedTranslateX(newTranslateX);
      setTranslateX(currentTranslateX);
      
      // 检查是否在边界外，如果是，增加额外阻力
      const dragOffset = currentTranslateX / BUTTON_SPACING;
      const effectiveCenter = currentIndex - dragOffset;
      const isOutOfBounds = effectiveCenter < 0 || effectiveCenter > buttons.length - 1;
      
      if (isOutOfBounds) {
        currentVelocity *= 0.8; // 边界外额外减速
      }
      
      // 继续动画或结束
      if (Math.abs(currentVelocity) > minVelocity && !isOutOfBounds) {
        inertiaAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // 惯性滚动结束，选择最近的按钮
        setIsInertiaScrolling(false);
        finalizePosition(currentTranslateX);
      }
    };
    
    inertiaAnimationRef.current = requestAnimationFrame(animate);
  };
  
  // 结束位置计算
  const finalizePosition = (finalTranslateX: number) => {
    const dragOffset = finalTranslateX / BUTTON_SPACING;
    const effectiveCenter = currentIndex - dragOffset;
    let closestIndex = Math.round(effectiveCenter);
    closestIndex = Math.max(0, Math.min(buttons.length - 1, closestIndex));
    
    setCurrentIndex(closestIndex);
    setTranslateX(0);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // 检查是否需要启动惯性滚动
    if (Math.abs(velocity) > 0.3) { // 速度阈值
      startInertiaAnimation(velocity, translateX);
    } else {
      // 没有足够的速度，直接选择最近的按钮
      finalizePosition(translateX);
    }
  };

  // 处理点击切换
  const handleButtonClick = (index: number, originalOnClick?: () => void) => {
    // 如果正在拖拽或惯性滚动，阻止点击
    if (isDragging || isInertiaScrolling) return;
    
    if (index === currentIndex && originalOnClick) {
      originalOnClick();
    } else {
      setCurrentIndex(index);
    }
  };

  return (
    <div 
      className={`relative w-full mx-auto h-36 flex items-center justify-center transition-all duration-500 overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 左侧渐隐遮罩 - 调整为合适宽度 */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      
      {/* 右侧渐隐遮罩 - 调整为合适宽度 */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
      
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {buttons.map((button, index) => (
          <div
            key={index}
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              width: '80px',
              height: '80px',
              marginLeft: '-40px',
              marginTop: '-40px',
              ...getButtonStyle(index),
              pointerEvents: isDragging ? 'none' : 'auto', // 拖拽时禁用点击
            }}
          >
            <IconButton
              icon={button.icon}
              text={button.text}
              onClick={() => handleButtonClick(index, button.onClick)}
              className="w-20 h-20"
              delay={0} // 由父组件控制显示时机
            />
          </div>
        ))}
      </div>
      
      {/* 指示器 */}
      <div className="absolute bottom-3 flex space-x-2 z-30">
        {buttons.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-gray-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
