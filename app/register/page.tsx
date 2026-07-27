"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export const dynamic = 'force-dynamic';
export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        phone: form.get("phone") || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-16 md:px-8">
      <div className="w-full rounded-xl2 border border-deep/10 bg-white p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">Create Account</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-deep">
          Register as a Student
        </h1>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Full Name</label>
            <input name="name" required type="text" className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Email Address</label>
            <input name="email" required type="email" className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Password</label>
            <input name="password" required type="password" minLength={8} className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
              WhatsApp Number <span className="normal-case text-ink/40">(optional)</span>
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="+2348012345678"
              pattern="^\+?[1-9]\d{7,14}$"
              className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
            />
            <p className="mt-1 text-xs text-ink/45">
              We'll send enrollment and certificate updates here.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald hover:text-deep">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
