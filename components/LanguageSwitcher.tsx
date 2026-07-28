"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGS, LANG_LABELS } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLanguage, changing } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={changing}
        className="focus-ring flex items-center gap-1.5 rounded-full border border-deep/15 px-3 py-1.5 text-xs font-semibold text-deep transition hover:border-gold disabled:opacity-60"
        aria-label="Change language"
        aria-expanded={open}
      >
        🌐 {LANG_LABELS[lang]}
        <span className="text-[10px]">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-36 overflow-hidden rounded-xl border border-deep/10 bg-white py-1 shadow-card animate-in fade-in slide-in-from-top-1 duration-150">
          {SUPPORTED_LANGS.map((code) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-cream ${
                code === lang ? "font-semibold text-emerald" : "text-ink/70"
              }`}
            >
              {LANG_LABELS[code]}
              {code === lang && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
