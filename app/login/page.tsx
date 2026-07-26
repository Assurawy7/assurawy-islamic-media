"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function safeNextPath(next: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextPath = mounted ? safeNextPath(searchParams.get("next")) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password. Please try again.");
        return;
      }

      // Redirect user upon successful login
      router.push(nextPath || "/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-deep/10 bg-white p-8 shadow-xl text-center text-sm font-medium text-deep">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-deep/10 bg-white p-8 shadow-xl" suppressHydrationWarning>
      {/* Header Section */}
      <div className="text-center space-y-2">
        <p className="font-serif text-sm text-[#C5A059] font-bold tracking-widest">
          بسم الله الرحمن الرحيم
        </p>
        <div className="flex justify-center items-center gap-2 my-1">
          <div className="w-8 h-8 rounded-full bg-[#1B2A4A] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-sm shadow-sm">
            ☪
          </div>
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-deep">
          Welcome Back
        </h1>
        <p className="text-xs text-ink/60">
          Sign in to access your Islamic Media & Academy portal
        </p>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-deep mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@assurawy.org"
            className="w-full rounded-xl border border-deep/15 bg-slate-50/50 px-4 py-2.5 text-sm text-deep placeholder:text-ink/40 focus:border-[#D4AF37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-deep">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#C5A059] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-deep/15 bg-slate-50/50 px-4 py-2.5 pr-10 text-sm text-deep placeholder:text-ink/40 focus:border-[#D4AF37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-deep/20 text-[#D4AF37] focus:ring-[#D4AF37]"
          />
          <label htmlFor="remember" className="text-xs text-ink/70 font-medium cursor-pointer">
            Remember this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-deep px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-deep/90 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer / Register Link */}
      <div className="mt-6 border-t border-deep/10 pt-4 text-center">
        <p className="text-xs text-ink/60">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#C5A059] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<div className="text-sm font-medium text-deep">Loading page...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}