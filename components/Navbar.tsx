"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/quran-academy", label: "Qur'an Academy" },
  { href: "/articles", label: "Articles" },
  { href: "/teachers", label: "Teachers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-deep text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-wide text-gold">
            Assurawy
          </span>
          <span className="hidden font-display text-xl font-semibold tracking-wide sm:inline">
            Islamic Media
          </span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="focus-ring text-sm font-medium text-cream/85 transition hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="focus-ring text-sm font-medium text-cream/85 hover:text-gold"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="focus-ring rounded-full bg-gold px-5 py-2 text-sm font-semibold text-deep transition hover:bg-goldLight"
          >
            Register Now
          </Link>
        </div>

        <button
          className="focus-ring lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-cream/10 bg-deep px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-2 py-3 text-base font-medium text-cream/90 hover:bg-white/5 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="focus-ring flex-1 rounded-full border border-cream/30 px-4 py-2.5 text-center text-sm font-medium text-cream"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="focus-ring flex-1 rounded-full bg-gold px-4 py-2.5 text-center text-sm font-semibold text-deep"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
