import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
export const dynamic = 'force-dynamic';
/** The current student's most recent quiz attempts, for the dashboard. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId: session.sub },
    orderBy: { submittedAt: "desc" },
    take: 10,
    include: { quiz: { select: { title: true } } },
  });

  return NextResponse.json({
    attempts: attempts.map((a) => ({
      id: a.id,
      quizTitle: a.quiz.title,
      score: a.score,
      maxScore: a.maxScore,
      percentage: a.percentage,
      passed: a.passed,
      timeTakenSeconds: a.timeTakenSeconds,
      autoSubmitted: a.autoSubmitted,
      submittedAt: a.submittedAt,
    })),
  });
}
