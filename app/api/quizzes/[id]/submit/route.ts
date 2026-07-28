import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { awardPoints, recordLearningActivity, checkAndAwardBadges, POINTS } from "@/lib/gamification";
import { notifyQuizResult } from "@/lib/whatsapp";
export const dynamic = 'force-dynamic';
type Answers = Record<string, string>;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const answers: Answers = body?.answers ?? {};
  const timeTakenSeconds: number | undefined =
    typeof body?.timeTakenSeconds === "number" ? Math.max(0, Math.round(body.timeTakenSeconds)) : undefined;
  const autoSubmitted: boolean = Boolean(body?.autoSubmitted);

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { questions: true, lesson: { include: { module: true } } },
  });
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId: session.sub, courseId: quiz.lesson.module.courseId },
    },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "You are not enrolled in this course." }, { status: 403 });
  }

  let score = 0;
  const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  for (const q of quiz.questions) {
    const given = (answers[q.id] ?? "").trim().toLowerCase();
    const correct = q.correctAnswer.trim().toLowerCase();
    if (given && given === correct) score += q.points;
  }

  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const passed = percentage >= quiz.passingScore;

  const attempt = await prisma.quizAttempt.create({
    data: {
      studentId: session.sub,
      quizId: quiz.id,
      answers,
      score,
      maxScore,
      percentage,
      passed,
      timeTakenSeconds,
      autoSubmitted,
    },
  });

  let gamification: { points: number; currentStreak: number } | null = null;
  if (passed) {
    await awardPoints(session.sub, percentage === 100 ? POINTS.QUIZ_PERFECT : POINTS.QUIZ_PASS);
    const { currentStreak } = await recordLearningActivity(session.sub);
    await checkAndAwardBadges(session.sub);
    const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { points: true } });
    gamification = { points: user?.points ?? 0, currentStreak };
  }

  // Fire-and-forget — never blocks or fails the response.
  prisma.user
    .findUnique({ where: { id: session.sub }, select: { name: true, phone: true, whatsappOptIn: true } })
    .then((student) => {
      if (student?.phone && student.whatsappOptIn) {
        notifyQuizResult(student.phone, student.name, quiz.title, percentage, passed).catch(() => {});
      }
    })
    .catch(() => {});

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      score,
      maxScore,
      percentage,
      passed,
      timeTakenSeconds,
      autoSubmitted,
    },
    gamification,
  });
}
