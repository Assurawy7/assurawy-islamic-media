"use client";

import { useEffect, useState } from "react";
import LiveClassCard from "./LiveClassCard";

interface LiveClass {
  id: string;
  title: string;
  meetingUrl: string;
  scheduledAt: string;
  duration: number;
  status: string;
  teacher: {
    name: string;
  };
}

export default function LiveClassesWidget({ userId }: { userId?: string }) {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/live-classes");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Ware azuzuwan da ba su kare ba kawai (UPCOMING ko LIVE)
          const activeClasses = data
            .filter((item) => item.status !== "ENDED" && item.status !== "CANCELLED")
            .slice(0, 3); // Samo guda 3 na kusa kawai

          setClasses(activeClasses);
        }
      } catch (err) {
        console.error("Error fetching widget classes", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-100 rounded-xl mb-3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🔴 Azuzuwan Kai Tsaye (Live Classes)
          </h2>
          <p className="text-xs text-gray-500">Azuzuwan da za a gudanar kwanan nan</p>
        </div>
        <a
          href="/live-classes"
          className="text-xs font-semibold text-emerald-600 hover:underline"
        >
          Duba Duka →
        </a>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500">Babu wani aji mai zuwa a yanzu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((item) => (
            <LiveClassCard
              key={item.id}
              id={item.id}
              title={item.title}
              meetingUrl={item.meetingUrl}
              scheduledAt={item.scheduledAt}
              duration={item.duration}
              status={item.status}
              teacherName={item.teacher?.name || "Malami"}
              studentId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}