"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Result = { success: true; courseId: string } | { success: false; status?: string; error?: string };

function PaymentCallbackContent() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then(setResult)
      .catch(() => setResult({ success: false, error: "Could not reach the server." }));
  }, [reference]);

  return (
    <div className="w-full rounded-xl2 border border-deep/10 bg-white p-8 text-center shadow-card">
      {!reference && (
        <p className="text-sm text-red-600">No payment reference was provided.</p>
      )}

      {reference && !result && (
        <>
          <p className="font-display text-lg font-semibold text-deep">Confirming your payment…</p>
          <p className="mt-2 text-sm text-ink/60">This only takes a moment.</p>
        </>
      )}

      {result?.success && (
        <>
          <p className="text-3xl">✓</p>
          <p className="mt-3 font-display text-xl font-semibold text-deep">Payment successful</p>
          <p className="mt-2 text-sm text-ink/70">You've been enrolled in the course.</p>
          <Link
            href="/dashboard"
            className="focus-ring mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight"
          >
            Go to My Dashboard
          </Link>
        </>
      )}

      {result && !result.success && (
        <>
          <p className="text-3xl">✕</p>
          <p className="mt-3 font-display text-xl font-semibold text-deep">Payment not completed</p>
          <p className="mt-2 text-sm text-ink/70">
            {result.error || "The transaction wasn't successful. You have not been charged an enrollment."}
          </p>
          <Link
            href="/courses"
            className="focus-ring mt-6 inline-block rounded-full border border-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-gold"
          >
            Back to Courses
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16 md:px-8">
      <Suspense
        fallback={
          <div className="w-full rounded-xl2 border border-deep/10 bg-white p-8 text-center shadow-card">
            <p className="font-display text-lg font-semibold text-deep">Loading…</p>
          </div>
        }
      >
        <PaymentCallbackContent />
      </Suspense>
    </section>
  );
}
