"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardUserMenu({
  userName,
  avatarUrl,
}: {
  userName: string;
  avatarUrl: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initialLetter = (userName || "A").charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-emerald/20 bg-emerald/10 shadow-sm transition hover:scale-105 focus:outline-none"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-xl font-semibold text-emerald">
            {initialLetter}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 py-1 z-50 text-slate-800">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs text-slate-500">Sannu da zuwa,</p>
            <p className="text-sm font-semibold truncate text-slate-900">{userName}</p>
          </div>

          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 transition"
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>Profile Page</span>
          </Link>

          <Link
            href="/dashboard/leaderboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 transition"
          >
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Leaderboard</span>
          </Link>

          <Link
            href="/dashboard/profile?tab=settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 transition"
          >
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Settings</span>
          </Link>

          <div className="border-t border-slate-100 my-1"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}