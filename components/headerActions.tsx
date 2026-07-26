"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeaderActions() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="text-xs font-semibold text-slate-700 hover:text-[#C5A059] transition-colors px-2 py-1.5"
      >
        Dashboard
      </Link>

      <Link
        href="/login"
        className="text-xs font-semibold text-slate-700 hover:text-[#C5A059] transition-colors px-2 py-1.5"
      >
        Sign In
      </Link>

      <button
        onClick={handleLogout}
        className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold text-xs transition-all duration-200 shadow-sm"
      >
        Logout
      </button>

      <Link
        href="/register"
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity hidden sm:block"
      >
        Get Started
      </Link>
    </div>
  );
}