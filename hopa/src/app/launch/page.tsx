"use client";

import Image from 'next/image';
import BackgroundPNG from '../../assets/img/launch/background.png';
import InputPNG from '../../assets/img/launch/input.png';
import MicrophonePNG from '../../assets/img/launch/microphone.png';
import ModelPNG from '../../assets/img/launch/model.png';
import BackArrowPNG from '../../assets/img/launch/back_arrow.png';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import UserMessage from '../../components/UserMessage';
import AiMessage from '../../components/AiMessage';
import ConsensusCard from '../../components/ConsensusCard';
import AnimatedConsensusCard from '../../components/AnimatedConsensusCard';


export default function LaunchPage() {
  const router = useRouter();
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai' | 'consensus', content: string, id?: string }>>([]);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    if (chatAreaRef.current && messages.length > 0) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // 如果是第一次进入对话模式，先添加AI的初始消息
      if (!isConversationMode) {
        setMessages([
          // { type: 'ai', content: '未来有什么计划吗？' },
          { type: 'user', content: inputValue, id: `user-${Date.now()}` }
        ]);
      } else {
        // 如果已经在对话模式，只添加用户消息
        setMessages(prev => [...prev, { type: 'user', content: inputValue, id: `user-${Date.now()}` }]);
      }
      
      // 切换到对话模式
      setIsConversationMode(true);
      
      // 清空输入框
      setInputValue('');
      
      // 模拟AI回复（延迟1秒）
      setTimeout(() => {
        const aiMessageId = `ai-${Date.now()}`;
        const aiMessage = '好的！我推荐使用这个共识模板：';
        
        // 先添加AI消息
        setMessages(prev => [
          ...prev, 
          { type: 'ai', content: aiMessage, id: aiMessageId }
        ]);
        
        // 计算AI消息渲染时间（每个字符30ms）+ 额外0.2秒延迟
        const aiRenderTime = aiMessage.length * 50 + 200;
        
        // 延迟显示共识卡片
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { type: 'consensus', content: '', id: `consensus-${Date.now()}` }
          ]);
        }, aiRenderTime);
      }, 1000);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <>
      {/* 返回按钮 - 浮于所有元素之上 */}
      <button
        onClick={handleBackToHome}
        className="fixed top-5 left-5 z-50"
      >
        <Image
          src={BackArrowPNG}
          alt="back arrow"
          width={15}
        />
      </button>

      {!isConversationMode ? (
        /* 非对话模式 - 完全静态，所有元素都固定 */
        <div className="bg-white h-screen overflow-hidden fixed inset-0">
          
          {/* 固定顶部 - 背景图片 */}
          <div className="fixed top-0 left-0 right-0 z-20">
            <Image
              src={BackgroundPNG}
              alt="background"
              className="w-full h-auto"
            />
          </div>
          
          {/* 固定中间 - 标题内容 */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full px-8">
            <div className="text-center font-alimama">
              <h1
                className="text-2xl font-bold text-black whitespace-nowrap opacity-0 animate-fade-in"
                style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
              >
                告诉我你们的需求
              </h1>
              <h2
                className="text-2xl font-bold text-black mt-2 whitespace-nowrap opacity-0 animate-fade-in"
                style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
              >
                然后开启你们的合拍之旅
              </h2>
            </div>
          </div>
          
          {/* 固定底部 - 输入框 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-20">
            <div className="w-full max-w-md mx-auto flex items-center gap-4">
              <button className="flex-shrink-0">
                <Image
                  src={MicrophonePNG}
                  alt="microphone"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </button>
              
              <div className="flex-1 relative">
                <Image
                  src={InputPNG}
                  alt="input background"
                  className="w-auto h-10"
                />
                <div className="absolute inset-0 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="开启你们的合拍之旅..."
                    className="flex-1 bg-transparent h-full px-4 text-black text-base outline-none placeholder-gray-400"
                  />
                  <button
                    className="pr-4 text-gray-500 text-xl"
                    onClick={handleSendMessage}
                  >
                    》
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 对话模式 - 标准聊天室界面 */
        <div className="bg-white h-screen relative">
          {/* 固定顶部 - 背景图片 */}
          <div className="fixed top-0 left-0 right-0 z-20">
            <Image
              src={BackgroundPNG}
              alt="background"
              className="w-full h-auto"
            />
          </div>
          
          {/* 固定底部 - 输入框 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-20">
            <div className="w-full max-w-md mx-auto flex items-center gap-4">
              <button className="flex-shrink-0">
                <Image
                  src={MicrophonePNG}
                  alt="microphone"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </button>
              
              <div className="flex-1 relative">
                <Image
                  src={InputPNG}
                  alt="input background"
                  className="w-auto h-10"
                />
                <div className="absolute inset-0 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="继续对话..."
                    className="flex-1 bg-transparent h-full px-4 text-black text-base outline-none placeholder-gray-400"
                  />
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
          
          {/* 聊天区域 */}
          <div 
            ref={chatAreaRef}
            className="h-full pt-48 pb-20 overflow-y-auto bg-white"
          >
            <div className="w-full px-4 py-4">
              {messages.map((msg, index) => {
                if (msg.type === 'user') {
                  return <UserMessage key={msg.id || `user-${index}`} message={msg.content} />;
                } else if (msg.type === 'ai') {
                  return <AiMessage key={msg.id || `ai-${index}`} message={msg.content} />;
                } else if (msg.type === 'consensus') {
                  return (
                    <AnimatedConsensusCard
                      key={msg.id || `consensus-${index}`}
                      title="小组作业共识模板"
                      description="适用于2-6人参与的小组协作任务
                        在任务开始前明确目标、分工、规则与边界
                        提高协作效率和完成度"
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}