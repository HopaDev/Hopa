"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavButtonProps {
  href: string;
  imgSrc: any;
  text: string;
}

export default function NavButton({ href, imgSrc, text }: NavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex flex-col items-center text-gray-700 hover:text-blue-600 transition-all duration-300 w-1/3 py-2 rounded-full ${isActive ? 'scale-110' : ''}`}>
      <Image src={imgSrc} alt={text} width={24} height={24} />
      <span className="text-sm">{text}</span>
    </Link>
  );
}
