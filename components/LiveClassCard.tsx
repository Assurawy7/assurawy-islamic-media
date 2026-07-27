"use client";

import { useState, useEffect } from "react";

interface LiveClassProps {
  id: string;
  title: string;
  meetingUrl: string;
  scheduledAt: string;
  duration: number;
  status: string;
  teacherName: string;
  studentId?: string; // Idan logged in user dalibi ne
}

export default function LiveClassCard({
  id,
  title,
  meetingUrl,
  scheduledAt,
  status,
  teacherName,
  studentId,
}: LiveClassProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [isLive, setIsLive] = useState(status === "LIVE");

  useEffect(() => {
    const targetDate = new Date(scheduledAt).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0 || status === "LIVE") {
        setIsLive(true);
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [scheduledAt, status]);

  // Handler lokacin da ɗalibi ya danna Join
  const handleJoinClass = async () => {
    if (studentId) {
      try {
        await fetch(`/api/live-classes/${id}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        });
      } catch (err) {
        console.error("Attendance log failed", err);
      }
    }
    // Bude link din Zoom ko Meet a sabon tab
    window.open(meetingUrl, "_blank");
  };

  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isLive
                ? "bg-red-500 text-white animate-pulse"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isLive ? "🔴 LIVE NOW" : "🟡 UPCOMING"}
          </span>
          <span className="text-xs text-gray-500">Malami: {teacherName}</span>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="text-xs text-gray-500 mb-4">
          Lokaci: {new Date(scheduledAt).toLocaleString()}
        </p>
      </div>

      {/* Countdown View */}
      {!isLive && timeLeft && (
        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Za a fara gudanarwa a:</p>
          <div className="flex justify-center gap-2 text-sm font-mono font-bold text-emerald-700">
            <span>{String(timeLeft.hours).padStart(2, "0")}h</span>:
            <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
            <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      {isLive ? (
        <button
          onClick={handleJoinClass}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition"
        >
          🚀 Shiga Aji Yanzu (Join Class)
        </button>
      ) : (
        <button
          disabled
          className="w-full py-2.5 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed"
        >
          ⏳ Aji Bai Fara Ba Tukunna
        </button>
      )}
    </div>
  );
}