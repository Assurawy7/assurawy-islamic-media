"use client";

import { useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: { name: string; role: string };
};

export default function AnnouncementsManager({ roleLabel }: { roleLabel: string }) {
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setItems(data.announcements ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setError(null);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not post the announcement.");
    } else {
      setTitle("");
      setBody("");
      await load();
    }
    setPosting(false);
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">{roleLabel}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Announcements</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4 rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Message</label>
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={posting}
          className="focus-ring rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post Announcement"}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {items?.map((a) => (
          <div key={a.id} className="rounded-xl2 border border-deep/10 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-deep">{a.title}</h3>
              <span className="text-xs text-ink/45">
                {a.author.name} · {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{a.body}</p>
          </div>
        ))}
        {items?.length === 0 && <p className="text-sm text-ink/50">No announcements yet.</p>}
      </div>
    </div>
  );
}
