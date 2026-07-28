import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Fira_Code, Cinzel, Amiri } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import HeaderActions from "@/components/headerActions";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { isSupportedLang, type Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 1. Primary Sans Font
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

// 2. Serif Font
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap"
});

// 3. Monospace Code Font
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

// 4. Modern Display Font
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap"
});

// 5. Arabic / Calligraphy Font
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assurawy | Premier Islamic & Qur'an Academy",
  description: "Authentic Qur'anic studies, Tajweed, Tafseer, and classical Islamic learning for discerning students.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Assurawy",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E3B2E",
};

import { getDictionary } from "@/lib/i18n";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    const db = prisma as any;
    settings = await db.siteSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Error loading layout settings:", error);
  }

  const primaryColor = settings?.primaryColor || "#D4AF37";

  // Language priority: explicit cookie choice (set by LanguageSwitcher) >
  // the logged-in user's saved preference > the admin's site-wide default.
  const cookieLang = cookies().get("lang")?.value;
  let resolvedLang: string | undefined = isSupportedLang(cookieLang) ? cookieLang : undefined;

  if (!resolvedLang) {
    const session = await getSession();
    if (session) {
      const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { language: true } });
      if (isSupportedLang(user?.language)) resolvedLang = user!.language;
    }
  }

  const defaultLang: Lang = (resolvedLang as Lang) || (isSupportedLang(settings?.defaultLanguage) ? settings.defaultLanguage : "ha");
  const isRtl = defaultLang === "ar";

  const t = getDictionary(defaultLang);

  return (
    <html 
      lang={defaultLang} 
      dir={isRtl ? "rtl" : "ltr"} 
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${firaCode.variable} ${cinzel.variable} ${amiri.variable} scroll-smooth`}
      style={{ "--primary-color": primaryColor } as React.CSSProperties}
    >
      <body 
        suppressHydrationWarning
        className="font-sans text-slate-800 bg-slate-50 antialiased min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900"
      >
        <ServiceWorkerRegister />
        <LanguageProvider initialLang={defaultLang}>

        {/* 1. TOP ANNOUNCEMENT BAR */}
        <div className="bg-gradient-to-r from-slate-100 via-amber-50 to-slate-100 border-b border-slate-200/80 text-[11px] font-medium tracking-wider">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-between">
            <p className="hidden md:flex items-center gap-2 text-slate-600">
              <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse bg-primary" />
              <span>{t.slogan}</span>
            </p>
            <p className="mx-auto md:mx-0 font-bold text-sm tracking-normal text-primary font-arabic">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <div className="hidden md:flex items-center gap-6 text-slate-500">
              <Link href="/dashboard" className="hover:text-primary transition-colors duration-200 font-medium">
                {t.dashboard}
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors duration-200 font-medium">
                {t.support}
              </Link>
            </div>
          </div>
        </div>

        {/* 2. MAIN LIGHT NAVBAR */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative p-[1.5px] rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 bg-primary">
                <div className="w-11 h-11 bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-bold text-xl group-hover:scale-[0.98] transition-transform overflow-hidden relative">
                  <img
                    src={settings?.logoUrl || "/logo.png"}
                    alt={settings?.siteName || "Logo"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-primary transition-colors">
                  {settings?.siteName || "Assurawy"}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold tracking-[0.25em] uppercase">
                  {settings?.siteTagline || "Qur'an Academy"}
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-9 text-xs font-semibold tracking-widest uppercase text-slate-600">
              <Link href="/" className="hover:text-primary transition-colors duration-200 relative py-1">
                {t.home}
              </Link>
              <Link href="/quran-academy" className="hover:text-primary transition-colors duration-200 relative py-1">
                {t.academy}
              </Link>
              <Link href="/courses" className="hover:text-primary transition-colors duration-200 relative py-1">
                {t.courses}
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors duration-200 relative py-1">
                {t.mission}
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors duration-200 relative py-1">
                {t.contact}
              </Link>
            </nav>

            <HeaderActions />
          </div>
        </header>

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 bg-slate-50 text-slate-800">{children}</main>

        {/* 4. LIGHT FOOTER */}
        <footer className="relative bg-white text-slate-600 border-t border-slate-200 mt-auto overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  ☪
                </div>
                <span className="font-serif text-xl font-bold tracking-wide text-primary">
                  {settings?.siteName || "Assurawy"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {t.footerDesc}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold tracking-wider text-primary">{t.navTitle}</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
                <li><Link href="/quran-academy" className="hover:text-primary transition">{t.academy}</Link></li>
                <li><Link href="/about" className="hover:text-primary transition">{t.mission}</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition">{t.portal}</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold tracking-wider text-primary">{t.academicTitle}</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
                <li className="hover:text-slate-700 transition">{t.tajweed}</li>
                <li className="hover:text-slate-700 transition">{t.memorization}</li>
                <li className="hover:text-slate-700 transition">{t.tafseer}</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold tracking-wider text-primary">{t.touchTitle}</h4>
              <div className="text-xs text-slate-500 space-y-1.5 font-medium">
                <p>Email: <span className="text-slate-800 font-semibold">info@assurawy.org</span></p>
                <p>Campus: <span className="text-slate-800 font-semibold">Kano, Nigeria</span></p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 py-6 text-center text-[11px] text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} {settings?.siteName || "Assurawy"} {t.rights}</p>
          </div>
        </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}