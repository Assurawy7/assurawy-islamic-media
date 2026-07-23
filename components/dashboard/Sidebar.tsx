"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export type NavItem = { href: string; label: string; icon: string };

export default function Sidebar({
  items,
  roleLabel,
  userName,
}: {
  items: NavItem[];
  roleLabel: string;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const isActive = (href: string) =>
    href === "/admin" || href === "/teacher" ? pathname === href : pathname.startsWith(href);

  const NavList = (
    <nav className="flex-1 space-y-1 px-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            isActive(item.href)
              ? "bg-gold/15 text-deep"
              : "text-cream/80 hover:bg-white/5 hover:text-gold"
          }`}
        >
          <span aria-hidden className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="flex items-center justify-between bg-deep px-4 py-3 text-cream lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="focus-ring rounded-lg p-1.5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-display text-sm font-semibold text-gold">
          Assurawy · {roleLabel}
        </span>
        <div className="h-8 w-8 rounded-full bg-emerald/20 text-center text-sm leading-8 text-emerald">
          {userName.charAt(0)}
        </div>
      </div>

      {/* Mobile drawer + overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="relative flex h-full w-72 flex-col bg-deep py-5 text-cream">
            <div className="mb-4 flex items-center justify-between px-4">
              <span className="font-display text-lg font-semibold text-gold">Assurawy</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="focus-ring rounded-lg p-1.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {NavList}
            <div className="mt-4 border-t border-cream/10 px-4 pt-4">
              <p className="text-xs text-cream/60">{roleLabel}</p>
              <p className="truncate text-sm font-medium">{userName}</p>
              <button
                onClick={handleLogout}
                className="focus-ring mt-3 w-full rounded-full border border-cream/25 px-4 py-2 text-xs font-semibold hover:border-gold hover:text-gold"
              >
                Log Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col bg-deep py-6 text-cream lg:flex">
        <div className="mb-6 px-4">
          <span className="font-display text-lg font-semibold text-gold">Assurawy</span>
          <p className="text-xs text-cream/60">{roleLabel} Dashboard</p>
        </div>
        {NavList}
        <div className="mt-4 border-t border-cream/10 px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/20 text-sm text-emerald">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="text-xs text-cream/50">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="focus-ring mt-3 w-full rounded-full border border-cream/25 px-4 py-2 text-xs font-semibold hover:border-gold hover:text-gold"
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
