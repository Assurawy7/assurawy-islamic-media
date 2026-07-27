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
  teacher: { id: string; name: string };
  _count: { enrollments: number; modules: number };
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/courses");
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

  async function remove(course: Course) {
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setBusyId(course.id);
    await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
    await load();
    setBusyId(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-deep">All Courses</h1>
        </div>
        <Link
          href="/teacher/courses/new"
          className="focus-ring rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-deep hover:bg-goldLight"
        >
          + New Course
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl2 border border-deep/10 bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-deep/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Instructor</th>
              <th className="px-5 py-3">Modules</th>
              <th className="px-5 py-3">Students</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep/10">
            {courses?.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-medium text-deep">{c.title}</td>
                <td className="px-5 py-3 text-ink/70">{c.teacher.name}</td>
                <td className="px-5 py-3 text-ink/70">{c._count.modules}</td>
                <td className="px-5 py-3 text-ink/70">{c._count.enrollments}</td>
                <td className="px-5 py-3">
                  <Badge tone={c.published ? "emerald" : "neutral"}>
                    {c.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/teacher/courses/${c.id}`}
                      className="focus-ring rounded-full border border-deep/15 px-3 py-1.5 text-xs font-semibold text-deep hover:border-emerald hover:text-emerald"
                    >
                      Manage
                    </Link>
                    <button
                      disabled={busyId === c.id}
                      onClick={() => togglePublish(c)}
                      className="focus-ring rounded-full border border-gold px-3 py-1.5 text-xs font-semibold text-deep hover:bg-gold disabled:opacity-50"
                    >
                      {c.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      disabled={busyId === c.id}
                      onClick={() => remove(c)}
                      className="focus-ring rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink/50">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
