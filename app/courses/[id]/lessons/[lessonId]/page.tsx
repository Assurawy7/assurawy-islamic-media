"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Question = {
  id: string;
  type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  prompt: string;
  options?: string[] | null;
  points: number;
};
type Quiz = { id: string; title: string; passingScore: number; questions: Question[] };
type LessonData = {
  id: string;
  title: string;
  videoUrl?: string | null;
  content?: string | null;
  attachments: { id: string; fileName: string; fileUrl: string }[];
  quiz: Quiz | null;
};

export default function LessonPlayerPage() {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Could not load lesson.");
        setLesson(data.lesson);
        setCourseTitle(data.course.title);
        setCompleted(data.completed);
      })
      .catch((e) => setError(e.message));
  }, [lessonId]);

  async function markComplete() {
    setMarking(true);
    setFlash(null);
    setError(null);
    const res = await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
    const data = await res.json();
    setMarking(false);
    if (!res.ok) {
      setError(data.error || "Could not mark lesson complete.");
      return;
    }
    setCompleted(true);
    const parts: string[] = [];
    if (data.gamification) {
      parts.push(`+${data.gamification.pointsAwarded} points`, `${data.gamification.currentStreak}-day streak`);
    }
    if (data.certificateIssued) parts.push("🎓 Certificate earned! Check your dashboard.");
    setFlash(parts.join(" · ") || "Lesson marked complete.");
  }

  async function submitQuiz() {
    if (!lesson?.quiz) return;
    setSubmittingQuiz(true);
    setError(null);
    const res = await fetch(`/api/quizzes/${lesson.quiz.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setSubmittingQuiz(false);
    if (!res.ok) {
      setError(data.error || "Could not submit quiz.");
      return;
    }
    setQuizResult(data.attempt);
    if (data.gamification) {
      setFlash(`+${data.attempt.passed ? "points earned" : ""} ${data.gamification.currentStreak}-day streak`.trim());
    }
  }

  if (error && !lesson) {
    return <section className="mx-auto max-w-3xl px-5 py-20 text-center text-ink/70">{error}</section>;
  }
  if (!lesson) {
    return <section className="mx-auto max-w-3xl px-5 py-20 text-center text-ink/50">Loading…</section>;
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <Link href={`/courses/${courseId}`} className="text-xs font-semibold text-emerald hover:text-deep">
        ← Back to {courseTitle}
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-deep md:text-3xl">{lesson.title}</h1>

      {flash && (
        <div className="mt-4 rounded-xl2 border border-gold/40 bg-cream p-4 text-sm font-medium text-deep">
          {flash}
        </div>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {lesson.videoUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-xl2 border border-deep/10 bg-black shadow-card">
          <video src={lesson.videoUrl} controls className="h-full w-full" />
        </div>
      )}

      {lesson.content && (
        <div className="mt-6 whitespace-pre-wrap rounded-xl2 border border-deep/10 bg-white p-6 text-sm leading-relaxed text-ink/80 shadow-card">
          {lesson.content}
        </div>
      )}

      {lesson.attachments.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-deep">Attachments</h2>
          <ul className="mt-2 space-y-2">
            {lesson.attachments.map((a) => (
              <li key={a.id}>
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring text-sm font-medium text-emerald hover:text-deep"
                >
                  📎 {a.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        {completed ? (
          <span className="rounded-full bg-emerald/10 px-5 py-2.5 text-sm font-semibold text-emerald">
            ✓ Lesson completed
          </span>
        ) : (
          <button
            onClick={markComplete}
            disabled={marking}
            className="focus-ring rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white hover:bg-deep disabled:opacity-60"
          >
            {marking ? "Saving…" : "Mark Lesson Complete"}
          </button>
        )}
      </div>

      {lesson.quiz && (
        <div className="mt-10 rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-deep">{lesson.quiz.title}</h2>
          <p className="mt-1 text-xs text-ink/50">Passing score: {lesson.quiz.passingScore}%</p>

          {quizResult ? (
            <div
              className="mt-4 rounded-lg border p-4"
              style={{ borderColor: quizResult.passed ? "#1C6B4F" : "#ef4444" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: quizResult.passed ? "#1C6B4F" : "#ef4444" }}
              >
                {quizResult.passed ? "✓ Passed" : "✕ Not passed"} — {quizResult.score}/{quizResult.maxScore} (
                {quizResult.percentage}%)
              </p>
              {!quizResult.passed && (
                <button
                  onClick={() => {
                    setQuizResult(null);
                    setAnswers({});
                  }}
                  className="focus-ring mt-3 text-xs font-semibold text-emerald hover:text-deep"
                >
                  Try again →
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              {lesson.quiz.questions.map((q, i) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-ink/80">
                    {i + 1}. {q.prompt}
                  </p>
                  {q.type === "MULTIPLE_CHOICE" && q.options ? (
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm text-ink/70">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      className="focus-ring mt-2 w-full rounded-lg border border-deep/15 px-3 py-2 text-sm"
                      placeholder="Your answer"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={submitQuiz}
                disabled={submittingQuiz}
                className="focus-ring rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-deep hover:bg-goldLight disabled:opacity-60"
              >
                {submittingQuiz ? "Submitting…" : "Submit Quiz"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
