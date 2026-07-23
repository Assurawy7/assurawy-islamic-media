"use client";

import { useEffect, useState } from "react";

type Row = { rank: number; name: string; points: number; currentStreak: number; isMe: boolean };

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetch("/api/gamification/leaderboard")
      .then((r) => r.json())
      .then((d) => setRows(d.leaderboard))
      .catch(() => setRows([]));
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Leaderboard</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Top Learners</h1>
      <p className="mt-2 text-sm text-ink/60">
        Ranked by points earned from completing lessons, passing quizzes, and finishing courses.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl2 border border-deep/10 bg-white shadow-card">
        {rows === null && <p className="p-6 text-sm text-ink/50">Loading...</p>}
        {rows?.map((r) => (
          <div
            key={r.rank}
            className={`flex items-center justify-between border-b border-deep/10 px-6 py-4 last:border-0 ${
              r.isMe ? "bg-gold/10" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  r.rank <= 3 ? "bg-gold text-deep" : "bg-sand text-ink/60"
                }`}
              >
                {r.rank}
              </span>
              <div>
                <p className="text-sm font-medium text-deep">
                  {r.name} {r.isMe && <span className="text-xs text-emerald">(You)</span>}
                </p>
                <p className="text-xs text-ink/50">🔥 {r.currentStreak}-day streak</p>
              </div>
            </div>
            <p className="font-display text-lg font-semibold text-deep">{r.points} pts</p>
          </div>
        ))}
        {rows && rows.length === 0 && (
          <p className="p-6 text-sm text-ink/50">No students on the leaderboard yet.</p>
        )}
      </div>
    </section>
  );
}
