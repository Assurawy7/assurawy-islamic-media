"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/UI";
import HeroHeader from "./HeroHeader";
export const dynamic = 'force-dynamic';
type Stats = {
  students: number;
  teachers: number;
  courses: number;
  published: number;
  certificates: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [studentsRes, teachersRes, coursesRes, certsRes] = await Promise.all([
          fetch("/api/admin/students").then((r) => r.json()).catch(() => ({})),
          fetch("/api/admin/teachers").then((r) => r.json()).catch(() => ({})),
          fetch("/api/admin/courses").then((r) => r.json()).catch(() => ({})),
          fetch("/api/admin/certificates").then((r) => r.json()).catch(() => ({})),
        ]);
        const courses = coursesRes.courses ?? [];
        setStats({
          students: studentsRes.students?.length ?? 0,
          teachers: teachersRes.teachers?.length ?? 0,
          courses: courses.length,
          published: courses.filter((c: { published: boolean }) => c.published).length,
          certificates: certsRes.certificates?.length ?? 0,
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. HERO HEADER */}
      <HeroHeader />

      {/* 2. ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#0B132B] p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-lg text-white">
        <span className="text-xs font-bold text-[#F5D77F] uppercase tracking-widest bg-[#D4AF37]/20 px-3 py-1 rounded-full border border-[#D4AF37]/30">
          Admin Portal
        </span>
        <h1 className="font-serif text-3xl font-bold mt-3">Platform Overview</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Monitor academy stats, manage courses, teachers, and student certifications.
        </p>
      </div>

      {/* 3. STATS SECTION */}
      {!stats ? (
        <div className="flex items-center gap-3 py-8 text-slate-500 font-medium text-sm">
          <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          Loading dashboard statistics...
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Students" value={stats.students} />
          <StatCard label="Teachers" value={stats.teachers} />
          <StatCard label="Courses" value={stats.courses} hint={`${stats.published} published`} />
          <StatCard label="Certificates Issued" value={stats.certificates} />
        </div>
      )}

      {/* 4. MANAGEMENT & ANALYTICS NAVIGATION CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-2">
        <Link 
          href="/admin/courses" 
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#C5A059] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#C5A059] transition-colors">
              Manage Courses
            </p>
            <span className="text-[#C5A059] group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Publish new Islamic courses, edit materials, or update curriculum.
          </p>
        </Link>

        <Link 
          href="/admin/teachers" 
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#C5A059] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#C5A059] transition-colors">
              Manage Teachers
            </p>
            <span className="text-[#C5A059] group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Assign instructors, manage roles, and elevate student permissions.
          </p>
        </Link>

        <Link 
          href="/admin/certificates" 
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#C5A059] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#C5A059] transition-colors">
              Certificates
            </p>
            <span className="text-[#C5A059] group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Search, verify, issue, or revoke official Qur'an completion certificates.
          </p>
        </Link>

        {/* KATIN ANALYTICS DA AKA ƘARA */}
        <Link 
          href="/admin/analytics" 
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#C5A059] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#C5A059] transition-colors">
              Analytics
            </p>
            <span className="text-[#C5A059] group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            View detailed stats, student enrollment growth, and platform performance.
          </p>
        </Link>
      </div>
    </div>
  );
}