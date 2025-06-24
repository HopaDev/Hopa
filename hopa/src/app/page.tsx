import Image from 'next/image';
import RecentImg from '@/assets/img/Recent-tran.png';
import BlurImg from '@/assets/img/Blur.png';

export default function Home() {
  return (
    <div className="p-6 font-[family-name:var(--font-geist-sans)] text-gray-800">
      <div className="fixed -z-10 top-1/3 left-0 -translate-x-1/2 -translate-y-1/2">
        <Image src={BlurImg} alt="blur background" />
      </div>
      <div className="fixed -z-10 top-3/4 right-0 translate-x-1/2 -translate-y-1/2">
        <Image src={BlurImg} alt="blur background" />
      </div>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">Hi, Julia !</h1>
        <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
      </header>

      <main>
        {/* 当前共识 Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">当前共识</h2>
          <div>
            <Image src={RecentImg} alt="当前共识" style={{ width: '100%', height: 'auto' }} />
          </div>
        </section>

        {/* 为你推荐 Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">为你推荐</h2>
            <span className="text-sm text-gray-500">查看更多</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md aspect-square"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md aspect-square"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md aspect-square"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md aspect-square"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
