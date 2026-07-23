"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Badge = { code: string; name: string; description: string; icon: string; earnedAt: string };
type Profile = {
  points: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  badges: Badge[];
};

export default function GamificationPanel() {
  const [data, setData] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/gamification/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-deep">Your Progress</h2>
        <Link href="/dashboard/leaderboard" className="focus-ring text-sm font-semibold text-emerald hover:text-deep">
          View Leaderboard →
        </Link>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl2 border border-gold/30 bg-gradient-to-br from-deep to-emerald p-6 text-cream shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-cream/70">Points</p>
          <p className="mt-2 font-display text-3xl font-semibold text-gold">{data.points}</p>
          <p className="mt-1 text-xs text-cream/60">Rank #{data.rank} on the leaderboard</p>
        </div>
        <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Current Streak</p>
          <p className="mt-2 font-display text-3xl font-semibold text-deep">
            🔥 {data.currentStreak} {data.currentStreak === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-xs text-ink/45">Longest: {data.longestStreak} days</p>
        </div>
        <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Badges Earned</p>
          <p className="mt-2 font-display text-3xl font-semibold text-deep">{data.badges.length}</p>
          <p className="mt-1 text-xs text-ink/45">Keep learning to unlock more</p>
        </div>
      </div>

      {data.badges.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {data.badges.map((b) => (
            <div
              key={b.code}
              title={b.description}
              className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2"
            >
              <span className="text-lg">{b.icon}</span>
              <span className="text-xs font-semibold text-deep">{b.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
