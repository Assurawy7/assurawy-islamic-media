"use client";

import { useEffect, useState } from "react";

type Certificate = {
  id: string;
  certificateNo: string;
  courseTitle: string;
  issuedAt: string;
  student: { name: string; email: string };
};

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[] | null>(null);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(query = "") {
    const res = await fetch(`/api/admin/certificates${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    const data = await res.json();
    setCerts(data.certificates ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function revoke(cert: Certificate) {
    if (!confirm(`Revoke certificate ${cert.certificateNo}? This cannot be undone.`)) return;
    setBusyId(cert.id);
    await fetch(`/api/admin/certificates/${cert.id}`, { method: "DELETE" });
    await load(q);
    setBusyId(null);
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Certificates</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
        className="mt-6 flex max-w-md gap-3"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by student, course, or ID..."
          className="focus-ring flex-1 rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
        />
        <button className="focus-ring rounded-full border border-deep/15 px-5 py-2.5 text-sm font-semibold text-deep hover:border-emerald hover:text-emerald">
          Search
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-deep/10 bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-deep/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Certificate ID</th>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Issued</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep/10">
            {certs?.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-mono text-xs text-deep">{c.certificateNo}</td>
                <td className="px-5 py-3 text-ink/70">{c.student.name}</td>
                <td className="px-5 py-3 text-ink/70">{c.courseTitle}</td>
                <td className="px-5 py-3 text-ink/50">{new Date(c.issuedAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/api/certificates/${encodeURIComponent(c.certificateNo)}/pdf`}
                      className="focus-ring rounded-full border border-gold px-3 py-1.5 text-xs font-semibold text-deep hover:bg-gold"
                    >
                      Download
                    </a>
                    <button
                      disabled={busyId === c.id}
                      onClick={() => revoke(c)}
                      className="focus-ring rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {certs?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-ink/50">
                  No certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
