"use client";

import { useState } from "react";

interface AssignmentProps {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  studentId: string;
  isSubmitted?: boolean;
}

export default function AssignmentSubmitCard({
  id,
  title,
  description,
  dueDate,
  studentId,
  isSubmitted = false,
}: AssignmentProps) {
  const [answer, setAnswer] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(isSubmitted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: id,
          studentId,
          answer,
          fileUrl,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        {submitted ? (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
            ✅ An Miƙa Amsa
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">
            ⏳ Yana Jiran Amsa
          </span>
        )}
      </div>

      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}

      {dueDate && (
        <p className="text-xs text-red-500 font-medium mb-4">
          ⏰ Ranar Ƙarshe: {new Date(dueDate).toLocaleString()}
        </p>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3 mt-4 border-t pt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Rubuta Amsarki/Amsarka
            </label>
            <textarea
              rows={3}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Rubuta amsarka dalla-dalla a nan..."
              className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Hanyar Fayil/PDF (Link idan akwai)
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://drive.google.com/file/..."
              className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow transition"
          >
            {loading ? "Ana tura amsa..." : "🚀 Miƙa Amsa"}
          </button>
        </form>
      ) : (
        <p className="text-xs text-gray-500 italic mt-2">
          An riga an miƙa wannan aikin gida. Nagode!
        </p>
      )}
    </div>
  );
}