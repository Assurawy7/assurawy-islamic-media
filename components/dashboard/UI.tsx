export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-deep">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

export function ProgressBar({ percent, tone = "emerald" }: { percent: number; tone?: "emerald" | "gold" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
      <div
        className={`h-full rounded-full ${tone === "gold" ? "bg-gold" : "bg-emerald"}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export function Badge({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "gold" | "red" | "neutral" }) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald/10 text-emerald",
    gold: "bg-gold/15 text-deep",
    red: "bg-red-50 text-red-600",
    neutral: "bg-sand text-ink/60",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
