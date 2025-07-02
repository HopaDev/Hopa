"use client";

import Image from 'next/image';
import BigPNG from '../../assets/img/Big.png';
import LogoPNG from '../../assets/img/Logo.png';
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
          : 'w-20 h-20 bg-[#4A4A4A] border border-gray-600'
      }`}>
      {icon}
    </div>
    <p className={`mt-2 text-white text-sm ${selected ? 'font-bold' : ''}`}>
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
    <div className="bg-[#2D2D2D] h-screen flex flex-col justify-between overflow-hidden fixed inset-0">
      {/* 聊天标题栏 - 只在对话模式显示 */}
      {isConversationMode && (
        <div className="bg-[#ff6a34] text-white text-lg font-semibold p-4 text-center w-full">
          合拍聊天
        </div>
      )}
      
      {/* Top and Middle Content */}
      <div className="shrink-0 flex-1">
        {/* Top section */}        
        <div className={`flex items-start ${isConversationMode ? '' : 'p-8 pt-16'}`}>
          {!isConversationMode && (
            <>
              <Image src={LogoPNG} alt="logo" width={60} height={60} />
              <div className="relative flex items-center">
                <div className="absolute left-1 top-1/4 transform -translate-y-1/2 z-10">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-[#EAEAEA]"></div>
                </div>
                <div className="bg-[#EAEAEA] text-black text-3xl font-bold p-5 rounded-2xl ml-4 flex flex-col items-center justify-center min-w-[120px]">
                  <p>未来</p>
                  <p>有什么计划吗？</p>
                </div>
              </div>
            </>
          )}
        </div>        {/* Middle section */}
        <div className={`flex flex-col items-center gap-8 ${isConversationMode ? '' : 'my-4'}`}>
          {/* 对话消息区域 */}
          {isConversationMode && (
            <div className="flex-1 w-full max-h-96 overflow-y-auto px-4 pt-4">
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
          <div className="w-5/6 flex rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 p-[2px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isConversationMode ? "继续对话..." : "开启你们的合拍之旅..."}
              className="flex-1 rounded-l-full bg-[#2D2D2D] h-9 px-4 text-white text-base outline-none"
            />
            <button
              className="rounded-r-full h-9 px-5 text-white font-bold text-lg bg-[#2D2D2D] border-none shadow-none outline-none flex items-center justify-center"
              style={{ background: '#2D2D2D', boxShadow: 'none', border: 'none' }}
              onClick={handleSendMessage}
            >
              <span className="text-2xl">&gt;&gt;</span>
            </button>
          </div>
        </div>
      </div>      {/* Bottom section */}
      <div className="w-full relative">
        <Image
          src={BigPNG}
          alt="background"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}