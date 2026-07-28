"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  items?: NavItem[];
  roleLabel?: string;
  userName?: string;
}

const defaultItems: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Live Classes", href: "/live-classes" },
  { label: "Calendar", href: "/live-classes/calendar" },
];

export default function Sidebar({
  items = defaultItems,
  roleLabel,
  userName,
}: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navContent = (
    <>
      <div className="mb-6">
        <h2 className="font-bold text-lg text-emerald-700">Assurawy</h2>
        {roleLabel && (
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
            {roleLabel}
          </span>
        )}
      </div>

      {userName && (
        <p className="text-xs text-gray-500 mb-4 font-medium">
          Sannu, <span className="text-gray-800 font-bold">{userName}</span>
        </p>
      )}

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger — only shown below lg */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4 lg:hidden">
        <span className="font-bold text-emerald-700">
          Assurawy{roleLabel ? ` · ${roleLabel}` : ""}
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="focus-ring rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="animate-in fade-in duration-150 absolute inset-0 bg-deep/40 backdrop-blur-sm"
          />
          <aside className="animate-in slide-in-from-top-1 duration-150 absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col justify-between bg-white p-5 shadow-2xl">
            <div>{navContent}</div>
            <button
              onClick={() => setOpen(false)}
              className="focus-ring mt-4 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </aside>
        </div>
      )}

      {/* Static sidebar — desktop only */}
      <aside className="hidden w-64 min-h-screen border-r border-gray-100 bg-white p-5 lg:flex lg:flex-col lg:justify-between">
        <div>{navContent}</div>
      </aside>
    </>
  );
}