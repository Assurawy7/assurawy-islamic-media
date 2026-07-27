"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/dashboard/UI";
export const dynamic = 'force-dynamic';
type Course = {
  id: string;
  title: string;
  level: string;
  published: boolean;
  _count: { enrollments: number; modules: number };
};

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/teacher/courses");
    const data = await res.json();
    setCourses(data.courses ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(course: Course) {
    setBusyId(course.id);
    await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    await load();
    setBusyId(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Teacher</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-deep">My Courses</h1>
        </div>
        <Link
          href="/teacher/courses/new"
          className="focus-ring rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-deep hover:bg-goldLight"
        >
          + New Course
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {courses?.map((c) => (
          <div key={c.id} className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone="gold">{c.level}</Badge>
                <h2 className="mt-2 font-display text-lg font-semibold text-deep">{c.title}</h2>
              </div>
              <Badge tone={c.published ? "emerald" : "neutral"}>
                {c.published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-ink/50">
              {c._count.modules} modules · {c._count.enrollments} students enrolled
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/teacher/courses/${c.id}`}
                className="focus-ring rounded-full bg-deep px-4 py-2 text-xs font-semibold text-cream hover:bg-emerald"
              >
                Manage Course
              </Link>
              <Link
                href={`/teacher/courses/${c.id}/analytics`}
                className="focus-ring rounded-full border border-deep/15 px-4 py-2 text-xs font-semibold text-deep hover:border-emerald hover:text-emerald"
              >
                Analytics
              </Link>
              <button
                disabled={busyId === c.id}
                onClick={() => togglePublish(c)}
                className="focus-ring rounded-full border border-gold px-4 py-2 text-xs font-semibold text-deep hover:bg-gold disabled:opacity-50"
              >
                {c.published ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}
        {courses?.length === 0 && (
          <p className="col-span-2 rounded-xl2 border border-dashed border-deep/15 bg-white p-8 text-center text-sm text-ink/50">
            You haven't created a course yet.
          </p>
        )}
      </div>
    </div>
  );
}
