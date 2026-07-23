"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnrollButton({
  courseId,
  priceKobo,
  isLoggedIn,
}: {
  courseId: string;
  priceKobo: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?next=/courses/${courseId}`);
      return;
    }

    setLoading(true);
    setError(null);

    if (priceKobo <= 0) {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Could not enroll.");
        return;
      }
      router.push("/dashboard");
      return;
    }

    const res = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not start payment.");
      return;
    }
    if (data.free) {
      router.push("/dashboard");
      return;
    }
    window.location.href = data.authorizationUrl;
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="focus-ring rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-deep transition hover:bg-goldLight disabled:opacity-60"
      >
        {loading
          ? "Please wait…"
          : priceKobo > 0
          ? `Pay ₦${(priceKobo / 100).toLocaleString()} & Enroll`
          : "Enroll for Free"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
