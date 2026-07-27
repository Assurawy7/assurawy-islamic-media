import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getOwnedCourse } from "@/lib/course-access";
export const dynamic = 'force-dynamic';
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const course = await getOwnedCourse(params.id, session);
  if (!course) return NextResponse.json({ error: "Course not found or not yours." }, { status: 404 });

  const full = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: { include: { lessons: { include: { quiz: true } } } },
      enrollments: { include: { student: { select: { id: true, name: true, email: true } } } },
    },
  });
  if (!full) return NextResponse.json({ error: "Course not found." }, { status: 404 });

  const allLessons = full.modules.flatMap((m) => m.lessons);
  const quizIds = allLessons.filter((l) => l.quiz).map((l) => l.quiz!.id);

  const students = await Promise.all(
    full.enrollments.map(async (e) => {
      const completed = await prisma.lessonProgress.count({
        where: { studentId: e.studentId, lessonId: { in: allLessons.map((l) => l.id) } },
      });
      const attempts = await prisma.quizAttempt.findMany({
        where: { studentId: e.studentId, quizId: { in: quizIds } },
        orderBy: { submittedAt: "desc" },
      });
      const bestByQuiz = new Map<string, number>();
      for (const a of attempts) {
        if (!bestByQuiz.has(a.quizId) || bestByQuiz.get(a.quizId)! < a.percentage) {
          bestByQuiz.set(a.quizId, a.percentage);
        }
      }
      const avgQuizScore =
        bestByQuiz.size === 0
          ? null
          : Math.round(
              [...bestByQuiz.values()].reduce((s, v) => s + v, 0) / bestByQuiz.size
            );

      return {
        studentId: e.studentId,
        name: e.student.name,
        email: e.student.email,
        totalLessons: allLessons.length,
        completedLessons: completed,
        progress: allLessons.length === 0 ? 0 : Math.round((completed / allLessons.length) * 100),
        avgQuizScore,
        quizzesTaken: bestByQuiz.size,
      };
    })
  );

  const totalStudents = students.length;
  const avgProgress =
    totalStudents === 0
      ? 0
      : Math.round(students.reduce((s, st) => s + st.progress, 0) / totalStudents);
  const completedCount = students.filter((s) => s.progress === 100).length;

  return NextResponse.json({
    course: { id: full.id, title: full.title },
    summary: { totalStudents, avgProgress, completedCount },
    students,
  });
}
