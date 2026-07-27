"use client";

import { useEffect, useState } from "react";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  meetingUrl: string;
  platform: string;
  scheduledAt: string;
  duration: number;
  status: string;
  teacher: Teacher;
}

export default function LiveClassesPage() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [platform, setPlatform] = useState("ZOOM");
  const [teacherId, setTeacherId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch Live Classes & Teachers
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes
      const resClass = await fetch("/api/live-classes");
      const dataClass = await resClass.json();
      if (Array.isArray(dataClass)) setLiveClasses(dataClass);

      // Fetch teachers for dropdown (Assumes /api/teacher exists)
      const resTeachers = await fetch("/api/teacher");
      const dataTeachers = await resTeachers.json();
      if (Array.isArray(dataTeachers)) setTeachers(dataTeachers);
    } catch (err) {
      console.error("Kuskure wajen zakulo bayanai:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Form (Create / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      meetingUrl,
      platform,
      teacherId,
      scheduledAt,
      duration: Number(duration),
    };

    try {
      if (editingId) {
        // EDIT
        await fetch(`/api/live-classes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        await fetch("/api/live-classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error("Kuskure wajen adana aji:", err);
    }
  };

  // Delete Class
  const handleDelete = async (id: string) => {
    if (!confirm("Shin ka tabbata kana son goge wannan ajin?")) return;
    try {
      await fetch(`/api/live-classes/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Kuskure wajen goge aji:", err);
    }
  };

  // Open Edit Form
  const handleEdit = (item: LiveClass) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setMeetingUrl(item.meetingUrl);
    setPlatform(item.platform);
    setTeacherId(item.teacher.id);
    setScheduledAt(new Date(item.scheduledAt).toISOString().slice(0, 16));
    setDuration(item.duration);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMeetingUrl("");
    setPlatform("ZOOM");
    setTeacherId("");
    setScheduledAt("");
    setDuration(60);
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Classes</h1>
          <p className="text-sm text-gray-500">Gudanar da azuzuwan kai tsaye</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow"
        >
          ➕ Create Live Class
        </button>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "✏️ Edit Live Class" : "➕ Create Live Class"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Misali: Siyar da Darasin Fiqhu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Malami (Teacher Dropdown)</label>
                <select
                  required
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Zaɓi Malami --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="ZOOM">Zoom</option>
                    <option value="MEET">Google Meet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (Mintuna)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meeting URL</label>
                <input
                  type="url"
                  required
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="https://zoom.us/j/... ko https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Soke (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {editingId ? "Gyarawa" : "Ƙirƙira"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class List Table */}
      {loading ? (
        <p className="text-center py-8">Ana loda bayanai...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-medium text-gray-600">Aji</th>
                <th className="p-4 text-sm font-medium text-gray-600">Malami</th>
                <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                <th className="p-4 text-sm font-medium text-gray-600">Lokaci</th>
                <th className="p-4 text-sm font-medium text-gray-600">Ayyuka</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {liveClasses.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">{item.title}</td>
                  <td className="p-4 text-sm text-gray-600">{item.teacher?.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full font-bold ${
                        item.status === "LIVE"
                          ? "bg-red-100 text-red-600"
                          : item.status === "ENDED"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status === "LIVE" ? "🔴 Live Now" : item.status === "ENDED" ? "⬛ Ended" : "🟡 Upcoming"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(item.scheduledAt).toLocaleString()}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}