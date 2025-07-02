'use client';

import { useState } from 'react';

// 单选题组件
export function RadioQuestion({ 
  question, 
  options, 
  value, 
  onChange,
  required = false 
}: {
  question: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-2 mb-4">
        <span className="text-[#ff5a5e] font-semibold text-sm">单选</span>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      <h3 className="text-gray-900 font-medium mb-4 leading-relaxed">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onChange(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${value === option 
                ? 'border-[#ff5a5e] bg-[#ff5a5e]/5' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${value === option 
                  ? 'border-[#ff5a5e] bg-[#ff5a5e]' 
                  : 'border-gray-300'
                }`}
              >
                {value === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm ${value === option ? 'text-[#ff5a5e] font-medium' : 'text-gray-700'}`}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 多选题组件
export function CheckboxQuestion({ 
  question, 
  options, 
  values = [], 
  onChange,
  required = false 
}: {
  question: string;
  options: string[];
  values?: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}) {
  const handleToggle = (option: string) => {
    const newValues = values.includes(option)
      ? values.filter(v => v !== option)
      : [...values, option];
    onChange(newValues);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-2 mb-4">
        <span className="text-[#ff5a5e] font-semibold text-sm">多选</span>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      <h3 className="text-gray-900 font-medium mb-4 leading-relaxed">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleToggle(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${values.includes(option) 
                ? 'border-[#ff5a5e] bg-[#ff5a5e]/5' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center
                ${values.includes(option) 
                  ? 'border-[#ff5a5e] bg-[#ff5a5e]' 
                  : 'border-gray-300'
                }`}
              >
                {values.includes(option) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${values.includes(option) ? 'text-[#ff5a5e] font-medium' : 'text-gray-700'}`}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 填空题组件
export function TextQuestion({ 
  question, 
  value, 
  onChange, 
  placeholder = "请输入你的答案...",
  multiline = false,
  required = false 
}: {
  question: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-2 mb-4">
        <span className="text-[#ff5a5e] font-semibold text-sm">填空</span>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      <h3 className="text-gray-900 font-medium mb-4 leading-relaxed">{question}</h3>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none
                     focus:border-[#ff5a5e] focus:outline-none focus:ring-0
                     bg-gray-50 text-gray-900 placeholder-gray-500
                     transition-colors duration-200"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 border-2 border-gray-200 rounded-xl
                     focus:border-[#ff5a5e] focus:outline-none focus:ring-0
                     bg-gray-50 text-gray-900 placeholder-gray-500
                     transition-colors duration-200"
        />
      )}
    </div>
  );
}

// 范围选择组件
export function RangeQuestion({ 
  question, 
  min = 1, 
  max = 5, 
  value, 
  onChange,
  labels = [],
  required = false 
}: {
  question: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  labels?: string[];
  required?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-2 mb-4">
        <span className="text-[#ff5a5e] font-semibold text-sm">范围</span>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      <h3 className="text-gray-900 font-medium mb-6 leading-relaxed">{question}</h3>
      
      <div className="px-2">
        {/* 范围标签 */}
        <div className="flex justify-between mb-4">
          {labels.length > 0 ? (
            labels.map((label, index) => (
              <span key={index} className="text-xs text-gray-500 text-center flex-1">
                {label}
              </span>
            ))
          ) : (
            <>
              <span className="text-xs text-gray-500">{min}</span>
              <span className="text-xs text-gray-500">{max}</span>
            </>
          )}
        </div>
        
        {/* 滑块 */}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-white
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:border-2
                       [&::-webkit-slider-thumb]:border-[#ff5a5e]
                       [&::-moz-range-thumb]:w-6
                       [&::-moz-range-thumb]:h-6
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-white
                       [&::-moz-range-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:border-2
                       [&::-moz-range-thumb]:border-[#ff5a5e]"
            style={{
              background: `linear-gradient(to right, #ff5a5e 0%, #ff8a5b ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
            }}
          />
        </div>
        
        {/* 当前值显示 */}
        <div className="relative mt-4">
          <div 
            className="absolute transform -translate-x-1/2" 
            style={{ left: `${((value - min) / (max - min)) * 100}%` }}
          >
            <div className="bg-[#ff5a5e] text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 日期选择组件
export function DateQuestion({ 
  question, 
  value, 
  onChange,
  required = false 
}: {
  question: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-2 mb-4">
        <span className="text-[#ff5a5e] font-semibold text-sm">日期</span>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      <h3 className="text-gray-900 font-medium mb-4 leading-relaxed">{question}</h3>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl
                     focus:border-[#ff5a5e] focus:outline-none focus:ring-0
                     bg-gray-50 text-gray-900
                     transition-colors duration-200
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer
                     [&::-webkit-calendar-picker-indicator]:opacity-70"
        />
      </div>
    </div>
  );
}

// 时间选择组件
export function TimeQuestion({ 
  question, 
  value, 
  onChange,
  required = false 
}: {
  question: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-2 mb-4">
        <span className="text-[#ff5a5e] font-semibold text-sm">时间</span>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
      <h3 className="text-gray-900 font-medium mb-4 leading-relaxed">{question}</h3>
      <div className="relative">
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl
                     focus:border-[#ff5a5e] focus:outline-none focus:ring-0
                     bg-gray-50 text-gray-900
                     transition-colors duration-200
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer
                     [&::-webkit-calendar-picker-indicator]:opacity-70"
        />
      </div>
    </div>
  );
} 