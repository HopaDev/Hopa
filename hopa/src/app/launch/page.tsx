"use client";

import Image from 'next/image';
import BackgroundPNG from '../../assets/img/launch/background.png';
import InputPNG from '../../assets/img/launch/input.png';
import MicrophonePNG from '../../assets/img/launch/microphone.png';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UserMessage from '../../components/UserMessage';
import AiMessage from '../../components/AiMessage';

const NavButton = ({
  label,
  selected,
  icon,
}: {
  label: string;
  selected?: boolean;
  icon: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-end flex-1">
    <div
      className={`flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${
        selected
          ? 'w-24 h-24 bg-[#FF6F4B]'
          : 'w-20 h-20 bg-gray-200 border border-gray-300'
      }`}>
      {icon}
    </div>
    <p className={`mt-2 text-black text-sm ${selected ? 'font-bold' : ''}`}>
      {label}
    </p>
  </div>
);

export default function LaunchPage() {
  const router = useRouter();
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', content: string, showConsensusCard?: boolean }>>([]);
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // 如果是第一次进入对话模式，先添加AI的初始消息
      if (!isConversationMode) {
        setMessages([
          { type: 'ai', content: '未来有什么计划吗？' },
          { type: 'user', content: inputValue }
        ]);
      } else {
        // 如果已经在对话模式，只添加用户消息
        setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
      }
      
      // 切换到对话模式
      setIsConversationMode(true);
      
      // 清空输入框
      setInputValue('');
      
      // 模拟AI回复（延迟1秒）
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: '好的！我推荐使用这个共识模板：',
          showConsensusCard: true 
        }]);
      }, 1000);
    }
  };
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top and Middle Content */}
      <div className="flex-1">
        {/* Background image at top - 在对话模式和非对话模式都显示 */}
        <div className="w-full">
          <Image
            src={BackgroundPNG}
            alt="background"
            className="w-full h-auto"
          />
        </div>
        
        {/* Top section */}        
        <div className={`flex items-start ${isConversationMode ? '' : 'p-8 pt-16'}`}>
          {!isConversationMode && (
            <div className="w-full text-center font-alimama">
              <h1 className="text-2xl font-bold text-black">
                告诉我你们的需求
              </h1>
              <h2 className="text-2xl font-bold text-black mt-2">
                然后开启你们的合拍之旅
              </h2>
            </div>
          )}
        </div>        {/* Middle section */}
        <div className={`flex flex-col items-center gap-8 ${isConversationMode ? 'min-h-screen' : 'my-4'} pb-4`}>
          {/* 对话消息区域 */}
          {isConversationMode && (
            <div className="w-full px-4 pt-4 bg-white">
              {messages.map((msg, index) => (
                msg.type === 'user' ? 
                  <UserMessage key={index} message={msg.content} /> :
                  <AiMessage key={index} message={msg.content} showConsensusCard={msg.showConsensusCard} />
              ))}
            </div>
          )}
          
          {/* 导航按钮 - 只在非对话模式显示 */}
          {!isConversationMode && (
            <div className="flex justify-center items-end gap-2 w-full px-4">
              <NavButton label="问答" icon={<span className="text-4xl">📝</span>} />
              <NavButton
                label="办公室约谈"
                icon={<span className="text-4xl">☕</span>}
              />
              <NavButton
                label="好友会面"
                selected
                icon={
                  <span className="text-4xl">
                    <span>😊</span>
                    <span>😊</span>
                  </span>
                }
              />
              <NavButton
                label="小组阅读"
                icon={<span className="text-4xl">📖</span>}
              />
              <NavButton label="旅行" icon={<span className="text-4xl">📍</span>} />
            </div>
          )}
          
          {/* 输入框 */}
          <div className={`w-7/8 flex items-center gap-4 ${isConversationMode ? 'sticky bottom-4' : ''}`}>
            {/* 麦克风图标 */}
            <button className="flex-shrink-0">
              <Image
                src={MicrophonePNG}
                alt="microphone"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </button>
            
            {/* 输入框容器 */}
            <div className="flex-1 relative">
              <Image
                src={InputPNG}
                alt="input background"
                className="w-auto h-10"
              />
              <div className="absolute inset-0 flex items-center">
                {/* 输入框 */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isConversationMode ? "继续对话..." : "开启你们的合拍之旅..."}
                  className="flex-1 bg-transparent h-full px-4 text-black text-base outline-none placeholder-gray-400"
                />
                {/* 发送按钮 */}
                <button
                  className="pr-4 text-gray-500 text-xl"
                  onClick={handleSendMessage}
                >
                  ⬆️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}