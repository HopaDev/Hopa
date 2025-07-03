'use client';

import Image from 'next/image';
import MachineImg from '../../assets/img/result/machine.png';
import MachineLayerImg from '../../assets/img/result/machine_layer.png';
import BackgroundImg from '../../assets/img/result/background.png';

export default function ResultPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={BackgroundImg}
          alt="背景图片"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Machine 图片 - 底层 */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <Image
          src={MachineImg}
          alt="机器图片"
          width={0}
          height={0}
          className="w-full h-auto"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* Machine Layer 图片 - 顶层 */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <Image
          src={MachineLayerImg}
          alt="机器图层"
          width={0}
          height={0}
          className="w-full h-auto"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}