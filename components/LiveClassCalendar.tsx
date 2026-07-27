"use client";

import { useState } from "react";

interface LiveClass {
  id: string;
  title: string;
  scheduledAt: string;
  status: string;
  platform: string;
  teacher?: { name: string };
}

export default function LiveClassCalendar({
  liveClasses,
}: {
  liveClasses: LiveClass[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lissafin ranakun wata
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Ranakun sati (S, M, T, W, T, F, S)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Canza wata (Gaba / Baya)
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Tattara azuzuwan da ke abada a wannan kwanan wata
  const getClassesForDay = (day: number) => {
    return liveClasses.filter((item) => {
      const classDate = new Date(item.scheduledAt);
      return (
        classDate.getDate() === day &&
        classDate.getMonth() === month &&
        classDate.getFullYear() === year
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          📅 {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 border rounded-lg hover:bg-gray-50 text-sm font-semibold"
          >
            ← Baya
          </button>
          <button
            onClick={nextMonth}
            className="p-2 border rounded-lg hover:bg-gray-50 text-sm font-semibold"
          >
            Gaba →
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2 uppercase">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Fill Empty Slots for First Day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-28 bg-gray-50/50 rounded-xl" />
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayClasses = getClassesForDay(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`h-28 border rounded-xl p-2 flex flex-col justify-between overflow-y-auto ${
                isToday ? "border-emerald-500 bg-emerald-50/20" : "border-gray-100"
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  isToday
                    ? "bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center"
                    : "text-gray-600"
                }`}
              >
                {day}
              </span>

              {/* Class Badges in Day Box */}
              <div className="space-y-1 mt-1">
                {dayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold truncate"
                    title={cls.title}
                  >
                    ⏰ {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {cls.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}