"use client";

import { useEffect, useState } from "react";

type Teacher = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  _count: { coursesTaught: number };
};

type Student = { id: string; name: string; email: string };

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [students, setStudents] = useState<Student[] | null>(null);
  const [selected, setSelected] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const [tRes, sRes] = await Promise.all([
      fetch("/api/admin/teachers").then((r) => r.json()),
      fetch("/api/admin/students").then((r) => r.json()),
    ]);
    setTeachers(tRes.teachers ?? []);
    setStudents(sRes.students ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function promote() {
    if (!selected) return;
    setPromoting(true);
    setMessage(null);
    const res = await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected }),
    });
    if (res.ok) {
      setMessage("Promoted to Teacher.");
      setSelected("");
      await load();
    } else {
      setMessage("Could not promote that user.");
    }
    setPromoting(false);
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Teachers</h1>

      <div className="mt-6 max-w-xl rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-deep">Promote a Student to Teacher</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="focus-ring flex-1 rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
          >
            <option value="">Select a student...</option>
            {students?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          <button
            onClick={promote}
            disabled={!selected || promoting}
            className="focus-ring rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-50"
          >
            {promoting ? "Promoting..." : "Promote"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-emerald">{message}</p>}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl2 border border-deep/10 bg-white shadow-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-deep/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Courses Taught</th>
              <th className="px-5 py-3">Bio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep/10">
            {teachers?.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3 font-medium text-deep">{t.name}</td>
                <td className="px-5 py-3 text-ink/70">{t.email}</td>
                <td className="px-5 py-3 text-ink/70">{t._count.coursesTaught}</td>
                <td className="px-5 py-3 text-ink/50">{t.bio ?? "-"}</td>
              </tr>
            ))}
            {teachers?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-ink/50">
                  No teachers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
