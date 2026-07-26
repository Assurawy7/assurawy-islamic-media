import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import HeaderActions from "@/components/headerActions";

declare module "*.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "Assurawy | Premier Islamic & Qur'an Academy",
  description: "Authentic Qur'anic studies, Tajweed, Tafseer, and classical Islamic learning for discerning students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col selection:bg-[#C5A059]/30 selection:text-[#8C6D1F]">
        
        {/* 1. TOP ANNOUNCEMENT BAR (LIGHT GOLD ACCENT) */}
        <div className="bg-gradient-to-r from-slate-100 via-amber-50 to-slate-100 text-[#8C6D1F] border-b border-[#D4AF37]/30 text-[11px] font-medium tracking-wider">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-between">
            <p className="hidden md:flex items-center gap-2 text-slate-600">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Empowering Minds through Divine Wisdom
            </p>
            <p className="mx-auto md:mx-0 font-serif font-bold text-xs tracking-widest text-[#8C6D1F]">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <div className="hidden md:flex items-center gap-6 text-slate-500">
              <Link href="/dashboard" className="hover:text-[#8C6D1F] transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/contact" className="hover:text-[#8C6D1F] transition-colors duration-200">
                Support & Inquiries
              </Link>
            </div>
          </div>
        </div>

        {/* 2. MAIN LIGHT NAVBAR */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
            
            {/* Logo Area */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] shadow-sm group-hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 bg-[#1B2A4A] rounded-[14px] flex items-center justify-center text-[#F5D77F] font-bold text-xl group-hover:scale-[0.98] transition-transform">
                  ☪
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#C5A059] transition-colors">
                  Assurawy
                </span>
                <span className="text-[9px] text-[#C5A059] font-semibold tracking-[0.25em] uppercase">
                  Qur'an Academy
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-9 text-xs font-medium tracking-widest uppercase text-slate-600">
              <Link href="/" className="hover:text-[#C5A059] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">
                Home
              </Link>
              <Link href="/quran-academy" className="hover:text-[#C5A059] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">
                Academy
              </Link>
              <Link href="/courses" className="hover:text-[#C5A059] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">
                Courses
              </Link>
              <Link href="/about" className="hover:text-[#C5A059] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">
                Our Mission
              </Link>
              <Link href="/contact" className="hover:text-[#C5A059] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all">
                Contact
              </Link>
            </nav>

            {/* Dynamic Action Buttons */}
            <HeaderActions />
          </div>
        </header>

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 bg-slate-50 text-slate-900">{children}</main>

        {/* 4. LIGHT FOOTER */}
        <footer className="relative bg-white text-slate-600 border-t border-slate-200 mt-auto overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B2A4A] to-[#0B132B] flex items-center justify-center text-[#F5D77F] font-bold text-base shadow-sm">
                  ☪
                </div>
                <span className="font-serif text-xl font-bold text-slate-900 tracking-wide">
                  Assurawy
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nurturing hearts and illuminating minds through classical Islamic sciences, Tajweed, and authentic Qur'anic memorization.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059]">Navigation</h4>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><Link href="/quran-academy" className="hover:text-[#C5A059] transition">Qur'an Academy</Link></li>
                <li><Link href="/about" className="hover:text-[#C5A059] transition">About Our Mission</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#C5A059] transition">Student Portal</Link></li>
              </ul>
            </div>

            {/* Programs */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059]">Academic Offerings</h4>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li className="hover:text-slate-700 transition">Tajweed & Precise Recitation</li>
                <li className="hover:text-slate-700 transition">Qur'an Memorization (Hifz)</li>
                <li className="hover:text-slate-700 transition">Tafseer & Classical Arabic</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059]">Get In Touch</h4>
              <div className="text-xs text-slate-500 space-y-1.5">
                <p>Email: <span className="text-slate-800">info@assurawy.org</span></p>
                <p>Campus: <span className="text-slate-800">Kano, Nigeria</span></p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-100 py-6 text-center text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Assurawy Islamic Media & Qur'an Academy. Designed with Excellence.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}