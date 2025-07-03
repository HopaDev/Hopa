"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ModelPNG from '../assets/img/launch/model.png';
import StartPNG from '../assets/img/launch/start.png';

interface ConsensusCardProps {
  title: string;
  description: string;
}

export default function ConsensusCard({ title, description }: ConsensusCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/fill');
  };

  return (
    <div 
      className="my-3 cursor-pointer relative"
      onClick={handleClick}
    >
      <Image 
        src={ModelPNG} 
        alt="共识模板" 
        className="w-full h-auto"
      />
      {/* Start 按钮，中轴线对齐模板图片底部 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <Image 
          src={StartPNG} 
          alt="开始按钮" 
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
}
