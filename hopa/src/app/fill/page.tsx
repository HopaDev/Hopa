'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RadioQuestion, 
  CheckboxQuestion, 
  TextQuestion, 
  RangeQuestion, 
  DateQuestion,
  TimeQuestion 
} from '@/components/QuestionComponents';

export default function FillPage() {
  const router = useRouter();
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 目标类问题
    goal: '',
    cooperation: [],
    budget: '',
    timeline: '',
    priority: 3,
    
    // 规则类问题
    meetingTime: '',
    workHours: '',
    communication: [],
    
    // 边界性问题
    responsibilities: [],
    boundaries: '',
    
    // 激励性问题  
    rewards: [],
    celebration: '',
    
    // 仪式类问题
    rituals: []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // 简单验证
    const requiredFields = ['goal', 'budget', 'timeline'];
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
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">小组作业共识</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 问卷内容 */}
      <div className="px-4 py-6 pb-24">
        {/* 共识标题卡片 */}
        <div className="bg-gradient-to-r from-[#ff5a5e] to-[#ff8a5b] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <h2 className="text-xl font-bold">小组作业共识问卷</h2>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            请认真填写以下问题，帮助我们更好地制定小组作业的共识方案
          </p>
        </div>

        {/* 目标类问题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-[#ff5a5e] rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">目标设定</h3>
          </div>
          
          <TextQuestion
            question="1. 请简单描述一下你们小组的共同目标或期望？（简答）"
            value={formData.goal}
            onChange={(value) => handleInputChange('goal', value)}
            placeholder="请简述你们小组想要达成的目标..."
            multiline={true}
            required={true}
          />

          <CheckboxQuestion
            question="2. 你认为我们应该采用什么方式实现有效的小组协作？"
            options={[
              '1分工合作，各自负责',
              '5分协同作业',
              '定期会议讨论进展',
              '建立共享文档',
              '使用协作工具'
            ]}
            values={formData.cooperation}
            onChange={(values) => handleInputChange('cooperation', values)}
          />

          <TextQuestion
            question="3. 项目预计投入资源？"
            value={formData.budget}
            onChange={(value) => handleInputChange('budget', value)}
            placeholder="如：0 - 10h，或具体金额"
            required={true}
          />
        </div>

        {/* 时间规划类问题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-[#ff5a5e] rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">时间规划</h3>
          </div>

          <TimeQuestion
            question="4. 以下哪个时间段你一般容易参与讨论？（多选）"
            value={formData.meetingTime}
            onChange={(value) => handleInputChange('meetingTime', value)}
          />

          <DateQuestion
            question="5. 项目截止日期"
            value={formData.timeline}
            onChange={(value) => handleInputChange('timeline', value)}
            required={true}
          />
        </div>

        {/* 协作规则类问题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-[#ff5a5e] rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">协作规则</h3>
          </div>

          <CheckboxQuestion
            question="6. 清单了学的工作时传主要思考哪些因素？（多选）"
            options={[
              '课业任务繁重度',
              '室友/家庭沟通压力',
              '习惯做事处理等需求量',
              '其他个人安排'
            ]}
            values={formData.communication}
            onChange={(values) => handleInputChange('communication', values)}
          />

          <CheckboxQuestion
            question="7. 你认为团队协作需要，需要制定哪些基本的工作进度？（多选）"
            options={[
              '按时/钟表完成',
              '项目快速有序管理',
              '设计/规格书沟通规则',
              '习惯内容与过程管理'
            ]}
            values={formData.responsibilities}
            onChange={(values) => handleInputChange('responsibilities', values)}
          />
        </div>

        {/* 优先级设定 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-[#ff5a5e] rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">优先级设定</h3>
          </div>

          <RangeQuestion
            question="8. 对于整体进度管理关注，我们计划管理层级多少个百分点？"
            min={1}
            max={5}
            value={formData.priority}
            onChange={(value) => handleInputChange('priority', value)}
            labels={['1分', '2分', '3分', '4分', '5分']}
          />
        </div>

        {/* 激励机制 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-[#ff5a5e] rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">激励机制</h3>
          </div>

          <CheckboxQuestion
            question="9. 如果后这个作业项目完成，你期待怎么庆祝方式？"
            options={[
              '聚餐/聚会',
              '小礼品交换',
              '经验总结分享会',
              '放松娱乐活动',
              '其他'
            ]}
            values={formData.rewards}
            onChange={(values) => handleInputChange('rewards', values)}
          />

          <TextQuestion
            question="10. 你认为共识项目的资源分担制度建议？（填空）"
            value={formData.celebration}
            onChange={(value) => handleInputChange('celebration', value)}
            placeholder="请描述你的建议..."
            multiline={true}
          />
        </div>

        {/* 其他建议 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-[#ff5a5e] rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">其他建议</h3>
          </div>

                     <CheckboxQuestion
             question="11. 当有争议时，你希望运用哪种解决方式？（多选）"
             options={[
               '民主投票',
               '专人协调调解集中讨论会',
               '小组长决定',
               '开放委员中心',
               '其他'
             ]}
             values={formData.rituals}
             onChange={(values) => handleInputChange('rituals', values)}
           />
        </div>

        {/* 提交按钮 */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#ff5a5e] text-white py-4 px-6 rounded-2xl font-semibold text-lg
                       shadow-lg hover:bg-[#ff4449] transition-all duration-200 active:scale-95"
          >
            完成填写，进入签名认证
          </button>
        </div>
      </div>

      {/* 右下角语音按钮 */}
      <button className="fixed bottom-8 right-6 w-14 h-14 bg-[#ff5a5e] rounded-full shadow-lg
                         flex items-center justify-center z-20
                         hover:bg-[#ff4449] transition-all duration-200 active:scale-90">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      </button>

      {/* 进度指示器 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>填写进度</span>
          <span>11/11 题</span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#ff5a5e] rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}