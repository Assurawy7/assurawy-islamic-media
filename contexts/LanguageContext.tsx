"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Lang, RTL_LANGS } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  isRtl: boolean;
  t: (key: string) => string;
  setLanguage: (lang: Lang) => void;
  changing: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);
  const [changing, setChanging] = useState(false);

  const dict = useMemo(() => getDictionary(lang), [lang]);
  const t = useCallback((key: string) => dict[key] ?? key, [dict]);

  const setLanguage = useCallback(
    (next: Lang) => {
      if (next === lang) return;
      setLang(next); // optimistic — switches immediately, no flash of old language
      setChanging(true);
      document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: next }),
      })
        .catch(() => {
          // Non-fatal — the cookie already persisted the choice for this
          // browser even if saving it to the user's account failed.
        })
        .finally(() => {
          setChanging(false);
          // Re-run server components (root layout, nav, footer) with the
          // new cookie so server-rendered chrome matches immediately.
          router.refresh();
        });
    },
    [lang, router]
  );

  const value = useMemo(
    () => ({ lang, isRtl: (RTL_LANGS as readonly string[]).includes(lang), t, setLanguage, changing }),
    [lang, t, setLanguage, changing]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
