"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HeaderActions() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("/logo.png");

  useEffect(() => {
    // 1. Tabbatar ko mutum yana ciki (Check Auth)
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(!!(data.user || data.id || data.email));
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
      }
    }

    // 2. Samo Logo URL daga DB Settings
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.logoUrl) setLogoUrl(data.logoUrl);
        }
      } catch (e) {
        console.error("Failed to fetch settings for header logo", e);
      }
    }

    checkAuth();
    fetchSettings();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
    router.push("/login");
    router.refresh();
  }

  // Yayin da yake duba status dinsa
  if (isLoggedIn === null) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        /* --- IDAN MUTUM YANA CIKI (LOGGED IN) --- */
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-slate-50 px-3 py-1.5 hover:bg-slate-100 transition-all shadow-sm"
          >
            {/* Dynamic Logo Container */}
            <div className="relative flex h-7 w-7 items-center justify-center shrink-0 rounded-full border border-[#D4AF37] bg-white p-0.5 shadow-inner overflow-hidden">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-slate-800">
              Dashboard
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold text-xs transition-all duration-200 shadow-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        /* --- IDAN MUTUM BA YA CIKI (NOT LOGGED IN) --- */
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-[#C5A059] transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all hidden sm:block"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}