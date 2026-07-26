"use client";

import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: "📜",
      title: "Authenticity & Sanad",
      description:
        "Rooted in classical Islamic scholarship and authentic sources, guided by recognized scholars and Huffaz.",
    },
    {
      icon: "🎓",
      title: "Academic Excellence",
      description:
        "Combining traditional Qur'anic teaching methodologies with modern pedagogical tools and structured learning.",
    },
    {
      icon: "🌐",
      title: "Global Accessibility",
      description:
        "Making authentic Qur'anic education accessible to students worldwide from the comfort of their homes.",
    },
    {
      icon: "🤝",
      title: "Community & Growth",
      description:
        "Fostering a supportive spiritual environment that nurtures continuous learning and character building.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B2A4A]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1B2A4A] py-20 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="font-serif text-xl text-[#D4AF37] font-bold tracking-widest">
            بسم الله الرحمن الرحيم
          </p>

          <div className="flex justify-center items-center gap-3 my-3">
            <div className="h-[1px] w-12 bg-[#D4AF37]" />
            <div className="w-9 h-9 rounded-full bg-[#1B2A4A] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-base shadow-md">
              ☪
            </div>
            <div className="h-[1px] w-12 bg-[#D4AF37]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            About Our Academy & Mission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            Dedicated to spreading authentic Islamic knowledge, Qur'anic recitation, and sound classical sciences with modern learning technology.
          </p>
        </div>
      </section>

      {/* 2. MISSION & VISION SECTION */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Mission Card */}
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-8 shadow-sm hover:border-[#D4AF37] transition">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B2A4A] text-lg text-[#D4AF37]">
                🎯
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1B2A4A]">Our Mission</h2>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              To empower muslims worldwide by providing high-quality, authentic, and accessible Qur'anic education and Islamic studies. We aim to nurture students with sound Tajweed, deep understanding, and strong spiritual values.
            </p>
          </div>

          {/* Vision Card */}
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-8 shadow-sm hover:border-[#D4AF37] transition">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B2A4A] text-lg text-[#D4AF37]">
                👁️
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1B2A4A]">Our Vision</h2>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              To become a premier international digital Islamic institution recognized for preserving Qur'anic traditions, producing certified scholars, and building a global community connected through the Holy Qur'an.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="bg-white py-16 border-y border-[#D4AF37]/20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Guiding Principles
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1B2A4A]">
              Our Core Values
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-[#FAF8F5] p-6 text-center shadow-sm space-y-3"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] text-xl">
                  {v.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#1B2A4A]">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="bg-[#1B2A4A] py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-white">
            Join Our Learning Community Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Start your journey in Qur'anic memorization, Tajweed, or Islamic studies with certified instructors.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/quran-academy"
              className="rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] px-7 py-3 text-sm font-bold text-[#1B2A4A] shadow-lg hover:brightness-110 transition active:scale-95"
            >
              Explore Courses
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-[#D4AF37]/50 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}