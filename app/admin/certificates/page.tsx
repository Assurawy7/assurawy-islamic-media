"use client";

import { useEffect, useState } from "react";
export const dynamic = 'force-dynamic';
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
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(query = "") {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/certificates${query ? `?q=${encodeURIComponent(query)}` : ""}`
      );
      const data = await res.json();
      setCerts(data.certificates ?? []);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function revoke(cert: Certificate) {
    if (
      !confirm(
        `Are you sure you want to revoke certificate ${cert.certificateNo}? This action cannot be undone.`
      )
    )
      return;

    setBusyId(cert.id);
    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to revoke certificate. Please try again.");
        return;
      }
      await load(q);
    } catch (err) {
      alert("An error occurred while revoking the certificate.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8 p-1 sm:p-2">
      {/* Header Section */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Management Portal
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-deep">
            Certificates Directory
          </h1>
          <p className="text-sm text-ink/60">
            Manage, search, download, and revoke issued course certificates.
          </p>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-deep/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50">Total Certificates</p>
          <p className="mt-1 text-2xl font-bold text-deep">
            {certs ? certs.length : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-deep/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50">Status</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active System
          </span>
        </div>
        <div className="rounded-xl border border-deep/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-ink/50">Filtered Results</p>
          <p className="mt-1 text-2xl font-bold text-deep">
            {q ? (certs ? certs.length : 0) : "All"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-deep/10 bg-white p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(q);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by student name, email, course, or ID..."
              className="w-full rounded-lg border border-deep/15 bg-slate-50/50 pl-10 pr-9 py-2.5 text-sm text-deep transition-colors placeholder:text-ink/40 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  load("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40 hover:text-ink/70"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-deep px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-deep/90 focus-ring active:scale-[0.98]"
          >
            Search
          </button>
        </form>
      </div>

      {/* Certificates Table */}
      <div className="overflow-hidden rounded-xl border border-deep/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-deep/10 bg-slate-50/70 text-xs uppercase tracking-wider text-ink/60">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Certificate ID</th>
                <th className="px-6 py-3.5 font-semibold">Student Details</th>
                <th className="px-6 py-3.5 font-semibold">Course</th>
                <th className="px-6 py-3.5 font-semibold">Issued Date</th>
                <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-deep/10">
              {loading ? (
                /* Skeleton Loading State */
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-slate-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-1 h-3 w-40 rounded bg-slate-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-36 rounded bg-slate-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 rounded bg-slate-200" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-8 w-28 rounded bg-slate-200" />
                    </td>
                  </tr>
                ))
              ) : certs && certs.length > 0 ? (
                certs.map((c) => (
                  <tr
                    key={c.id}
                    className="group transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-deep">
                      <span className="rounded bg-slate-100 px-2 py-1 border border-deep/10">
                        {c.certificateNo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-deep">
                          {c.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-deep">{c.student.name}</p>
                          <p className="text-xs text-ink/50">{c.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-ink/80">
                      {c.courseTitle}
                    </td>
                    <td className="px-6 py-4 text-xs text-ink/60">
                      {new Date(c.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <a
                          href={`/api/certificates/${encodeURIComponent(c.certificateNo)}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-deep transition hover:bg-gold hover:text-white"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download
                        </a>
                        <button
                          disabled={busyId === c.id}
                          onClick={() => revoke(c)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                        >
                          {busyId === c.id ? "Revoking..." : "Revoke"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink/40">
                        📄
                      </div>
                      <p className="mt-3 text-sm font-semibold text-deep">
                        No certificates found
                      </p>
                      <p className="mt-1 text-xs text-ink/50">
                        Try adjusting your search terms or view all certificates.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}