"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { StatCard, ProgressBar } from "@/components/dashboard/UI";
export const dynamic = 'force-dynamic';
type StudentRow = {
  studentId: string;
  name: string;
  email: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  avgQuizScore: number | null;
  quizzesTaken: number;
};

type AnalyticsResponse = {
  course: { id: string; title: string };
  summary: { totalStudents: number; avgProgress: number; completedCount: number };
  students: StudentRow[];
};

export default function CourseAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/courses/${id}/analytics`);
    if (!res.ok) {
      setError("Could not load analytics for this course.");
      return;
    }
    setData(await res.json());
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Analytics</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">{data.course.title}</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatCard label="Enrolled Students" value={data.summary.totalStudents} />
        <StatCard label="Average Progress" value={`${data.summary.avgProgress}%`} />
        <StatCard label="Fully Completed" value={data.summary.completedCount} />
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl2 border border-deep/10 bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-deep/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Progress</th>
              <th className="px-5 py-3">Lessons</th>
              <th className="px-5 py-3">Avg Quiz Score</th>
              <th className="px-5 py-3">Quizzes Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep/10">
            {data.students.map((s) => (
              <tr key={s.studentId}>
                <td className="px-5 py-3">
                  <p className="font-medium text-deep">{s.name}</p>
                  <p className="text-xs text-ink/50">{s.email}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="w-40">
                    <ProgressBar percent={s.progress} tone={s.progress === 100 ? "gold" : "emerald"} />
                    <p className="mt-1 text-xs text-ink/50">{s.progress}%</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink/70">
                  {s.completedLessons}/{s.totalLessons}
                </td>
                <td className="px-5 py-3 text-ink/70">
                  {s.avgQuizScore === null ? "—" : `${s.avgQuizScore}%`}
                </td>
                <td className="px-5 py-3 text-ink/70">{s.quizzesTaken}</td>
              </tr>
            ))}
            {data.students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-ink/50">
                  No students enrolled in this course yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
