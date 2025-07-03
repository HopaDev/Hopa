'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CustomSign from '@/assets/img/sign/custom.png';
import HandwriteSign from '@/assets/img/sign/handwrite.png';
import nfcSign from '@/assets/img/sign/nfc.png';
import voiceSign from '@/assets/img/sign/voice.png';
import { StaticImageData } from 'next/image';
import Image from 'next/image';

type SignatureState = 'result' | 'method' | 'signing';
type SignatureMethod = 'quick' | 'custom' | 'voice' | 'handwrite' | 'nfc';

interface FormData {
  qualityGoal: string;
  availableTime: string[];
  skills: string;
  primaryRole: string;
  investmentLevel: number;
  [key: string]: any;
}

interface SignatureOption {
  src: StaticImageData;
  id: SignatureMethod;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export default function SignPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentState, setCurrentState] = useState<SignatureState>('result');
  const [selectedMethod, setSelectedMethod] = useState<SignatureMethod>('quick');
  const [hoveredMethod, setHoveredMethod] = useState<SignatureMethod>('quick');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // 个性化签名设置
  const [customSignature, setCustomSignature] = useState({
    nickname: '用户',
    avatar: '👤',
    style: 'default'
  });

  // 录音状态
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const signatureOptions: SignatureOption[] = [
    // {
    //   src:"../../assets/img/sign/quick.png",
    //   id: 'quick',
    //   name: '快速签名',
    //   icon: '⚡',
    //   description: '一键完成签名认证',
    //   color: 'from-yellow-400 to-orange-500'
    // },
    {
      src: CustomSign,
      id: 'custom',
      name: '个性化签名',
      icon: '🎨',
      description: '自定义头像、昵称和装饰风格',
      color: 'from-pink-400 to-purple-500'
    },
    {
      src: voiceSign,
      id: 'voice',
      name: '语音签名',
      icon: '🎤',
      description: '录制语音作为签名认证',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      src: HandwriteSign,
      id: 'handwrite',
      name: '手写签名',
      icon: '✍️',
      description: '在屏幕上手写您的签名',
      color: 'from-green-400 to-emerald-500'
    },
    {
      src: nfcSign,
      id: 'nfc',
      name: 'NFC签名',
      icon: '📱',
      description: '使用NFC设备进行签名认证',
      color: 'from-red-400 to-pink-500'
    }
  ];

  useEffect(() => {
    // 从本地存储加载表单数据
    const savedData = localStorage.getItem('consensusFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleAgree = () => {
    setCurrentState('method');
  };

  const handleDisagree = () => {
    alert('你选择了不同意，将返回填写页面重新填写');
    router.push('/fill');
  };

  const handleMethodSelect = (method: SignatureMethod) => {
    setSelectedMethod(method);
    setCurrentState('signing');
  };

  const handleBack = () => {
    if (currentState === 'signing') {
      setCurrentState('method');
    } else if (currentState === 'method') {
      setCurrentState('result');
    } else {
      router.back();
    }
  };

  // 手写签名功能
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const completeSignature = () => {
    // 保存签名数据
    const signatureData = {
      method: selectedMethod,
      data: selectedMethod === 'handwrite' ? canvasRef.current?.toDataURL() : null,
      customData: selectedMethod === 'custom' ? customSignature : null,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('consensusSignature', JSON.stringify(signatureData));
    alert('签名完成！共识已达成');
    router.push('/');
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">加载中...</div>
          <button 
            onClick={() => router.push('/fill')}
            className="text-[#ff5a5e] font-medium"
          >
            返回填写页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* 背景装饰光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#ff5a5e]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-[#ff8a5b]/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-[#ff6b4a]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-8 w-28 h-28 bg-[#ff5a5e]/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {currentState === 'result' && '共识结果'}
            {currentState === 'method' && '共识签名'}
            {currentState === 'signing' && '进行签名'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 状态1：共识结果展示 */}
        {currentState === 'result' && (
          <div className="space-y-8 relative z-10">
            {/* 共识结果卡片 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl shadow-[#ff5a5e]/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff5a5e] to-[#ff8a5b] rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">小组作业共识结果</h2>
                  <p className="text-gray-600 text-sm">基于所有成员填写整合生成</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">质量目标</h3>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
                    {formData.qualityGoal}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">可用时间</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.availableTime?.map((item: string, index: number) => (
                      <span key={index} className="bg-gradient-to-r from-[#ff5a5e]/10 to-[#ff8a5b]/10 text-[#ff5a5e] px-3 py-1 rounded-full text-xs border border-[#ff5a5e]/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">技能专长</h3>
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-3 border border-gray-100">{formData.skills}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">主要角色</h3>
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-3 border border-gray-100">{formData.primaryRole}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">投入程度</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#ff5a5e] to-[#ff8a5b] h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(formData.investmentLevel / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#ff5a5e]">{formData.investmentLevel}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 选择按钮 */}
            <div className="space-y-4 relative z-10">
              <button
                onClick={handleAgree}
                className="w-full bg-gradient-to-r from-[#ff5a5e] via-[#ff6b4a] to-[#ff8a5b] text-white py-5 px-8 rounded-3xl font-bold text-lg
                           shadow-2xl shadow-[#ff5a5e]/30 hover:shadow-3xl hover:shadow-[#ff5a5e]/50 
                           hover:scale-[1.02] transition-all duration-300 active:scale-95"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>同意内容，进行签名</span>
                  <span className="text-xl">🚀</span>
                </span>
              </button>
              
              <button
                onClick={handleDisagree}
                className="w-full bg-white/70 hover:bg-white/90 text-gray-700 py-5 px-8 rounded-3xl font-bold text-lg
                           border border-gray-300/50 hover:border-gray-400/50 transition-all duration-300 active:scale-95
                           shadow-lg hover:shadow-xl"
              >
                不同意内容
              </button>
            </div>
          </div>
        )}

        {/* 状态2：签名方式选择 */}
        {currentState === 'method' && (
          <div className="py-8 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">选择您的签名方式</h2>
              <p className="text-gray-600">每一种方式都能体现您的个性</p>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {signatureOptions.map((option, index) => (
                <div
                  key={option.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredMethod(option.id)}
                  onClick={() => handleMethodSelect(option.id)}
                >
                  <div>
                  {/*
                  <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 
                                   shadow-xl hover:shadow-2xl transition-all duration-500 
                                   hover:scale-105 hover:-translate-y-2 relative overflow-hidden
                                   ${hoveredMethod === option.id ? 'ring-2 ring-[#ff5a5e]/50' : ''}`}>
                    
                    {// 背景渐变装饰 }
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${option.color} 
                                     rounded-full opacity-10 transform translate-x-8 -translate-y-8
                                     group-hover:scale-150 transition-transform duration-500`}></div>
                    
                    {// 图标 }
                    <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-2xl 
                                     flex items-center justify-center mb-6 relative z-10
                                     group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{option.icon}</span>
                    </div>
                    
                    {// 内容 }
                    <div className="relative z-10">
                      <h3 className="text-x2 font-bold text-gray-900 mb-3 group-hover:text-[#ff5a5e] transition-colors duration-300">
                        {option.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-">
                        {option.description}
                      </p>
                      
                      {// 进入按钮 }
                      <div className={`flex items-center justify-center py-3 px-6 bg-gradient-to-r ${option.color} 
                                       text-white rounded-xl font-medium opacity-0 group-hover:opacity-100 
                                       transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                        <span>开始签名</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {// 装饰点 }
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#ff5a5e]/30 rounded-full"></div>
                    <div className="absolute bottom-6 right-6 w-1 h-1 bg-[#ff8a5b]/40 rounded-full"></div>
                  
                  </div>
                  */}
                  </div>

                  {/* <div className={`bg-white/90 backdrop-blur-sm rounded-3xl  border border-gray-200/50 
                                   shadow-xl hover:shadow-2xl transition-all duration-500 
                                   hover:scale-105 hover:-translate-y-2 relative overflow-hidden
                                   ${hoveredMethod === option.id ? 'ring-2 ring-[#ff5a5e]/50' : ''}`}> */}

                    <div>
                  <Image src={option.src} alt={option.name} className="w-32 h-32 mb-0 mx-0" />
                

                  </div>  

                </div>
                
              ))}
            </div>
            
            {/* 底部提示 */}
            <div className="text-center mt-12">
              <p className="text-gray-500 text-sm">
                ✨ 选择最能代表您的签名方式，让这份共识更有意义
              </p>
            </div>
          </div>
        )}

        {/* 状态3：签名操作执行 */}
        {currentState === 'signing' && (
          <div className="space-y-6 relative z-10">
            {/* 顶部签名方式切换栏 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-200/50 shadow-lg">
              <div className="flex space-x-2 overflow-x-auto">
                {signatureOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedMethod(option.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 
                      ${selectedMethod === option.id 
                        ? `bg-gradient-to-r ${option.color} text-white shadow-lg scale-105` 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 签名操作区域 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
              {/* 快速签名 */}
              {selectedMethod === 'quick' && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <span className="text-4xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">快速签名</h3>
                  <p className="text-gray-600">点击下方按钮即可完成签名</p>
                  <button
                    onClick={completeSignature}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-6 rounded-2xl font-bold text-lg
                               shadow-2xl shadow-yellow-500/30 hover:shadow-3xl hover:shadow-yellow-500/50 
                               hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    确认签名 ⚡
                  </button>
                </div>
              )}

              {/* 个性化签名 */}
              {selectedMethod === 'custom' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">个性化签名</h3>
                    <p className="text-gray-600">自定义您的签名样式</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">选择头像</label>
                      <div className="flex space-x-3 justify-center">
                        {['👤', '😊', '🌟', '💼', '🎯'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setCustomSignature(prev => ({ ...prev, avatar: emoji }))}
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-300
                              ${customSignature.avatar === emoji 
                                ? 'border-pink-400 bg-pink-400/20 scale-110' 
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                              }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">签名昵称</label>
                      <input
                        type="text"
                        value={customSignature.nickname}
                        onChange={(e) => setCustomSignature(prev => ({ ...prev, nickname: e.target.value }))}
                        className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 
                                 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300"
                        placeholder="输入您的昵称"
                      />
                    </div>
                    
                    {/* 签名预览 */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">签名预览：</p>
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-lg border border-pink-400/30">
                        <span className="text-3xl">{customSignature.avatar}</span>
                        <div>
                          <div className="font-bold text-gray-900">{customSignature.nickname}</div>
                          <div className="text-xs text-gray-500">{new Date().toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={completeSignature}
                    className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-4 px-6 rounded-2xl font-bold text-lg
                               shadow-2xl shadow-pink-500/30 hover:shadow-3xl hover:shadow-pink-500/50 
                               hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    确认个性化签名 🎨
                  </button>
                </div>
              )}

              {/* 语音签名 */}
              {selectedMethod === 'voice' && (
                <div className="text-center space-y-6">
                  <div className={`w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto
                    ${isRecording ? 'animate-pulse scale-110' : ''} transition-all duration-300`}>
                    <span className="text-5xl">🎤</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">语音签名</h3>
                    <p className="text-gray-600">请说出"我同意这份共识"来完成签名</p>
                  </div>
                  
                  {isRecording && (
                    <div className="text-center animate-fadeIn">
                      <div className="text-blue-500 font-bold text-xl mb-2">🔴 录音中...</div>
                      <div className="text-lg text-gray-700">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95 ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-2xl shadow-red-500/30' 
                          : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600 shadow-2xl shadow-blue-500/30'
                      }`}
                    >
                      {isRecording ? '停止录音 🛑' : '开始录音 🎤'}
                    </button>
                    
                    {recordingTime > 0 && !isRecording && (
                      <button
                        onClick={completeSignature}
                        className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold text-lg
                                   shadow-2xl shadow-green-500/30 hover:shadow-3xl hover:shadow-green-500/50 
                                   hover:scale-105 transition-all duration-300 active:scale-95 animate-fadeIn"
                      >
                        确认语音签名 ✅
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 手写签名 */}
              {selectedMethod === 'handwrite' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">手写签名</h3>
                    <p className="text-gray-600">请在下方区域写下您的签名</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={150}
                      className="w-full h-40 bg-white rounded-xl cursor-crosshair shadow-sm"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={clearSignature}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium
                                 border border-gray-300 hover:border-gray-400 transition-all duration-300"
                    >
                      重新签名 🔄
                    </button>
                    <button
                      onClick={completeSignature}
                      disabled={!hasSignature}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        hasSignature
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-xl shadow-green-500/30 active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      确认签名 ✍️
                    </button>
                  </div>
                </div>
              )}

              {/* NFC签名 */}
              {selectedMethod === 'nfc' && (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <span className="text-5xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">NFC签名</h3>
                    <p className="text-gray-600">请将您的NFC设备靠近手机</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                      <p className="text-blue-600 font-medium">等待NFC设备连接...</p>
                    </div>
                    <div className="text-gray-600 text-sm">
                      正在扫描附近的NFC设备
                    </div>
                  </div>
                  
                  <button
                    onClick={completeSignature}
                    className="w-full bg-gradient-to-r from-red-400 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg
                               shadow-2xl shadow-red-500/30 hover:shadow-3xl hover:shadow-red-500/50 
                               hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    模拟NFC签名完成 📱
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}