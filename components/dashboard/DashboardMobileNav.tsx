"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Trophy, User } from "lucide-react";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

/**
 * Fixed bottom tab bar on mobile (the dashboard previously had zero
 * navigation of its own — /dashboard/leaderboard and /dashboard/profile
 * existed but weren't linked from anywhere except a dropdown menu).
 * Hidden on desktop (sm:hidden) since desktop users have the main site
 * navbar plus the DashboardUserMenu dropdown.
 */
export default function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-deep/10 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_-8px_rgba(14,59,46,0.15)] sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`focus-ring flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
              active ? "text-emerald" : "text-ink/40"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "scale-105" : ""} transition-transform`} strokeWidth={active ? 2.4 : 2} />
            {label}
            {active && <span className="mt-0.5 h-1 w-1 rounded-full bg-gold" />}
          </Link>
        );
      })}
    </nav>
  );
}
