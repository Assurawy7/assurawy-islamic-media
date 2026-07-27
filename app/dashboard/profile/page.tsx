"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Award, 
  BarChart2, 
  Download, 
  CheckCircle, 
  Star,
  Camera,
  Settings,
  Lock,
  Moon,
  Sun,
  Globe,
  Bell,
  User,
  ShieldCheck,
  Save,
  Upload
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  date: string;
  downloadUrl: string;
}

interface QuizScore {
  id: string;
  courseName: string;
  score: number;
  totalQuestions: number;
  status: "Passed" | "Failed";
}

export default function StudentProfile() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"profile" | "settings">(
    tabParam === "settings" ? "settings" : "profile"
  );

  useEffect(() => {
    if (tabParam === "settings") {
      setActiveTab("settings");
    } else if (tabParam === "profile") {
      setActiveTab("profile");
    }
  }, [tabParam]);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // User Profile Data
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });

  // Settings States
  const [settings, setSettings] = useState({
    darkMode: false,
    language: "ha",
    notifications: {
      emailAlerts: true,
      quizReminders: true,
      newCourses: false,
    },
    passwords: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  // Dynamic Data daga Database
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);

  // Fetch real user data from API on load
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.name || "",
            email: data.email || "",
            bio: data.bio || "",
            avatarUrl: data.image || data.avatarUrl || "",
          });
          if (data.certificates) setCertificates(data.certificates);
          if (data.quizScores) setQuizScores(data.quizScores);
          if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
    fetchUserData();
  }, []);

  // Handle Image Upload & Auto Save
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setUser((prev) => ({ ...prev, avatarUrl: base64Image }));

      try {
        const res = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: base64Image }),
        });

        if (res.ok) {
          alert("An yi nasarar ajiye sabon hoton ka!");
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      } finally {
        setImageUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Save Profile Form Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        alert("An yi nasarar ajiye bayanan profile dinka!");
      } else {
        alert("An adana bayanan a shafin ka!");
      }
    } catch (error) {
      alert("Error wajen aikawa da bayanai!");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Save All General Settings
  const handleSaveSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        alert("An yi nasarar ajiye duk sauran saitunan ka!");
      } else {
        alert("An adana saitunan!");
      }
    } catch (error) {
      alert("An samu kuskure wajen ajiye saituna!");
    } finally {
      setLoadingSettings(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.passwords.new !== settings.passwords.confirm) {
      alert("Tabbatar da sabuwar kalmar sirri ta yi daidai!");
      return;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: settings.passwords.new }),
      });

      if (res.ok) {
        alert("An yi nasarar canza kalmar sirri!");
      } else {
        alert("An sabunta kalmar sirri!");
      }
    } catch (err) {
      alert("Error wajen canza password!");
    }

    setSettings({
      ...settings,
      passwords: { current: "", new: "", confirm: "" },
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${settings.darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"} py-10 px-4 sm:px-6 lg:px-8 pb-24`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <User className="w-4 h-4" />
            Profile Page
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === "settings"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings Page
          </button>
        </div>

        {/* TAB 1: PROFILE PAGE */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <form onSubmit={handleSaveProfile} className={`rounded-2xl shadow-sm border p-6 sm:p-8 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                
                {/* Avatar with Camera Button */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group">
                    <img
                      src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                      alt={user.name || "User"}
                      className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md"
                    />
                    <label 
                      className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 transition cursor-pointer shadow-md"
                      title="Canza Hoto"
                    >
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {imageUploading && (
                    <span className="text-xs text-amber-600 animate-pulse flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Ana ajiye hoto...
                    </span>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold">{user.name || "Assurawy Student"}</h1>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-medium mb-1">Cikakken Suna (Full Name)</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1">Bio (Bayanin kanka)</label>
                  <textarea
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* SAVE PROFILE BUTTON - An sauke shi kuma aka mai da shi Red */}
              <div className="flex justify-end pt-6 mt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
                >
                  <Save className="w-4 h-4" />
                  {loadingProfile ? "Ana adana..." : "Ajiye Bayanan Profile (Save Profile)"}
                </button>
              </div>
            </form>

            {/* Certificates & Quiz Scores Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`rounded-2xl shadow-sm border p-6 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg text-amber-600 dark:text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">Shaidun Karatu (Certificates)</h2>
                </div>

                <div className="space-y-4">
                  {certificates.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Babu shaida a yanzu.</p>
                  ) : (
                    certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className={`flex items-center justify-between p-4 rounded-xl border ${settings.darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100"} hover:shadow-sm transition`}
                      >
                        <div>
                          <h4 className="font-semibold text-sm">{cert.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Kwanan wata: {cert.date}</p>
                        </div>
                        <a
                          href={cert.downloadUrl}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 p-2 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span>Sauke</span>
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`rounded-2xl shadow-sm border p-6 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">Sakamakon Jarrabawa (Quiz Scores)</h2>
                </div>

                <div className="space-y-4">
                  {quizScores.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Babu jarrabawa a yanzu.</p>
                  ) : (
                    quizScores.map((quiz) => (
                      <div
                        key={quiz.id}
                        className={`p-4 rounded-xl border ${settings.darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100"} space-y-2`}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm">{quiz.courseName}</h4>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> {quiz.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Maki: {quiz.score} / {quiz.totalQuestions}</span>
                            <span>{Math.round((quiz.score / quiz.totalQuestions) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-red-500 h-full rounded-full"
                              style={{ width: `${(quiz.score / quiz.totalQuestions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SETTINGS PAGE */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Settings className="w-6 h-6 text-red-600" />
                  Saituna (Settings)
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gudanar da akanta dakkuma irin tsarin da kake so.</p>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* 1. Change Photo */}
              <div className={`rounded-2xl shadow-sm border p-6 space-y-4 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-700">
                  <Camera className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg">Canza Hoto (Change Photo)</h3>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                    alt="Current Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-red-500"
                  />
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-medium cursor-pointer hover:bg-red-700 transition">
                      <Camera className="w-4 h-4" />
                      <span>Zabi Sabon Hoto</span>
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                    <p className="text-xs text-slate-400">PNG, JPG ko WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* 2. Appearance & Dark Mode */}
              <div className={`rounded-2xl shadow-sm border p-6 space-y-4 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-700">
                  {settings.darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <h3 className="font-bold text-lg">Yanayi (Dark Mode)</h3>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-sm">Dark Theme</p>
                    <p className="text-xs text-slate-400">Canza launin shafi zuwa na dare</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.darkMode ? "bg-red-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 3. Language Preference */}
              <div className={`rounded-2xl shadow-sm border p-6 space-y-4 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-700">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-lg">Harshe (Language)</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-400">Zabi Harshen Dake So</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="ha">Hausa</option>
                    <option value="en">English</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
              </div>

              {/* 4. Notifications */}
              <div className={`rounded-2xl shadow-sm border p-6 space-y-4 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-700">
                  <Bell className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-lg">Sanarwa (Notifications)</h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">Email Alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailAlerts}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, emailAlerts: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">Tunanarwa kan Quizzes</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.quizReminders}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, quizReminders: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* SAVE ALL SETTINGS BUTTON - An mayar da shi Red mai kyau da kyalli */}
              <div className={`md:col-span-2 p-5 rounded-2xl border shadow-sm flex justify-between items-center ${settings.darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-100 text-slate-800"}`}>
                <div className="text-xs text-slate-400 italic">
                  Tabbatar ka danna wannan maɓallin don ajiye duk wasu canje-canje da kayi a saituna.
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loadingSettings}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
                >
                  <Save className="w-4 h-4" />
                  {loadingSettings ? "Ana adana..." : "Ajiye Saitunan (Save All Settings)"}
                </button>
              </div>

              {/* 5. Change Password */}
              <div className={`md:col-span-2 rounded-2xl shadow-sm border p-6 space-y-4 ${settings.darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-700">
                  <Lock className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg">Canza Kalmar Sirri (Change Password)</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={settings.passwords.current}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwords: { ...settings.passwords, current: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={settings.passwords.new}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwords: { ...settings.passwords, new: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={settings.passwords.confirm}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwords: { ...settings.passwords, confirm: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition shadow-md shadow-red-600/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Canza Password
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}