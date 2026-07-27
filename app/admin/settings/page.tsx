"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Globe, ShieldCheck, Bell, Palette, CheckCircle2, AlertCircle, Upload, Loader2 } from "lucide-react";
export const dynamic = 'force-dynamic';
export default function SettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings state
  const [siteName, setSiteName] = useState("Assurawy");
  const [tagline, setTagline] = useState("Qur'an Academy");
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [primaryColor, setPrimaryColor] = useState("#D4AF37");
  const [fontFamily, setFontFamily] = useState("serif");
  const [defaultLang, setDefaultLang] = useState("ha");

  const [supportEmail, setSupportEmail] = useState("hello@assurawy.org");
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Fetch Existing Settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.siteName) setSiteName(data.siteName);
          if (data.siteTagline) setTagline(data.siteTagline);
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.primaryColor) setPrimaryColor(data.primaryColor);
          if (data.fontFamily) setFontFamily(data.fontFamily);
          if (data.defaultLang) setDefaultLang(data.defaultLang);
          if (data.supportEmail) setSupportEmail(data.supportEmail);
          if (typeof data.allowRegistration === "boolean") setAllowRegistration(data.allowRegistration);
          if (typeof data.maintenanceMode === "boolean") setMaintenanceMode(data.maintenanceMode);
          if (typeof data.emailNotifications === "boolean") setEmailNotifications(data.emailNotifications);
        }
      } catch (err) {
        console.error("Failed to load site settings", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // 🚀 Direct Logo Upload
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setLogoUrl(data.fileUrl);
        setMessage({
          type: "success",
          text: "An ɗora sabon Logo cikin nasara! Danna 'Save Changes' don adanawa.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "An samu kuskure wajen dora hoto.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An samu matsala wajen sadarwa da server.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Save Settings & Refresh Layout Server Cache
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          siteTagline: tagline,
          logoUrl,
          primaryColor,
          fontFamily,
          defaultLang,
          supportEmail,
          allowRegistration,
          maintenanceMode,
          emailNotifications,
        }),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "An adana dukkan saite-saiten cikin nasara!",
        });
        
        // 🔄 Wannan zai tilasta Next.js sake gina Layout din da sabon harshe/saiti
        router.refresh();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setMessage({
          type: "error",
          text: "Kuskure wajen adana saiti. Tabbatar cewa ka shiga a matsayin Admin.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An samu matsalar sadarwa. Da fatan ka sake gwadawa.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          Ana ɗauko saite-saiten shafi...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">Admin Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gudanar da Logo, Sunan Academy, Launuka, Font, Harshe, da Tsaron Assurawy LMS.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving || isUploading}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding & Logo Upload */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <Palette className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Branding & Customization</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo Image Input & Direct Upload */}
            <div className="md:col-span-2 bg-gray-50/70 p-4 rounded-xl border space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Logo / Hoto
              </label>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Preview Box */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-300 bg-white p-1 shadow-sm flex items-center justify-center">
                  <img src={logoUrl} alt="Logo Preview" className="h-full w-full object-contain rounded-lg" />
                </div>

                {/* Upload Button */}
                <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium text-sm transition">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? "Ana dorawa..." : "Dora Sabon Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {/* Manual Text Input */}
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/logo.png ko URL"
                  className="flex-1 rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Font Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Zaɓi Font Style</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-white"
              >
                <option value="serif">Amiri / Classical Serif (Islamic)</option>
                <option value="sans">Inter / Modern Sans-Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>

            {/* Default Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tsohuwar Harshe (Default Language)</label>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-white"
              >
                <option value="ha">Hausa</option>
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>

            {/* Primary Theme Color */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Babban Launi (Primary Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer p-1"
                />
                <span className="text-xs font-mono font-bold text-gray-600">{primaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <Globe className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">General Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Access & Security */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Access & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Allow New Student Registration</h3>
                <p className="text-xs text-gray-500">Enable or disable new user account creation.</p>
              </div>
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <h3 className="font-semibold text-gray-800">Maintenance Mode</h3>
                <p className="text-xs text-gray-500">Temporarily disable student portal for updates.</p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <Bell className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Email Alerts for Admin</h3>
              <p className="text-xs text-gray-500">Receive notifications on new enrollments and payments.</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  );
}