"use client";

import React, { useState } from 'react';
import { Bell, User, Settings, X, CheckCircle } from 'lucide-react';
export const dynamic = 'force-dynamic';
export default function HeroHeader() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Ranar yau
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Jerin Sanarwar Jaraba (Notifications)
  const notifications = [
    { id: 1, title: "Sabuwar Rajista", time: "Minti 5 da suka wuce", text: "Sabon ɗalibi ya yi rajista a tsarin." },
    { id: 2, title: "Shida/Certificate", time: "Awa 2 da suka wuce", text: "An fitar da sabuwar shida ta Hifz." },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Bangaren Hagu */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>👋</span> Assalamu Alaikum, Abu Abdullah
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            Welcome back to Assurawy LMS
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Today is {today}
          </p>
        </div>

        {/* Bangaren Dama (Buttons) */}
        <div className="flex items-center gap-3 relative">
          
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Notifications Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-800 mb-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" /> Notifications
                  </h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-2.5 bg-slate-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-gray-200">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Button */}
          <a 
            href="/admin/settings"
            className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold hidden sm:inline">Admin Profile</span>
          </a>

          {/* Settings Button */}
          <a 
            href="/admin/settings"
            title="Settings"
            className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </a>

        </div>

      </div>
    </header>
  );
}