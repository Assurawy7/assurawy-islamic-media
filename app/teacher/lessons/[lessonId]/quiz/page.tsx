"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
export const dynamic = 'force-dynamic';
type QuestionType = "MULTIPLE_CHOICE" | "SHORT_ANSWER";
type Question = {
  id?: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  points: number;
};

const blankQuestion = (): Question => ({
  type: "MULTIPLE_CHOICE",
  prompt: "",
  options: ["", ""],
  correctAnswer: "",
  points: 1,
});

export default function QuizBuilderPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();

  const [quizId, setQuizId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([blankQuestion()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/lessons/${lessonId}/quiz`);
    const data = await res.json().catch(() => ({}));
    if (data.quiz) {
      setQuizId(data.quiz.id);
      setTitle(data.quiz.title);
      setPassingScore(data.quiz.passingScore);
      setQuestions(
        data.quiz.questions.map((q: any) => ({
          id: q.id,
          type: q.type,
          prompt: q.prompt,
          options: q.options ?? ["", ""],
          correctAnswer: q.correctAnswer,
          points: q.points,
        }))
      );
    }
    setLoading(false);
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  function updateQuestion(index: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) } : q
      )
    );
  }

  function addOption(qIndex: number) {
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q))
    );
  }

  function removeOption(qIndex: number, oIndex: number) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.filter((_, j) => j !== oIndex) } : q
      )
    );
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, blankQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      title,
      passingScore,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        prompt: q.prompt,
        options: q.type === "MULTIPLE_CHOICE" ? q.options.filter((o) => o.trim() !== "") : undefined,
        correctAnswer: q.correctAnswer,
        points: q.points,
      })),
    };

    const res = quizId
      ? await fetch(`/api/quizzes/${quizId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/lessons/${lessonId}/quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not save the quiz.");
      setSaving(false);
      return;
    }

    setQuizId(data.quiz.id);
    setSaving(false);
    setSaved(true);
  }

  async function handleDelete() {
    if (!quizId) return;
    if (!confirm("Delete this quiz entirely?")) return;
    await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" });
    router.back();
  }

  if (loading) return <p className="text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
        {quizId ? "Edit Quiz" : "New Quiz"}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Quiz Builder</h1>

      <form onSubmit={handleSave} className="mt-6 max-w-3xl space-y-6">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {saved && (
          <p className="rounded-lg bg-emerald/10 px-3 py-2 text-sm font-medium text-emerald">
            Quiz saved.
          </p>
        )}

        <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
                Quiz Title
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Taharah — Chapter Quiz"
                className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
                Passing Score (%)
              </label>
              <input
                required
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-sm font-semibold text-deep">Question {i + 1}</p>
                <div className="flex items-center gap-3">
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(i, {
                        type: e.target.value as QuestionType,
                        options: e.target.value === "MULTIPLE_CHOICE" ? ["", ""] : [],
                      })
                    }
                    className="focus-ring rounded-lg border border-deep/15 px-2 py-1.5 text-xs"
                  >
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    className="focus-ring text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <textarea
                required
                value={q.prompt}
                onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                placeholder="Question prompt"
                rows={2}
                className="focus-ring mt-3 w-full rounded-lg border border-deep/15 px-3 py-2 text-sm"
              />

              {q.type === "MULTIPLE_CHOICE" ? (
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        required
                        value={opt}
                        onChange={(e) => updateOption(i, oi, e.target.value)}
                        placeholder={`Option ${oi + 1}`}
                        className="focus-ring flex-1 rounded-lg border border-deep/15 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(i, oi)}
                        className="focus-ring text-xs text-ink/40 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(i)}
                    className="focus-ring text-xs font-semibold text-emerald hover:text-deep"
                  >
                    + Add Option
                  </button>

                  <div className="mt-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
                      Correct Answer
                    </label>
                    <select
                      required
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(i, { correctAnswer: e.target.value })}
                      className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2 text-sm"
                    >
                      <option value="">Select the correct option…</option>
                      {q.options
                        .filter((o) => o.trim() !== "")
                        .map((o, oi) => (
                          <option key={oi} value={o}>
                            {o}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
                    Expected Answer
                  </label>
                  <input
                    required
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(i, { correctAnswer: e.target.value })}
                    placeholder="Graded as a case-insensitive exact match"
                    className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">
                  Points
                </label>
                <input
                  type="number"
                  min={1}
                  value={q.points}
                  onChange={(e) => updateQuestion(i, { points: Number(e.target.value) })}
                  className="focus-ring w-24 rounded-lg border border-deep/15 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="focus-ring rounded-full border border-emerald px-5 py-2.5 text-sm font-semibold text-emerald hover:bg-emerald/10"
        >
          + Add Question
        </button>

        <div className="flex flex-wrap items-center gap-3 border-t border-deep/10 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="focus-ring rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
          >
            {saving ? "Saving…" : quizId ? "Save Changes" : "Create Quiz"}
          </button>
          {quizId && (
            <button
              type="button"
              onClick={handleDelete}
              className="focus-ring rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Delete Quiz
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
