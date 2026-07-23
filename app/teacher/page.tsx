"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/UI";

type Course = {
  id: string;
  title: string;
  published: boolean;
  _count: { enrollments: number; modules: number };
};

export default function TeacherOverviewPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    fetch("/api/teacher/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses ?? []));
  }, []);

  const totalStudents = courses?.reduce((s, c) => s + c._count.enrollments, 0) ?? 0;
  const published = courses?.filter((c) => c.published).length ?? 0;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Teacher</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Your Teaching Overview</h1>

      {!courses ? (
        <p className="mt-8 text-sm text-ink/50">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <StatCard label="Your Courses" value={courses.length} hint={`${published} published`} />
          <StatCard label="Total Students" value={totalStudents} />
          <StatCard
            label="Modules Authored"
            value={courses.reduce((s, c) => s + c._count.modules, 0)}
          />
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-deep">Your Courses</h2>
        <Link
          href="/teacher/courses/new"
          className="focus-ring rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-deep hover:bg-goldLight"
        >
          + New Course
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {courses?.map((c) => (
          <Link
            key={c.id}
            href={`/teacher/courses/${c.id}`}
            className="focus-ring flex flex-wrap items-center justify-between gap-2 rounded-xl2 border border-deep/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5"
          >
            <div>
              <p className="font-medium text-deep">{c.title}</p>
              <p className="text-xs text-ink/50">
                {c._count.modules} modules · {c._count.enrollments} students
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                c.published ? "bg-emerald/10 text-emerald" : "bg-sand text-ink/60"
              }`}
            >
              {c.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
        {courses?.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-deep/15 bg-white p-8 text-center text-sm text-ink/50">
            You haven't created a course yet.
          </p>
        )}
      </div>
    </div>
  );
}
