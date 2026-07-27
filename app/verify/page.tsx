"use client";

import { useState } from "react";
import IslamicPattern from "@/components/IslamicPattern";
export const dynamic = 'force-dynamic';
type Result =
  | { valid: true; certificateNo: string; studentName: string; courseTitle: string; issuedAt: string }
  | { valid: false };

export default function VerifyPage() {
  const [certNo, setCertNo] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setResult(null);

    const res = await fetch(`/api/certificates/${encodeURIComponent(certNo.trim())}`);
    const data = await res.json();
    setResult(data);
    setChecking(false);
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <div className="text-center">
        <p className="font-arabic text-lg text-gold/80">تحقق من الشهادة</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold">Verify a Certificate</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-deep">
          Certificate Verification
        </h1>
        <p className="mt-3 text-sm text-ink/70">
          Enter a certificate ID (e.g. AIM-CERT-2026-0142) to confirm it was
          issued by Assurawy Islamic Media.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <input
          value={certNo}
          onChange={(e) => setCertNo(e.target.value)}
          placeholder="AIM-CERT-2026-0142"
          required
          className="focus-ring flex-1 rounded-lg border border-deep/15 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={checking}
          className="focus-ring rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
        >
          {checking ? "Checking…" : "Verify"}
        </button>
      </form>

      {result && (
        <div className="mt-8 rounded-xl2 border p-6 shadow-card"
          style={{ borderColor: result.valid ? "#C6A15B" : "#ef4444" }}
        >
          {result.valid ? (
            <>
              <p className="text-sm font-semibold text-emerald">✓ This certificate is valid.</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Student</dt>
                  <dd className="font-medium text-deep">{result.studentName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Course</dt>
                  <dd className="font-medium text-deep">{result.courseTitle}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Issued</dt>
                  <dd className="font-medium text-deep">
                    {new Date(result.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Certificate ID</dt>
                  <dd className="font-medium text-deep">{result.certificateNo}</dd>
                </div>
              </dl>
              <a
                href={`/api/certificates/${encodeURIComponent(result.certificateNo)}/pdf`}
                className="focus-ring mt-5 inline-block rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-deep hover:bg-gold"
              >
                Download PDF
              </a>
            </>
          ) : (
            <p className="text-sm font-semibold text-red-600">
              ✕ No certificate found with that ID. Double-check the number and try again.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
