"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { enrollments: number; certificates: number };
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((d) => setStudents(d.students ?? []));
  }, []);

  const filtered = students?.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Students</h1>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or email..."
        className="focus-ring mt-6 w-full max-w-sm rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
      />

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-deep/10 bg-white shadow-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-deep/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Enrollments</th>
              <th className="px-5 py-3">Certificates</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep/10">
            {filtered?.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 font-medium text-deep">{s.name}</td>
                <td className="px-5 py-3 text-ink/70">{s.email}</td>
                <td className="px-5 py-3 text-ink/70">{s._count.enrollments}</td>
                <td className="px-5 py-3 text-ink/70">{s._count.certificates}</td>
                <td className="px-5 py-3 text-ink/50">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-ink/50">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
