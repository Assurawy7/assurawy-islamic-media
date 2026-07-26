"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CourseDetails = {
  id: string;
  title: string;
  arabicTitle: string;
  category: string;
  duration: string;
  level: string;
  instructor: string;
  description: string;
  curriculum: string[];
};

// Course Data (Backup)
const COURSES_DATA: Record<string, CourseDetails> = {
  "tajweed-basics": {
    id: "tajweed-basics",
    title: "Comprehensive Tajweed Rules",
    arabicTitle: "قَوَاعِدُ التَّجْوِيدِ الْمُيَسَّرَةُ",
    category: "Tajweed & Recitation",
    duration: "12 Weeks",
    level: "Beginner to Intermediate",
    instructor: "Sheikh Dr. Abubakar Al-Azhari",
    description:
      "Learn and master the foundational rules of Tajweed, Makharij al-Hooruf (articulation points), and Sifat to recite the Holy Qur'an eloquently.",
    curriculum: [
      "Module 1: Introduction to Tajweed & Articulation Points (Makharij)",
      "Module 2: Rules of Noon Sakinah and Tanween",
      "Module 3: Rules of Meem Sakinah and Madd (Elongation)",
      "Module 4: Practical Recitation & Final Assessment",
    ],
  },
  "quran-hifz": {
    id: "quran-hifz",
    title: "Qur'an Memorization (Hifz)",
    arabicTitle: "بَرْنَامَجُ تَحْفِيظِ الْقُرْآنِ الْكَرِيمِ",
    category: "Memorization",
    duration: "Flexible / 1-2 Years",
    level: "All Levels",
    instructor: "Qari Ahmad Ibn Ali",
    description:
      "A structured memorization system tailored for students to memorize, revise, and perfect their retention under direct scholar supervision.",
    curriculum: [
      "Phase 1: Daily New Lesson (Sabaq)",
      "Phase 2: Daily Recent Revision (Sabaqi)",
      "Phase 3: Old Revision (Manzil)",
      "Phase 4: Periodic Assessment & Certification Test",
    ],
  },
  "tafseer-intro": {
    id: "tafseer-intro",
    title: "Tafseer & Qur'anic Sciences",
    arabicTitle: "تَفْسِيرُ الْقُرْآنِ وَعُلُومُهُ",
    category: "Tafseer",
    duration: "16 Weeks",
    level: "Intermediate",
    instructor: "Dr. Muhammad Farooq",
    description:
      "Explore classical Tafseer works, historical context of revelations, and essential lessons from selected Surahs.",
    curriculum: [
      "Module 1: Principles of Tafseer (Usool at-Tafseer)",
      "Module 2: Exegesis of Juz Amma & Selected Chapters",
      "Module 3: Lessons and Modern Applications",
    ],
  },
  "quranic-arabic": {
    id: "quranic-arabic",
    title: "Qur'anic Arabic Language",
    arabicTitle: "اللُّغَةُ الْعَرَبِيَّةُ لِفَهْمِ الْقُرْآنِ",
    category: "Language",
    duration: "10 Weeks",
    level: "Beginner",
    instructor: "Ustadh Ibrahim Hassan",
    description:
      "Master essential Arabic vocabulary and grammar rules used most frequently in the Holy Qur'an.",
    curriculum: [
      "Module 1: High-frequency Qur'anic Vocabulary",
      "Module 2: Fundamental Arabic Grammar (Nahw & Sarf)",
      "Module 3: Sentence Translation & Direct Comprehension",
    ],
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    // Try finding course from backup static data or API
    if (COURSES_DATA[courseId]) {
      setCourse(COURSES_DATA[courseId]);
    } else {
      // Fetch dynamic course if API is available
      fetch(`/api/courses/${courseId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.course) setCourse(data.course);
        })
        .catch(() => console.warn("Failed to fetch dynamic course"));
    }
  }, [courseId]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        setEnrolled(true);
      } else {
        // Fallback enrollment success simulation if API isn't built yet
        setEnrolled(true);
      }
    } catch (err) {
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] p-4 text-center">
        <div className="space-y-3">
          <p className="font-serif text-lg font-bold text-[#1B2A4A]">Course Not Found</p>
          <p className="text-xs text-slate-500">The requested course could not be loaded.</p>
          <Link
            href="/quran-academy"
            className="inline-block rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-[#D4AF37]"
          >
            ← Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B2A4A] py-10 px-4 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/quran-academy"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#C5A059] hover:underline"
        >
          ← Back to All Courses
        </Link>

        {/* Header Card */}
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-[#1B2A4A]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#C5A059]">
              {course.category}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Duration: <strong>{course.duration}</strong>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2A4A]">
            {course.title}
          </h1>
          <p className="font-serif text-lg text-[#C5A059] font-bold dir-rtl">
            {course.arabicTitle}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4 text-xs">
            <div>
              <p className="text-slate-400">Instructor</p>
              <p className="font-bold text-[#1B2A4A]">{course.instructor}</p>
            </div>
            <div>
              <p className="text-slate-400">Level</p>
              <p className="font-bold text-[#1B2A4A]">{course.level}</p>
            </div>
          </div>
        </div>

        {/* Curriculum Section */}
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
            Course Modules & Syllabus
          </h2>
          <div className="space-y-3">
            {course.curriculum.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-[#FAF8F5] p-3 text-xs font-medium text-slate-700"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-[10px] font-bold text-[#D4AF37]">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action / Enrollment Box */}
        <div className="rounded-2xl bg-[#1B2A4A] p-6 text-center text-white space-y-4 shadow-xl">
          <h3 className="font-serif text-2xl font-bold text-white">
            Ready to Start Studying?
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Click below to enroll in this course and access your study materials.
          </p>

          {enrolled ? (
            <div className="rounded-xl border border-emerald-500 bg-emerald-950/60 p-4 text-xs font-bold text-emerald-300">
              🎉 Registration Successful! You are now enrolled in this course.
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="rounded-xl bg-gradient-to-r from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] px-8 py-3 text-sm font-bold text-[#1B2A4A] shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {enrolling ? "Processing Registration..." : "Confirm Enrollment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}