"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/UI";

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
      const [studentsRes, teachersRes, coursesRes, certsRes] = await Promise.all([
        fetch("/api/admin/students").then((r) => r.json()),
        fetch("/api/admin/teachers").then((r) => r.json()),
        fetch("/api/admin/courses").then((r) => r.json()),
        fetch("/api/admin/certificates").then((r) => r.json()),
      ]);
      const courses = coursesRes.courses ?? [];
      setStats({
        students: studentsRes.students?.length ?? 0,
        teachers: teachersRes.teachers?.length ?? 0,
        courses: courses.length,
        published: courses.filter((c: { published: boolean }) => c.published).length,
        certificates: certsRes.certificates?.length ?? 0,
      });
    })();
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Platform Overview</h1>

      {!stats ? (
        <p className="mt-8 text-sm text-ink/50">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Students" value={stats.students} />
          <StatCard label="Teachers" value={stats.teachers} />
          <StatCard label="Courses" value={stats.courses} hint={`${stats.published} published`} />
          <StatCard label="Certificates Issued" value={stats.certificates} />
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/courses" className="focus-ring rounded-xl2 border border-deep/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5">
          <p className="font-display text-lg font-semibold text-deep">Manage Courses -&gt;</p>
          <p className="mt-1 text-sm text-ink/60">Publish, edit, or remove courses.</p>
        </Link>
        <Link href="/admin/teachers" className="focus-ring rounded-xl2 border border-deep/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5">
          <p className="font-display text-lg font-semibold text-deep">Manage Teachers -&gt;</p>
          <p className="mt-1 text-sm text-ink/60">Promote students to teacher accounts.</p>
        </Link>
        <Link href="/admin/certificates" className="focus-ring rounded-xl2 border border-deep/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5">
          <p className="font-display text-lg font-semibold text-deep">Certificates -&gt;</p>
          <p className="mt-1 text-sm text-ink/60">Search, verify, or revoke a certificate.</p>
        </Link>
      </div>
    </div>
  );
}
