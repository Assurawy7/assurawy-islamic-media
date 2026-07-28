import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Student ranking for a single quiz — each student's BEST attempt only,
 * ranked by percentage (desc) then by time taken (asc, faster is better
 * when tied). Any authenticated user enrolled in the course (or the
 * teacher/admin) can view it.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  const isOwnerOrAdmin =
    session.role === "ADMIN" ||
    (session.role === "TEACHER" && quiz.lesson.module.course.teacherId === session.sub);

  if (!isOwnerOrAdmin) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: session.sub, courseId: quiz.lesson.module.courseId },
      },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "You are not enrolled in this course." }, { status: 403 });
    }
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: params.id },
    orderBy: [{ percentage: "desc" }, { submittedAt: "asc" }],
    include: { student: { select: { id: true, name: true } } },
  });

  // Keep only each student's best attempt (highest %, then fastest time).
  const bestByStudent = new Map<string, (typeof attempts)[number]>();
  for (const attempt of attempts) {
    const existing = bestByStudent.get(attempt.studentId);
    if (!existing) {
      bestByStudent.set(attempt.studentId, attempt);
      continue;
    }
    const better =
      attempt.percentage > existing.percentage ||
      (attempt.percentage === existing.percentage &&
        (attempt.timeTakenSeconds ?? Infinity) < (existing.timeTakenSeconds ?? Infinity));
    if (better) bestByStudent.set(attempt.studentId, attempt);
  }

  const ranked = Array.from(bestByStudent.values()).sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;
    return (a.timeTakenSeconds ?? Infinity) - (b.timeTakenSeconds ?? Infinity);
  });

  return NextResponse.json({
    quizTitle: quiz.title,
    leaderboard: ranked.slice(0, 50).map((a, i) => ({
      rank: i + 1,
      studentName: a.student.name,
      percentage: a.percentage,
      score: a.score,
      maxScore: a.maxScore,
      timeTakenSeconds: a.timeTakenSeconds,
      passed: a.passed,
      isMe: a.studentId === session.sub,
    })),
  });
}
