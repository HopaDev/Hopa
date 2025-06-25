"use client";

import { useRouter } from 'next/navigation';

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
      className="bg-gradient-to-tr from-red-400 via-orange-400 to-orange-500 text-white p-4 rounded-2xl my-3 cursor-pointer hover:from-red-500 hover:via-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
      onClick={handleClick}
    >
      <div className="mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed opacity-90">
        {description.split('\n').map((line, index) => (
          <p key={index} className="mb-1">{line}</p>
        ))}
      </div>
      <div className="flex justify-end mt-3">
        <span className="text-xs opacity-75">点击开始填写 →</span>
      </div>
    </div>
  );
}
