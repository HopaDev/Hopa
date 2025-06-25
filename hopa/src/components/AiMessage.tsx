import Image from 'next/image';
import LogoPNG from '../assets/img/Logo.png';
import ConsensusCard from './ConsensusCard';

interface AiMessageProps {
  message?: string;
  isPlaceholder?: boolean;
  showConsensusCard?: boolean;
}

export default function AiMessage({ message = "正在思考中...", isPlaceholder = false, showConsensusCard = false }: AiMessageProps) {
  return (
    <div className="flex items-start mb-4 px-4">
      <Image src={LogoPNG} alt="logo" width={40} height={40} className="flex-shrink-0" />
      <div className="relative ml-3 max-w-[80%]">
        {/* AI消息气泡三角形 */}
        <div className="absolute left-0 top-3 transform -translate-x-full z-10">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#EAEAEA]"></div>
        </div>
        <div className="bg-[#EAEAEA] text-black p-3 rounded-2xl rounded-tl-none">
          <p className={`text-base ${isPlaceholder ? 'text-gray-500 italic' : ''}`}>
            {message}
          </p>
        </div>
        {/* 共识卡片 */}
        {showConsensusCard && (
          <ConsensusCard 
            title="小组作业共识模板"
            description="适用于2-6人参与的小组协作任务
              在任务开始前明确目标、分工、规则与边界
              提高协作效率和完成度"
          />
        )}
      </div>
    </div>
  );
}
