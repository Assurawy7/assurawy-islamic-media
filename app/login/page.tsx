"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

/** Only accept a same-site relative path (e.g. "/teacher/courses/new") as a
 * post-login redirect target — never an absolute URL or protocol-relative
 * "//evil.com", which would otherwise be an open-redirect vector since this
 * value comes from a query param an attacker could craft a link with. */
function safeNextPath(next: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function roleHome(role: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid email or password.");
      setSubmitting(false);
      return;
    }

    const data = await res.json().catch(() => ({}));
    const next = safeNextPath(searchParams.get("next"));
    router.push(next ?? roleHome(data?.user?.role ?? "STUDENT"));
  }

  return (
    <div className="w-full rounded-xl2 border border-deep/10 bg-white p-8 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Welcome Back</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-deep">Log In</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Email Address</label>
          <input name="email" required type="email" className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Password</label>
          <input name="password" required type="password" className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New to Assurawy?{" "}
        <Link href="/register" className="font-semibold text-emerald hover:text-deep">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-16 md:px-8">
      <Suspense
        fallback={
          <div className="w-full rounded-xl2 border border-deep/10 bg-white p-8 shadow-card">
            <p className="font-display text-lg font-semibold text-deep">Loading…</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </section>
  );
}
