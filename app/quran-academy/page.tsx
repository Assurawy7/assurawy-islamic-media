"use client";

import Link from "next/link";
import { useState } from "react";

type Course = {
  id: string;
  title: string;
  arabicTitle: string;
  category: string;
  duration: string;
  level: string;
  description: string;
};

const COURSES: Course[] = [
  {
    id: "tajweed-basics",
    title: "Comprehensive Tajweed Rules",
    arabicTitle: "قَوَاعِدُ التَّجْوِيدِ الْمُيَسَّرَةُ",
    category: "Tajweed & Recitation",
    duration: "12 Weeks",
    level: "Beginner to Intermediate",
    description:
      "Master the correct pronunciation (Makharij & Sifat) of Arabic letters and recite the Glorious Qur'an with perfection.",
  },
  {
    id: "quran-hifz",
    title: "Qur'an Memorization (Hifz)",
    arabicTitle: "بَرْنَامَجُ تَحْفِيظِ الْقُرْآنِ الْكَرِيمِ",
    category: "Memorization",
    duration: "Flexible / 1-2 Years",
    level: "All Levels",
    description:
      "Structured and guided memorization program with one-on-one revision sessions under qualified Huffaz.",
  },
  {
    id: "tafseer-intro",
    title: "Tafseer & Qur'anic Sciences",
    arabicTitle: "تَفْسِيرُ الْقُرْآنِ وَعُلُومُهُ",
    category: "Tafseer",
    duration: "16 Weeks",
    level: "Intermediate",
    description:
      "Understand the deep meanings, contexts of revelation (Asbab al-Nuzul), and classical interpretations of the Holy Qur'an.",
  },
  {
    id: "quranic-arabic",
    title: "Qur'anic Arabic Language",
    arabicTitle: "اللُّغَةُ الْعَرَبِيَّةُ لِفَهْمِ الْقُرْآنِ",
    category: "Language",
    duration: "10 Weeks",
    level: "Beginner",
    description:
      "Learn essential Arabic grammar, vocabulary, and sentence structures to directly comprehend the Qur'anic text while reciting.",
  },
];

export default function QuranAcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Tajweed & Recitation", "Memorization", "Tafseer", "Language"];

  const filteredCourses =
    selectedCategory === "All"
      ? COURSES
      : COURSES.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B2A4A]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1B2A4A] py-20 text-white">
        {/* Background Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <p className="font-serif text-2xl text-[#D4AF37] font-bold tracking-widest">
            بسم الله الرحمن الرحيم
          </p>
          <div className="flex justify-center items-center gap-3 my-3">
            <div className="h-[1px] w-12 bg-[#D4AF37]" />
            <div className="w-10 h-10 rounded-full bg-[#1B2A4A] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg shadow-md">
              ☪
            </div>
            <div className="h-[1px] w-12 bg-[#D4AF37]" />
          </div>

          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Qur'an Academy & Classical Sciences
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Nurturing hearts through authentic Qur'anic recitation, sound Tajweed, and deep understanding guided by certified scholars.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#courses"
              className="rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] px-7 py-3 text-sm font-semibold text-[#1B2A4A] shadow-lg transition hover:brightness-110 active:scale-95"
            >
              Explore Courses
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-[#D4AF37]/50 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ACADEMY STATS */}
      <section className="border-b border-[#D4AF37]/20 bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div className="border-r border-[#D4AF37]/20 last:border-none">
              <p className="font-serif text-3xl font-bold text-[#1B2A4A]">1,200+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 font-medium">Active Students</p>
            </div>
            <div className="border-r border-[#D4AF37]/20 last:border-none">
              <p className="font-serif text-3xl font-bold text-[#1B2A4A]">15+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 font-medium">Certified Huffaz & Scholars</p>
            </div>
            <div className="border-r border-[#D4AF37]/20 last:border-none">
              <p className="font-serif text-3xl font-bold text-[#1B2A4A]">98%</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 font-medium">Completion Rate</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#1B2A4A]">Authentic</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 font-medium">Ijazah Certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COURSES SECTION */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            Academic Programs
          </p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-[#1B2A4A]">
            Featured Qur'an Courses
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Select a program tailored to your learning pace and goals.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#1B2A4A] text-[#D4AF37] shadow-md border border-[#D4AF37]"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="relative flex flex-col justify-between rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-sm transition hover:shadow-xl hover:border-[#D4AF37]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#1B2A4A]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                    {course.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {course.duration}
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-xl font-bold text-[#1B2A4A]">
                  {course.title}
                </h3>
                <p className="mt-1 font-serif text-sm text-[#C5A059] dir-rtl font-semibold">
                  {course.arabicTitle}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {course.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Level: <strong className="text-[#1B2A4A]">{course.level}</strong>
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1B2A4A] hover:text-[#C5A059] transition"
                >
                  Enroll Course →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-white py-16 border-t border-[#D4AF37]/20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-[#1B2A4A]">
              Why Learn With Our Academy?
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-[#FAF8F5] p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] text-[#D4AF37] text-xl font-bold">
                📜
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-[#1B2A4A]">Verified Ijazah Certificates</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Receive verifiable official certificates upon successful completion of exams and recitation evaluations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#FAF8F5] p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] text-[#D4AF37] text-xl font-bold">
                👥
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-[#1B2A4A]">One-on-One Guidance</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Direct interaction and live feedback from qualified male and female teachers.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#FAF8F5] p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] text-[#D4AF37] text-xl font-bold">
                📱
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-[#1B2A4A]">Flexible Online Portal</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Access your schedule, course materials, recorded audio lectures, and track your progress anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="bg-[#1B2A4A] py-14 text-center text-white relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Begin Your Qur'anic Journey Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            "The best among you are those who learn the Qur'an and teach it." (Sahih Al-Bukhari)
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] px-8 py-3 text-sm font-bold text-[#1B2A4A] shadow-lg transition hover:brightness-110 active:scale-95"
            >
              Start Free Registration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}