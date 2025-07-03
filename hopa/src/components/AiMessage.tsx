import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AiMessageProps {
  message?: string;
  isPlaceholder?: boolean;
}

export default function AiMessage({ message = "正在思考中...", isPlaceholder = false }: AiMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [message]);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // 加快速度到30毫秒一个字符，更接近ChatGPT的速度
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, message]);

  return (
    <div className="flex items-start mb-4 px-4">
      <div className="relative ml-3 max-w-[80%]">
        <div className="text-black">
          <p className={`text-base ${isPlaceholder ? 'text-gray-500 italic' : ''}`}>
            <span className="inline-block">
              {displayedText.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-fadeIn"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationDuration: '300ms',
                    animationFillMode: 'both'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
