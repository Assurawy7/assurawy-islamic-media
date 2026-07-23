import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import GamificationPanel from "@/components/dashboard/GamificationPanel";
import IslamicPattern from "@/components/IslamicPattern";

export const metadata = { title: "Student Dashboard — Assurawy Islamic Media" };

export default async function DashboardPage() {
  // Guaranteed non-null: middleware already redirects unauthenticated
  // visitors to /login before this page ever renders.
  const session = (await getSession())!;

  const [user, enrollments, certificates, quizAttempts] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.sub }, select: { name: true } }),
    prisma.enrollment.findMany({
      where: { studentId: session.sub },
      include: { course: { include: { modules: { include: { lessons: true } } } } },
    }),
    prisma.certificate.findMany({ where: { studentId: session.sub }, orderBy: { issuedAt: "desc" } }),
    prisma.quizAttempt.findMany({
      where: { studentId: session.sub },
      orderBy: { submittedAt: "desc" },
      take: 5,
      include: { quiz: { select: { title: true } } },
    }),
  ]);

  const completedLessonIds = new Set(
    (
      await prisma.lessonProgress.findMany({
        where: { studentId: session.sub },
        select: { lessonId: true },
      })
    ).map((p) => p.lessonId)
  );

  const courses = enrollments.map((e) => {
    const lessons = e.course.modules.flatMap((m) => m.lessons);
    const total = lessons.length;
    const completed = lessons.filter((l) => completedLessonIds.has(l.id)).length;
    return {
      id: e.course.id,
      title: e.course.title,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      completedLessons: completed,
      totalLessons: total,
    };
  });

  const firstName = (user?.name ?? "").split(" ")[0] || "Student";

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Student Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-deep">
            Assalamu Alaikum, {firstName}
          </h1>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 font-display text-xl font-semibold text-emerald">
          {firstName[0]?.toUpperCase()}
        </div>
      </div>

      <IslamicPattern className="mb-10 -mt-4" />

      {/* SUMMARY */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Enrolled Courses</p>
          <p className="mt-2 font-display text-3xl font-semibold text-deep">{courses.length}</p>
        </div>
        <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Lessons Completed</p>
          <p className="mt-2 font-display text-3xl font-semibold text-deep">
            {courses.reduce((s, c) => s + c.completedLessons, 0)}
          </p>
        </div>
        <div className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Certificates Earned</p>
          <p className="mt-2 font-display text-3xl font-semibold text-deep">{certificates.length}</p>
        </div>
      </div>

      {/* ENROLLED COURSES */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-semibold text-deep">Your Courses</h2>
        <div className="mt-5 space-y-4">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="focus-ring block rounded-xl2 border border-deep/10 bg-white p-6 shadow-card transition hover:border-emerald/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-deep">{c.title}</h3>
                <span className="text-sm text-ink/60">
                  {c.completedLessons}/{c.totalLessons} lessons
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className={`h-full rounded-full ${c.progress === 100 ? "bg-gold" : "bg-emerald"}`}
                  style={{ width: `${c.progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink/50">{c.progress}% complete</p>
            </Link>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-ink/50">
              You're not enrolled in any courses yet.{" "}
              <Link href="/courses" className="font-semibold text-emerald hover:text-deep">
                Browse courses →
              </Link>
            </p>
          )}
        </div>
      </div>

      <GamificationPanel />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* QUIZ SCORES */}
        <div>
          <h2 className="font-display text-xl font-semibold text-deep">Recent Quiz Scores</h2>
          <div className="mt-5 divide-y divide-deep/10 rounded-xl2 border border-deep/10 bg-white shadow-card">
            {quizAttempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-ink/75">{a.quiz.title}</span>
                <span className={`text-sm font-semibold ${a.passed ? "text-deep" : "text-red-600"}`}>
                  {a.score}/{a.maxScore}
                </span>
              </div>
            ))}
            {quizAttempts.length === 0 && (
              <p className="px-6 py-4 text-sm text-ink/50">No quiz attempts yet.</p>
            )}
          </div>
        </div>

        {/* CERTIFICATES */}
        <div>
          <h2 className="font-display text-xl font-semibold text-deep">Certificates</h2>
          <div className="mt-5 space-y-4">
            {certificates.map((c) => (
              <div key={c.id} className="rounded-xl2 border border-gold/40 bg-cream p-6 shadow-card">
                <p className="font-display text-lg font-semibold text-deep">{c.courseTitle}</p>
                <p className="mt-1 text-xs text-ink/60">Certificate ID: {c.certificateNo}</p>
                <p className="text-xs text-ink/60">
                  Issued{" "}
                  {new Date(c.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <a
                  href={`/api/certificates/${encodeURIComponent(c.certificateNo)}/pdf`}
                  className="focus-ring mt-4 inline-block rounded-full border border-gold px-4 py-2 text-xs font-semibold text-deep hover:bg-gold"
                >
                  Download Certificate
                </a>
              </div>
            ))}
            {certificates.length === 0 && (
              <p className="text-sm text-ink/50">Complete a course to earn your first certificate.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
