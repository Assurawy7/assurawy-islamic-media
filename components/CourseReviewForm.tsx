"use client";

import { useState } from "react";

export default function CourseReviewForm({
  courseId,
  studentId,
}: {
  courseId: string;
  studentId: string;
}) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentId, rating, review }),
      });

      if (res.ok) {
        setMessage("✅ Nagode! An aika sharhin ku cikin nasara.");
        setReview("");
      } else {
        setMessage("❌ Kuskure ya faru, da fatan sake gwada idan an jima.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Kuskure wajen tura bayanai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">⭐ Aike da Sharhi (Course Review)</h3>
      <p className="text-xs text-gray-500 mb-4">Mene ne ra'ayinka game da wannan darasi?</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Select (1 to 5 Stars) */}
        <div>
          <label className="block text-sm font-medium mb-1">Kimantawa (Rating)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition ${
                  star <= rating ? "text-amber-400 scale-110" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium mb-1">Sharhi / Ra'ayi</label>
          <textarea
            rows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Rubuta albarkacin bakinka ko shawarar gyara..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow transition"
        >
          {loading ? "Ana turawa..." : "Tura Sharhi"}
        </button>

        {message && <p className="text-xs font-medium mt-2">{message}</p>}
      </form>
    </div>
  );
}