'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type SignatureState = 'result' | 'method' | 'signing';
type SignatureMethod = 'quick' | 'custom' | 'voice' | 'handwrite' | 'nfc';

interface FormData {
  goal: string;
  cooperation: string[];
  budget: string;
  timeline: string;
  priority: number;
  [key: string]: any;
}

export default function SignPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentState, setCurrentState] = useState<SignatureState>('result');
  const [selectedMethod, setSelectedMethod] = useState<SignatureMethod | null>(null);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">加载中...</div>
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
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={handleBack} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {currentState === 'result' && '共识结果'}
            {currentState === 'method' && '选择签名方式'}
            {currentState === 'signing' && '进行签名'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 状态1：共识结果展示 */}
        {currentState === 'result' && (
          <div className="space-y-6">
            {/* 共识结果卡片 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#ff5a5e] rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">小组作业共识结果</h2>
                  <p className="text-gray-500 text-sm">基于所有成员填写整合生成</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">项目目标</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{formData.goal}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">协作方式</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.cooperation.map((item: string, index: number) => (
                      <span key={index} className="bg-[#ff5a5e]/10 text-[#ff5a5e] px-3 py-1 rounded-full text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">投入资源</h3>
                    <p className="text-gray-700 text-sm">{formData.budget}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">截止时间</h3>
                    <p className="text-gray-700 text-sm">{formData.timeline}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">优先级</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#ff5a5e] h-2 rounded-full" 
                        style={{ width: `${(formData.priority / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#ff5a5e]">{formData.priority}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 选择按钮 */}
            <div className="space-y-3">
              <button
                onClick={handleAgree}
                className="w-full bg-[#ff5a5e] text-white py-4 px-6 rounded-2xl font-semibold text-lg
                           shadow-lg hover:bg-[#ff4449] transition-all duration-200 active:scale-95"
              >
                同意内容，进行签名
              </button>
              
              <button
                onClick={handleDisagree}
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold text-lg
                           hover:bg-gray-200 transition-all duration-200 active:scale-95"
              >
                不同意内容
              </button>
            </div>
          </div>
        )}

        {/* 状态2：签名方式选择 */}
        {currentState === 'method' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">选择签名方式</h2>
              <p className="text-gray-500">请选择一种方式来签署这份共识</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMethodSelect('quick')}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                           hover:border-[#ff5a5e] hover:bg-[#ff5a5e]/5 transition-all duration-200
                           flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">快速签名</h3>
                  <p className="text-gray-500 text-sm">一键完成签名认证</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => handleMethodSelect('custom')}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                           hover:border-[#ff5a5e] hover:bg-[#ff5a5e]/5 transition-all duration-200
                           flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">个性化签名</h3>
                  <p className="text-gray-500 text-sm">自定义头像、昵称和装饰风格</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => handleMethodSelect('voice')}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                           hover:border-[#ff5a5e] hover:bg-[#ff5a5e]/5 transition-all duration-200
                           flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎤</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">语音签名</h3>
                  <p className="text-gray-500 text-sm">录制语音作为签名认证</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => handleMethodSelect('handwrite')}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                           hover:border-[#ff5a5e] hover:bg-[#ff5a5e]/5 transition-all duration-200
                           flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✍️</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">手写签名</h3>
                  <p className="text-gray-500 text-sm">在屏幕上手写您的签名</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => handleMethodSelect('nfc')}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                           hover:border-[#ff5a5e] hover:bg-[#ff5a5e]/5 transition-all duration-200
                           flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">NFC签名</h3>
                  <p className="text-gray-500 text-sm">使用NFC设备进行签名认证</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 状态3：签名操作执行 */}
        {currentState === 'signing' && (
          <div className="space-y-6">
            {/* 选中的签名方式显示 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">
                    {selectedMethod === 'quick' && '⚡'}
                    {selectedMethod === 'custom' && '🎨'}
                    {selectedMethod === 'voice' && '🎤'}
                    {selectedMethod === 'handwrite' && '✍️'}
                    {selectedMethod === 'nfc' && '📱'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedMethod === 'quick' && '快速签名'}
                    {selectedMethod === 'custom' && '个性化签名'}
                    {selectedMethod === 'voice' && '语音签名'}
                    {selectedMethod === 'handwrite' && '手写签名'}
                    {selectedMethod === 'nfc' && 'NFC签名'}
                  </h3>
                  <p className="text-gray-500 text-sm">请完成以下操作</p>
                </div>
              </div>
            </div>

            {/* 签名操作区域 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* 快速签名 */}
              {selectedMethod === 'quick' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">快速签名</h3>
                  <p className="text-gray-500">点击下方按钮即可完成签名</p>
                  <button
                    onClick={completeSignature}
                    className="w-full bg-[#ff5a5e] text-white py-4 px-6 rounded-2xl font-semibold text-lg
                               shadow-lg hover:bg-[#ff4449] transition-all duration-200 active:scale-95"
                  >
                    确认签名
                  </button>
                </div>
              )}

              {/* 个性化签名 */}
              {selectedMethod === 'custom' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">个性化签名</h3>
                    <p className="text-gray-500">自定义您的签名样式</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">选择头像</label>
                      <div className="flex space-x-3">
                        {['👤', '😊', '🌟', '💼', '🎯'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setCustomSignature(prev => ({ ...prev, avatar: emoji }))}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 
                              ${customSignature.avatar === emoji 
                                ? 'border-[#ff5a5e] bg-[#ff5a5e]/10' 
                                : 'border-gray-200 bg-gray-50'
                              }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">签名昵称</label>
                      <input
                        type="text"
                        value={customSignature.nickname}
                        onChange={(e) => setCustomSignature(prev => ({ ...prev, nickname: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#ff5a5e] focus:outline-none"
                        placeholder="输入您的昵称"
                      />
                    </div>
                    
                    {/* 签名预览 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-2">签名预览：</p>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <span className="text-2xl">{customSignature.avatar}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{customSignature.nickname}</div>
                          <div className="text-xs text-gray-500">{new Date().toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={completeSignature}
                    className="w-full bg-[#ff5a5e] text-white py-4 px-6 rounded-2xl font-semibold text-lg
                               shadow-lg hover:bg-[#ff4449] transition-all duration-200 active:scale-95"
                  >
                    确认个性化签名
                  </button>
                </div>
              )}

              {/* 语音签名 */}
              {selectedMethod === 'voice' && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl">🎤</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">语音签名</h3>
                    <p className="text-gray-500">请说出"我同意这份共识"来完成签名</p>
                  </div>
                  
                  {isRecording && (
                    <div className="text-center">
                      <div className="text-[#ff5a5e] font-semibold text-lg">录音中...</div>
                      <div className="text-sm text-gray-500">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 active:scale-95 ${
                        isRecording 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-[#ff5a5e] text-white hover:bg-[#ff4449]'
                      }`}
                    >
                      {isRecording ? '停止录音' : '开始录音'}
                    </button>
                    
                    {recordingTime > 0 && !isRecording && (
                      <button
                        onClick={completeSignature}
                        className="w-full bg-green-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg
                                   shadow-lg hover:bg-green-600 transition-all duration-200 active:scale-95"
                      >
                        确认语音签名
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 手写签名 */}
              {selectedMethod === 'handwrite' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">手写签名</h3>
                    <p className="text-gray-500">请在下方区域写下您的签名</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={150}
                      className="w-full h-32 bg-gray-50 rounded-lg cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={clearSignature}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium
                                 hover:bg-gray-200 transition-all duration-200"
                    >
                      重新签名
                    </button>
                    <button
                      onClick={completeSignature}
                      disabled={!hasSignature}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        hasSignature
                          ? 'bg-[#ff5a5e] text-white hover:bg-[#ff4449] active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      确认签名
                    </button>
                  </div>
                </div>
              )}

              {/* NFC签名 */}
              {selectedMethod === 'nfc' && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-[#ff5a5e]/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">NFC签名</h3>
                    <p className="text-gray-500">请将您的NFC设备靠近手机</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      等待NFC设备连接...
                    </p>
                  </div>
                  
                  <button
                    onClick={completeSignature}
                    className="w-full bg-[#ff5a5e] text-white py-4 px-6 rounded-2xl font-semibold text-lg
                               shadow-lg hover:bg-[#ff4449] transition-all duration-200 active:scale-95"
                  >
                    模拟NFC签名完成
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