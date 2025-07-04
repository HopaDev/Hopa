'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RadioQuestion, 
  CheckboxQuestion, 
  TextQuestion, 
  RangeQuestion, 
  DateQuestion,
  TimeQuestion 
} from '@/components/QuestionComponents';
import BackArrowPNG from '../../assets/img/launch/back_arrow.png';
import Image from 'next/image';

export default function FillPage() {
  const router = useRouter();
  
  // 基于case.json小组作业模板的表单数据状态
  const [formData, setFormData] = useState({
    // 目标设定
    qualityGoal: '',
    investmentLevel: 3,
    timeRange: { min: 0, max: 20 },
    availableTime: [],
    skills: '',
    
    // 分工职责
    primaryRole: '',
    secondaryRoles: [],
    
    // 时间管理
    draftDays: 3,
    noticeTime: '',
    inactiveHandling: '',
    
    // 协作规范
    unifiedStyle: [],
    conflictResolution: '',
    overtimeAcceptance: 3,
    
    // 仪式感
    closingMethods: [],
    boundaries: ''
  });

  // 页面加载时恢复保存的数据
  useEffect(() => {
    const savedData = localStorage.getItem('consensusFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('恢复表单数据失败:', error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    
    // 自动保存到本地存储
    localStorage.setItem('consensusFormData', JSON.stringify(updatedData));
  };

  const handleRangeChange = (field: string, type: 'min' | 'max', value: number) => {
    const updatedData = {
      ...formData,
      [field]: {
        ...formData[field as keyof typeof formData] as { min: number; max: number },
        [type]: value
      }
    };
    setFormData(updatedData);
    
    // 自动保存到本地存储
    localStorage.setItem('consensusFormData', JSON.stringify(updatedData));
  };

  const handleSubmit = () => {
    // 简单验证
    const requiredFields = ['qualityGoal', 'skills', 'primaryRole'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('请填写所有必填项');
      return;
    }
    
    // 保存到本地存储
    localStorage.setItem('consensusFormData', JSON.stringify(formData));
    
    // 跳转到签名页面
    router.push('/sign');
  };

  

  return (
    <>
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-7 z-50"
      >
        <Image
          src={BackArrowPNG}
          alt="back arrow"
          width={15}
        />
      </button>
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 头部 */}


      {/* 问卷内容 */}
      <div className="px-4 py-6 pb-32">
        {/* 共识标题卡片 */}
        {/*  下拉后卡片始终显示在顶部 */}
        <div className="fixed bg-gradient-to-r from-[#ff5a5e] via-[#ff6b4a] to-[#ff8a5b] rounded-3xl px-6 py-3 pb-6 mb-6 mt-10 text-white shadow-lg z-40">
          <div className="flex items-center space-x-3 mb-3 text-align-middle justify-center">
            <h2 className="text-xl font-bold">小组作业共识模板</h2>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            适用于2-6人参与的小组协作任务，在任务开始前明确目标、分工、规则与边界，提高协作效率和完成度
          </p>
        </div>

        {/* 目标设定 */}
        <div className="mt-45 mb-8 align-middle items-center justify-center">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-[#ff5a5e] to-[#ff8a5b] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">目标设定</h3>
          </div>
          
          <RadioQuestion
            question="1. 我们对本次小组作业的完成质量目标是？"
            options={[
              "达到课程基本要求即可",
              "稍有创新，有亮点", 
              "追求展示级别作品（争取评优）"
            ]}
            value={formData.qualityGoal}
            onChange={(value) => handleInputChange('qualityGoal', value)}
            required={true}
          />

          <RangeQuestion
            question="2. 你期望我们完成这次作业时的整体投入程度为？"
            min={1}
            max={5}
            value={formData.investmentLevel}
            onChange={(value) => handleInputChange('investmentLevel', value)}
            labels={['轻松', '一般', '认真', '努力', '全力以赴']}
          />

          {/* 时间范围选择 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-start space-x-2 mb-4">
              <span className="text-[#ff5a5e] font-semibold text-sm">范围</span>
              <span className="text-red-500 text-sm">*</span>
            </div>
            <h3 className="text-gray-900 font-medium mb-6 leading-relaxed">
              3. 你可以投入的总时间段为？（小时）
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">最少时间</label>
                <div className="px-2">
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={formData.timeRange.min}
                    onChange={(e) => {
                      const newMin = Number(e.target.value);
                      // 确保最少时间不超过最多时间
                      if (newMin <= formData.timeRange.max) {
                        handleRangeChange('timeRange', 'min', newMin);
                      }
                    }}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-6
                               [&::-webkit-slider-thumb]:h-6
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-white
                               [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:shadow-lg
                               [&::-webkit-slider-thumb]:border-2
                               [&::-webkit-slider-thumb]:border-[#ff5a5e]"
                    style={{
                      background: `linear-gradient(to right, #ff5a5e 0%, #ff8a5b ${(formData.timeRange.min / 30) * 100}%, #e5e7eb ${(formData.timeRange.min / 30) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0小时</span>
                    <span>30小时</span>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="bg-[#ff5a5e] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {formData.timeRange.min}小时
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">最多时间</label>
                <div className="px-2">
                  <input
                    type="range"
                    min={formData.timeRange.min}
                    max={50}
                    value={formData.timeRange.max}
                    onChange={(e) => {
                      const newMax = Number(e.target.value);
                      // 确保最多时间不少于最少时间
                      if (newMax >= formData.timeRange.min) {
                        handleRangeChange('timeRange', 'max', newMax);
                      }
                    }}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-6
                               [&::-webkit-slider-thumb]:h-6
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-white
                               [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:shadow-lg
                               [&::-webkit-slider-thumb]:border-2
                               [&::-webkit-slider-thumb]:border-[#ff8a5b]"
                    style={{
                      background: `linear-gradient(to right, #ff5a5e 0%, #ff8a5b ${((formData.timeRange.max - formData.timeRange.min) / (50 - formData.timeRange.min)) * 100}%, #e5e7eb ${((formData.timeRange.max - formData.timeRange.min) / (50 - formData.timeRange.min)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formData.timeRange.min}小时</span>
                    <span>50小时</span>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="bg-[#ff8a5b] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {formData.timeRange.max}小时
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                  时间范围：<span className="font-semibold text-[#ff5a5e]">{formData.timeRange.min} - {formData.timeRange.max}小时</span>
                </p>
              </div>
            </div>
          </div>

          <CheckboxQuestion
            question="4. 以下哪些时间段你一般有空参与讨论？"
            options={[
              "工作日晚上（19:00–22:00）",
              "周六全天",
              "周日全天", 
              "午休时间（12:00–14:00）",
              "临时协商"
            ]}
            values={formData.availableTime}
            onChange={(values) => handleInputChange('availableTime', values)}
          />

          <TextQuestion
            question="5. 请简要介绍你擅长的方向或想参与的部分"
            value={formData.skills}
            onChange={(value) => handleInputChange('skills', value)}
            placeholder="如：擅长编程、文案写作、设计排版、数据分析等..."
            multiline={true}
            required={true}
          />
        </div>

        {/* 分工职责 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-[#ff5a5e] to-[#ff8a5b] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">分工职责</h3>
          </div>

          <RadioQuestion
            question="6. 请从下列分工中选择你主要愿意承担的角色"
            options={[
              "技术/代码实现",
              "资料调研与内容撰写",
              "设计/排版与展示",
              "沟通协调与进度管理",
              "不确定，待讨论"
            ]}
            value={formData.primaryRole}
            onChange={(value) => handleInputChange('primaryRole', value)}
            required={true}
          />

          <CheckboxQuestion
            question="7. 如需承担次要职责，请选择你可接受的备选角色"
            options={[
              "技术/代码实现",
              "资料调研与内容撰写", 
              "设计/排版与展示",
              "沟通协调与进度管理"
            ]}
            values={formData.secondaryRoles}
            onChange={(values) => handleInputChange('secondaryRoles', values)}
          />
        </div>

        {/* 时间管理 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-[#ff5a5e] to-[#ff8a5b] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">时间管理</h3>
          </div>

          <RangeQuestion
            question="8. 对于最终成果提交前，我们应该提前多少天完成初稿？"
            min={1}
            max={10}
            value={formData.draftDays}
            onChange={(value) => handleInputChange('draftDays', value)}
            labels={['1天', '3天', '5天', '7天', '10天']}
          />

          <RadioQuestion
            question="9. 你能接受的最晚开会通知提前时间是？"
            options={[
              "不限，随叫随到",
              "至少提前半天",
              "至少提前一天",
              "至少提前两天"
            ]}
            value={formData.noticeTime}
            onChange={(value) => handleInputChange('noticeTime', value)}
          />

          <RadioQuestion
            question="10. 如果组内有成员长时间不参与，我们的处理方式是？"
            options={[
              "私下提醒，不公开处理",
              "组内公示提醒一次，仍无改进将减少分工任务",
              "报告老师，要求替换或说明情况",
              "暂无共识，事后再议"
            ]}
            value={formData.inactiveHandling}
            onChange={(value) => handleInputChange('inactiveHandling', value)}
          />
        </div>

        {/* 协作规范 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-[#ff5a5e] to-[#ff8a5b] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">协作规范</h3>
          </div>

          <CheckboxQuestion
            question="11. 你希望本次作业有统一风格的部分包括哪些？"
            options={[
              "报告语言风格",
              "PPT配色/排版",
              "作品命名/文件组织方式",
              "表达方式（用图、演示、视频等）",
              "无所谓"
            ]}
            values={formData.unifiedStyle}
            onChange={(values) => handleInputChange('unifiedStyle', values)}
          />

          <RadioQuestion
            question="12. 当有争议时，你更倾向于通过哪种方式解决？"
            options={[
              "投票",
              "顺从少数人中最愿意行动的意见",
              "听取AI辅助建议",
              "开会集中讨论",
              "无偏好"
            ]}
            value={formData.conflictResolution}
            onChange={(value) => handleInputChange('conflictResolution', value)}
          />

          <RangeQuestion
            question="13. 你对出现突发任务加班的接受度？"
            min={1}
            max={5}
            value={formData.overtimeAcceptance}
            onChange={(value) => handleInputChange('overtimeAcceptance', value)}
            labels={['完全不能接受', '不太能接受', '一般', '比较能接受', '完全没问题']}
          />
        </div>

        {/* 仪式感与收尾 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-[#ff5a5e] to-[#ff8a5b] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">仪式感与收尾</h3>
          </div>

          <CheckboxQuestion
            question="14. 你认同通过什么方式为本次作业收尾？"
            options={[
              "成果展示/打卡截图",
              "成员互评",
              "小仪式/共创纪念图卡",
              "总结文档",
              "无需特别收尾"
            ]}
            values={formData.closingMethods}
            onChange={(values) => handleInputChange('closingMethods', values)}
          />

          <TextQuestion
            question="15. 你有任何特别的边界或说明要提前告知大家的吗？"
            value={formData.boundaries}
            onChange={(value) => handleInputChange('boundaries', value)}
            placeholder="如：特殊作息、技能限制、沟通偏好等..."
            multiline={true}
          />
        </div>

        {/* 提交按钮 */}
        <div className="mt-12">
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#ff5a5e] via-[#ff6b4a] to-[#ff8a5b] text-white py-5 px-6 rounded-3xl font-bold text-lg
                       shadow-xl shadow-[#ff5a5e]/30 hover:shadow-2xl hover:shadow-[#ff5a5e]/40 
                       hover:scale-[1.02] transition-all duration-300 active:scale-95"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>完成填写，进入签名认证</span>
              <span className="text-xl">✨</span>
            </span>
          </button>
        </div>
      </div>

      {/* 进度指示器 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">填写进度</span>
          <span className="font-bold text-[#ff5a5e]">15/15 题</span>
        </div>
        <div className="h-3 mb-5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ff5a5e] to-[#ff8a5b] rounded-full transition-all duration-500" 
               style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
    </>
  );
}