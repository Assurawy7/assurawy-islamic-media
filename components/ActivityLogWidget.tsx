"use client";

import { useEffect, useState } from "react";

interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
}

export default function ActivityLogWidget({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`/api/activity-logs?userId=${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLogs(data);
        }
      } catch (err) {
        console.error("Error loading logs", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchLogs();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-gray-100 rounded mb-2"></div>
        <div className="h-10 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        📊 Tarihin Ayyuka da Motsi (Activity History)
      </h3>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Babu wani tarihi da aka rubuta tukuna.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                {log.details && <p className="text-xs text-gray-500">{log.details}</p>}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {new Date(log.createdAt).toLocaleDateString("ha-NG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}