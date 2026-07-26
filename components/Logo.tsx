import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-[#1B2A4A] p-1 border border-[#D4AF37]/40 shadow-sm group-hover:border-[#D4AF37] transition-all shrink-0 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Assurawy Logo"
          width={36}
          height={36}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col">
        <span className="font-serif text-lg font-bold tracking-wide text-slate-900 dark:text-white leading-tight">
          Assurawy
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
          Qur'an Academy
        </span>
      </div>
    </Link>
  );
}