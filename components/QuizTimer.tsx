"use client";

import { useEffect, useRef, useState } from "react";

type QuizTimerProps = {
  /** Total time allowed, in minutes. */
  timeLimitMinutes: number;
  /** Called once, the moment time runs out — use it to auto-submit. */
  onExpire: () => void;
  /** Called on every tick with seconds elapsed since mount — used to record timeTakenSeconds. */
  onTick?: (secondsElapsed: number) => void;
};

/**
 * Countdown timer for timed quizzes. Ticks every second, turns amber under
 * 1 minute and red (with a pulse) under 20 seconds, and fires onExpire
 * exactly once when it hits zero. Survives re-renders of the parent by
 * keeping the deadline in a ref rather than recomputing it.
 */
export default function QuizTimer({ timeLimitMinutes, onExpire, onTick }: QuizTimerProps) {
  const totalSeconds = Math.max(1, Math.round(timeLimitMinutes * 60));
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const expiredRef = useRef(false);
  const deadlineRef = useRef(Date.now() + totalSeconds * 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingMs = deadlineRef.current - Date.now();
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
      setSecondsLeft(remaining);
      onTick?.(totalSeconds - remaining);

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 60;
  const isCritical = secondsLeft <= 20;
  const progress = secondsLeft / totalSeconds;

  return (
    <div
      className={`sticky top-2 z-10 flex items-center gap-3 rounded-xl2 border px-4 py-2.5 shadow-card transition-colors ${
        isCritical
          ? "animate-pulse border-red-300 bg-red-50"
          : isUrgent
            ? "border-amber-300 bg-amber-50"
            : "border-deep/10 bg-white"
      }`}
      role="timer"
      aria-live="polite"
    >
      <span className="text-lg" aria-hidden>
        ⏱️
      </span>
      <div className="flex-1">
        <p
          className={`font-display text-lg font-bold tabular-nums ${
            isCritical ? "text-red-600" : isUrgent ? "text-amber-600" : "text-deep"
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-deep/10">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isCritical ? "bg-red-500" : isUrgent ? "bg-amber-500" : "bg-emerald"
            }`}
            style={{ width: `${Math.max(0, progress) * 100}%` }}
          />
        </div>
      </div>
      {isUrgent && (
        <span className={`text-xs font-semibold ${isCritical ? "text-red-600" : "text-amber-600"}`}>
          {isCritical ? "Time almost up!" : "Hurry up"}
        </span>
      )}
    </div>
  );
}
