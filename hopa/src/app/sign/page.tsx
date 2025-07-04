'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CustomSign from '@/assets/img/sign/custommm.png';
import HandwriteSign from '@/assets/img/sign/handwrite.png';
import nfcSign from '@/assets/img/sign/nfc.png';
import voiceSign from '@/assets/img/sign/voice.png';
import handwritePi from '@/assets/img/sign/handwritePi.png';
import voiceButton from '@/assets/img/sign/voiceButton.png';
import voiceStopButton from '@/assets/img/sign/voiceStopButton.png';
import voicePlayButton from '@/assets/img/sign/voicePlayButton.png';
import nfcBackground from '@/assets/img/sign/nfcBackground.png';
import customBackground from '@/assets/img/sign/customBackground.png';
import voicePi from '@/assets/img/sign/voicePi.png';
import customModal1 from '@/assets/img/sign/customModal1.png';
import customModal2 from '@/assets/img/sign/customModal2.png';
import customModal3 from '@/assets/img/sign/customModal3.png';
import customModal4 from '@/assets/img/sign/customModal4.png';
import createNew from '@/assets/img/sign/createNew.png';
import Bg1 from '@/assets/img/sign/bg1.png';
import Bg2 from '@/assets/img/sign/bg2.png';
import Bg3 from '@/assets/img/sign/bg3.svg';
import Bg4 from '@/assets/img/sign/bg4.svg';
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
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

  // Canvas引用
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 初始化Canvas设置
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // 设置画布大小
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.save();
        ctx.translate(canvas.width / 4, canvas.height / 4);
        ctx.rotate(Math.PI / 2); // 旋转90度
        ctx.font = "30px Arial";
        ctx.fillStyle = "#ccc";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("请手写签名", 0, 0);
        ctx.restore();
      }
    }
  }, [selectedMethod]);

  const customSignModal:StaticImageData[] = [
    customModal1,
    customModal2,
    customModal3,
    customModal4
  ]; 

  const signatureOptions: SignatureOption[] = [
    {
      src: CustomSign,
      id: 'custom',
      name: '个性化签名',
      icon: '🎨',
      description: '使用个人签名模板',
      color: 'from-pink-400 to-purple-500'
    },
    {
      src: voiceSign,
      id: 'voice',
      name: '语音签名',
      icon: '🎤',
      description: '用声音定格这一刻的承诺',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      src: HandwriteSign,
      id: 'handwrite',
      name: '手写签名',
      icon: '✍️',
      description: '自定义手写，更具正式感',
      color: 'from-green-400 to-emerald-500'
    },
    {
      src: nfcSign,
      id: 'nfc',
      name: 'NFC碰一碰',
      icon: '📱',
      description: '线下meeting，一键签',
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
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
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

  // 录音录制逻辑
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('无法访问麦克风:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  // 手写签名功能
  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width) / 2,
      y: (clientY - rect.top) * (canvas.height / rect.height) / 2
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const pos = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const pos = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
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
      audioData: selectedMethod === 'voice' ? recordedAudio : null,
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
    <div className="min-h-screen  relative">
      {/* 背景装饰 - 使用提供的图片 */}
      {currentState !== "signing" && (
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 左上角装饰 */}
        <div className="absolute top-16 left-0">
          <Image src={Bg1} alt="decoration" className="w-60 object-contain-left" />
        </div>
        
        {/* 右上角装饰 */}
        <div className="absolute top-20 right-0">
          <Image src={Bg2} alt="decoration" className="w-60 object-contain-right" />
        </div>
        
        {/* 左下角装饰 */}
        <div className="absolute bottom-0 left-0">
          <Image src={Bg4} alt="decoration" className="w-60 object-contain" />
        </div>
        
        {/* 右下角装饰 */}
        <div className="absolute bottom-0 right-0">
          <Image src={Bg3} alt="decoration" className="w-60 object-contain" />
        </div>
      </div>
      )}


                {isRecording && (
            <div className="fixed  inset-0 w-full h-full z-50  bg-[#383838] backdrop-blur-sm  flex items-center justify-center flex-col ">
              <div>
                <Image
                  src={voiceStopButton}
                  alt="voiceStopButton"
                  className="w-96 h-96 mx-auto mt-20 cursor-pointer hover:scale-105 transition-transform duration-300 animate-pulse object-contain"
                  onClick={toggleRecording}
                />
                </div>
            
              <div className="text-red-600 font-bold text-lg">
                🔴 录音中... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-red-500 mt-1">请说出您的签名承诺</div>

            </div>
          )}

      {/* 头部 */}
      <div className="backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* <h1 className="text-lg font-bold text-gray-900">共识签名</h1> */}
          <div className="w-10"></div>
        </div>
      </div>

      <div className="">
        {/* 状态1：共识结果展示 */}
        {currentState === 'result' && (
          <div className="space-y-8 relative z-10 mx-4 my-6">
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
          <div className="py-8 relative z-10 mx-4 my-6">
            <div className="text-center mb-6 mt-24">
              <h2 className="text-3xl font-alimama font-bold text-gray-900 mb-3">选择你的签名方式</h2>
              {/* <p className="text-gray-600 text-sm">每一种方式都能体现您的个性</p> */}
            </div>

            {/* 签名方式选择 - 改为2x2网格布局，图片完全占满 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {signatureOptions.map((option) => (
                <div
                  key={option.id}
                  className="group cursor-pointer"
                  onClick={() => handleMethodSelect(option.id)}
                >
                  <div className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2" >
                    {/* 背景图片完全占满 */}
                    <div className="relative w-full h-48">
                      <Image 
                        src={option.src} 
                        alt={option.name} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
                      />
                      
                      {/* 渐变遮罩 */}
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div> */}
                      
                      {/* 文字内容 */}
                      {/* <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-bold mb-1">{option.name}</h3>
                        <p className="text-sm opacity-90">{option.description}</p>
                      </div> */}
                      
                      {/* 选择指示器 */}
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[#ff5a5e] text-sm font-bold">✓</span>
                      </div>
                    </div>
                  </div>

                  {/* <div className={`bg-white/90 backdrop-blur-sm rounded-3xl  border border-gray-200/50 
                                   shadow-xl hover:shadow-2xl transition-all duration-500 
                                   hover:scale-105 hover:-translate-y-2 relative overflow-hidden
                                   ${hoveredMethod === option.id ? 'ring-2 ring-[#ff5a5e]/50' : ''}`}> */}
{/* 
                    <div>
                  <Image src={option.src} alt={option.name} className="w-32 h-32 mb-0 mx-0" />
                

                  </div>   */}

                </div>
                
              ))}
            </div>

            {/* 快速签名按钮 */}
            <div className="space-y-4">
              <button
                onClick={completeSignature}
                className="w-full bg-gradient-to-r from-[#ff5a5e] to-[#ff8a5b] text-white py-3 px-8 rounded-3xl font-bold text-lg
                           shadow-2xl shadow-[#ff5a5e]/30 hover:shadow-3xl hover:shadow-[#ff5a5e]/50 
                           hover:scale-[1.02] transition-all duration-300 active:scale-95 relative overflow-hidden
                           flex flex-row items-center justify-center space-x-4"
              >
                <div className=" flex flex-col items-center justify-center">
                  <div className="flex items-center font-alimama justify-center space-x-3">
                    <h2 className="text-3xl">快速签名</h2>
                  </div>
                  <div className="text-sm font-bold mt-1 color-black text-gray-600">点一下,即刻完成签名</div>
                </div>
                <div className="absolute w-6 h-6 right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 absolute  z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              </button>
            </div>
            
            {/* 底部提示 */}
            {/* <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                ✨ 选择最能代表您的签名方式，让这份共识更有意义
              </p>
            </div> */}
          </div>
        )}

        {/* 状态3：签名操作执行 */}
        {currentState === 'signing' && (
          <div className=" relative z-50">
            {/* 顶部签名方式切换栏 */}
            <div className="mb-2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-200/50 shadow-lg">
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
            <div className="bg-white/90 backdrop-blur-sm   ">
              {/* 快速签名 */}
              {/* {selectedMethod === 'quick' && (
                <div className="text-center space-y-6 m-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#ff5a5e] to-[#ff8a5b] rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <span className="text-4xl text-white">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">快速签名</h3>
                  <p className="text-gray-600">点击下方按钮即可完成签名</p>
                  <button
                    onClick={completeSignature}
                    className="w-full bg-gradient-to-r from-[#ff5a5e] to-[#ff8a5b] text-white py-4 px-6 rounded-2xl font-bold text-lg
                               shadow-2xl shadow-[#ff5a5e]/30 hover:shadow-3xl hover:shadow-[#ff5a5e]/50 
                               hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    确认签名 ⚡
                  </button>
                </div>
              )} */}

              {/* 个性化签名 */}
              {selectedMethod === 'custom' && (
                <div className="">
                  <div className="absolute w-full h-193 overflow-hidden  z--10 ">
                  <Image 
                    src={customBackground}
                    alt="customBackground"
                    className="absolute -top-[20%] w-full h-auto opacity-90"
                  />
                  </div>
                  <div className="absolute w-full h-193 overflow-hidden z--20 p-4">
                    <div className="text-center">
                      <h3 className="text-3xl font-alimama font-bold text-gray-900 mb-2">选择你的个性化签名</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-1 pt-6 ">
                    {customSignModal.map((modal, index) => (
                      <Image
                        key={index}
                        src={modal}
                        alt={`customModal${index + 1}`}
                        className="w-69 h-26 mx-auto mb-1 cursor-pointer hover:scale-105 transition-transform duration-300 object-contain"
                        onClick={() => setCustomSignature({
                          ...customSignature,
                          style: `style${index + 1}`
                        })}
                      />
                    ))}
                    </div>
                    <div className="text-center mt-2">
                      <Image 
                        src={createNew}
                        alt="createNew"
                        className="w-90 h-32 mx-auto mb-1 cursor-pointer hover:scale-105 transition-transform duration-300 object-contain"
                        onClick={() => setCustomSignature({
                          ...customSignature,
                          style: 'createNew'
                        })}
                      />
                    </div>
                  </div>


                    
                  
                </div>
              )}

              {/* 语音签名 */}
              {selectedMethod === 'voice' && (
                 <div className=" m-4 my-12">
                  <div className="h-20">
                  { recordedAudio && !isRecording ? (           
                        <div className="flex items-center justify-center space-x-4 onClick={playRecordedAudio} relative">

                          <Image
                            src={voicePlayButton}
                            alt="voicePlayButton"
                            className="w-64 h-20 cursor-pointer hover:scale-105 transition-transform duration-300 object-contain"
                            onClick={playRecordedAudio}
                          >
                            </Image>
                          <span className="text-2xl text-white font-bold absolute top-6/13 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                       
                  ):
                  (                
                    <div className="text-center my-4">
                      <p className="text-gray-500 text-2xl font-alimama">录制一段语音作为您的签名</p>
                    </div>
                  )}
                  </div>
               
                  
                  {/* 录音状态显示 */}
                  <div className="text-center">
                    {/* <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-[\'assets/img/sign/voiceButton.png\']'
                    }`}>
                      // 🎤
                    </div> */}
                    { isRecording === false && (
                      <div>

                        <Image
                          src={voiceButton}
                          alt="voiceButton"
                          className="w-96 h-96 mx-auto cursor-pointer hover:scale-105 transition-transform duration-300 object-contain"
                          onClick={toggleRecording}
                        />

                      </div>

                    ) }                 

                    { isRecording === false &&(

                    <div className="relative w-full h-50 ">

                      { !recordedAudio ? (
                      <h1 className="text-3xl font-bold text-gray-900 mb-2 font-alimama absolute left-1/2 transform -translate-x-1/2">
                         长按开始录音
                      </h1>
                      ) : (
                        <h1 className="w-full text-2xl font-bold text-gray-400 mb-2 font-alimama absolute left-1/2 transform -translate-x-1/2 duration-300  animate-pulse">
                          点击上方重新录制
                        </h1>
                      )}

                      {/* 右下角装饰图片 */}
                      <div className="absolute bottom-0 right-1">
                        <Image
                         src={voicePi}
                          alt="voicePi"
                          className="w-54 h-36 mx-auto  object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                         />
                      </div>
                      {recordedAudio && !isRecording && (
                        <button
                          onClick={completeSignature}
                          className="
                                    absolute top-3/5 left-1/2 transform -translate-x-1/2
                                      w-3/5 bg-gradient-to-r from-red-400 to-pink-500 text-white py-4 px-4 rounded-2xl font-bold text-2xl
                                     shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/50 
                                     hover:scale-105 transition-all duration-300 active:scale-95 font-alimama" 
                        >
                          确认语音签名
                        </button>
                      )}

                    </div>
                    )}

                    <div className="space-y-4">
                      {/* <button
                        onClick={toggleRecording}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95 ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-2xl shadow-red-500/30' 
                            : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/50'
                            // :'bg-[\'assets/img/sign/voiceButton.png\']'
                        }`}
                      >
                        {isRecording ? '停止录音 ⏹️' : '开始录音 🎤'}
                      </button> */}
                      
                      
                    </div>


                  </div>
                </div>
              )}

              {/* 手写签名 */}
              {selectedMethod === 'handwrite' && (
                <div className="p-2 m-6 my-12">
                  <div className="text-right ">
                    {/* <h3 className="text-2xl font-bold text-gray-900 mb-2">手写签名</h3> */}
                    <p className="text-2xl mt-6 text-gray-600 font-alimama">请横屏手写你的签名</p>
                  </div>
                  {/* 让Image在canvas后面，通过相对定位父容器+绝对定位Image+z-index控制 */}
                  <div className="relative w-full h-120 z-0">
                    <Image 
                      src={handwritePi} 
                      alt="handwrite" 
                      className="absolute left-1/5 top-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none" 
                    />
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={200}
                      className="w-full h-148 z-10 bg-[#ededed] shadow-[inset_1px_3px_4px_rgba(0,0,0,0.17)] rounded-[15px] cursor-crosshair border border-gray-200 relative"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                    {/* <p className="text-sm text-gray-500 mt-2 text-center relative z-20">
                      在此区域签名（支持鼠标和触摸）
                    </p> */}
                  </div>
                  
                  <div className="ml-10 flex flex-col z-20 transform rotate-90 g-2 w-30">
                    <button
                      onClick={clearSignature}
                      className="w-30 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 my-5 py-3 rounded-full font-medium transition-colors"
                    >
                      清除重写
                    </button>
                    <button
                      onClick={completeSignature}
                      disabled={!hasSignature}
                      className="w-30 flex-1 my-5 bg-[#FF595D] text-white py-3 rounded-full font-bold
                                 shadow-2xl shadow-green-500/30 hover:shadow-3xl hover:shadow-green-500/50 
                                 hover:scale-105 transition-all duration-300 active:scale-95 disabled:bg-[#FF8C90]  disabled:cursor-not-allowed"
                    >
                      确认签名
                    </button>
                  </div>
                </div>
              )}

              {/* NFC签名 */}
              {selectedMethod === 'nfc' && (
                <div className='relative w-full h-193 overflow-hidden'>
                    <Image
                      src={nfcBackground}
                      alt="…"
                      // 这里不再用 fill，而是让 img 本身宽度铺满，高度自适应
                      className="absolute -top-[20%] w-full h-auto"
                      // 去掉 fill，改成下面这种写法：
                      // width={1920}    // 传一个足够大的原图宽度
                      // height={200}   // 传一个比例合适的原图高度
                    />
                    <div className="absolute inset-0 bottom-2/3 flex items-center justify-center z-20">
                      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl shadow-[#ff5a5e]/10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">NFC签名</h3>
                        <p className="text-gray-600 mb-6">请将您的NFC设备靠近手机进行签名</p>
                        <button
                          onClick={completeSignature}
                          className="w-full bg-gradient-to-r from-[#ff5a5e] to-[#ff8a5b] text-white py-4 px-6 rounded-2xl font-bold text-lg
                                     shadow-2xl shadow-[#ff5a5e]/30 hover:shadow-3xl hover:shadow-[#ff5a5e]/50 
                                     hover:scale-105 transition-all duration-300 active:scale-95"
                        >
                          确认NFC签名
                        </button>
                      </div>
                      </div>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}