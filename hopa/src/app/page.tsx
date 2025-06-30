import Image from 'next/image';
import Link from 'next/link';
import BackgroundOrange from '@/assets/img/home/background_orange.png';
import BackgroundWhite from '@/assets/img/home/background_white.png';
import Avatar from '@/assets/img/home/avator.png';
import Settings from '@/assets/img/home/settings.png';
import Face from '@/assets/img/home/face.png';
import LaunchButton from '@/assets/img/home/launch_botton.png';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden relative">
      {/* 橙色背景 - 页面顶部 */}
      <div className="absolute top-0 left-0 w-full z-0">
        <Image 
          src={BackgroundOrange} 
          alt="orange background" 
          width={0}
          height={0}
          className="w-full h-auto"
          sizes="100vw"
          priority
        />
      </div>
      
      {/* 白色背景 - 页面底部，确保不覆盖导航栏 */}
      <div className="absolute bottom-0 left-0 w-full z-1">
        <Image 
          src={BackgroundWhite} 
          alt="white background" 
          width={0}
          height={0}
          className="w-full h-auto"
          sizes="100vw"
        />
        
        {/* Launch Button - 白色背景顶部下方3px */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-3/4">
          <Link href="/launch">
            <Image 
              src={LaunchButton} 
              alt="launch button" 
              width={0}
              height={0}
              className="w-full h-auto cursor-pointer hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>

      {/* 头像 - 左上角 */}
      <div className="absolute top-5 left-3 z-10">
        <Image 
          src={Avatar} 
          alt="avatar" 
          width={60}
          height={60}
          className="w-15 h-15"
        />
        {/* 文字 - 头像下方 */}
        <div className="mt-2 ml-4 text-gray-600 text-base font-alimama">
          <div>Hi, Julia!</div>
          <div>今天有什么计划？</div>
        </div>
      </div>

      {/* 设置 - 右上角 */}
      <div className="absolute top-8 right-6 z-10">
        <Image 
          src={Settings} 
          alt="settings" 
          width={40}
          height={40}
          className="w-6 h-6"
        />
      </div>

      {/* Face - left-10 top-5 */}
      <div className="absolute left-15 top-6 z-1">
        <Image 
          src={Face} 
          alt="face" 
          width={0}
          height={0}
          className="w-32 h-auto"
        />
      </div>
    </div>
  );
}
