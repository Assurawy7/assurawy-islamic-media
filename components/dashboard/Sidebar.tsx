"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen p-5 flex flex-col justify-between">
      <div>
        {/* Header / Brand */}
        <div className="mb-6">
          <h2 className="font-bold text-lg text-emerald-700">Assurawy</h2>
          {roleLabel && (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {roleLabel}
            </span>
          )}
        </div>

        {/* User Greeting (optional) */}
        {userName && (
          <p className="text-xs text-gray-500 mb-4 font-medium">
            Sannu, <span className="text-gray-800 font-bold">{userName}</span>
          </p>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}