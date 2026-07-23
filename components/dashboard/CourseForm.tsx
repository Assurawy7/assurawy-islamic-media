"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CourseForm({ redirectPrefix }: { redirectPrefix: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Foundational");
  const [priceNaira, setPriceNaira] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const priceKobo = Math.max(0, Math.round(Number(priceNaira || 0) * 100));

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, level, priceKobo }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not create the course.");
      setSubmitting(false);
      return;
    }

    router.push(`${redirectPrefix}/${data.course.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Course Title</label>
        <input
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="e.g. Introduction to Tafseer"
          className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
          URL Slug
        </label>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm font-mono"
        />
        <p className="mt-1 text-xs text-ink/45">Used in the course URL — must be unique.</p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
        >
          <option>Foundational</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>All Levels</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
          Price (₦ Naira — leave as 0 for a free course)
        </label>
        <input
          type="number"
          min={0}
          step="100"
          value={priceNaira}
          onChange={(e) => setPriceNaira(e.target.value)}
          className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
        />
        <p className="mt-1 text-xs text-ink/45">
          Paid courses are charged via Paystack at checkout.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Description</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create Course"}
      </button>
      <p className="text-xs text-ink/45">
        New courses start unpublished — you can add modules and lessons before making it live.
      </p>
    </form>
  );
}
