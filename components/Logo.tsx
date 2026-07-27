"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [siteName, setSiteName] = useState("Assurawy");
  const [siteTagline, setSiteTagline] = useState("Islamic Media");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.siteName) setSiteName(data.siteName);
          if (data.siteTagline) setSiteTagline(data.siteTagline);
        }
      } catch (err) {
        console.error("Failed to fetch settings for Logo", err);
      }
    }
    loadSettings();
  }, []);

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Kyawawan akwatin Logo mai Round da Border din Zinare */}
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#D4AF37] bg-white p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
        <img
          src={logoUrl}
          alt={`${siteName} Logo`}
          className="h-full w-full rounded-full object-contain p-0.5"
        />
      </div>

      {/* Rubutun Gefen Logo (Dynamic) */}
      <div className="flex flex-col">
        <span className="font-serif text-lg font-bold tracking-wide text-slate-900 dark:text-white leading-tight">
          {siteName}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
          {siteTagline}
        </span>
      </div>
    </Link>
  );
}