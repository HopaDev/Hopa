"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ModelPNG from '../assets/img/launch/model.png';

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
      className="my-3 cursor-pointer"
      onClick={handleClick}
    >
      <Image 
        src={ModelPNG} 
        alt="共识模板" 
        className="w-full h-auto"
      />
    </div>
  );
}
