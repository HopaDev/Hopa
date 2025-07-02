interface UserMessageProps {
  message: string;
}

export default function UserMessage({ message }: UserMessageProps) {
  return (    <div className="flex justify-end mb-4 px-4">
      <div className="relative max-w-[70%]">
        {/* 用户消息气泡三角形 */}
        <div className="absolute right-0 top-3 transform translate-x-full z-10">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-[#FF6F4B]"></div>
        </div>
        <div className="bg-[#FF6F4B] text-white p-3 rounded-2xl rounded-tr-none">
          <p className="text-base">{message}</p>
        </div>
      </div>
    </div>
  );
}
