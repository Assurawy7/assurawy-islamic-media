import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, requireRole } from "@/lib/session";
export const dynamic = 'force-dynamic';
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      questions: { orderBy: { order: "asc" } },
      lesson: { include: { module: { include: { course: true } } } },
    },
  });
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  const isOwnerOrAdmin =
    session.role === "ADMIN" ||
    (session.role === "TEACHER" && quiz.lesson.module.course.teacherId === session.sub);

  // Students (and anyone who isn't the owning teacher/admin) never receive correctAnswer.
  const questions = isOwnerOrAdmin
    ? quiz.questions
    : quiz.questions.map(({ correctAnswer, ...q }) => q);

  return NextResponse.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      timeLimitMinutes: quiz.timeLimitMinutes,
      questions,
    },
  });
}

type QuestionInput = {
  id?: string;
  type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  points?: number;
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  const isOwner =
    session.role === "ADMIN" ||
    (session.role === "TEACHER" && quiz.lesson.module.course.teacherId === session.sub);
  if (!isOwner) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { title, passingScore, timeLimitMinutes, questions } = await req.json().catch(() => ({}));

  // Simplest reliable approach for a quiz builder: replace all questions on save.
  const updated = await prisma.$transaction(async (tx) => {
    if (Array.isArray(questions)) {
      await tx.question.deleteMany({ where: { quizId: params.id } });
      await tx.question.createMany({
        data: (questions as QuestionInput[]).map((q, i) => ({
          quizId: params.id,
          type: q.type,
          prompt: q.prompt,
          options: q.type === "MULTIPLE_CHOICE" ? (q.options ?? []) : undefined,
          correctAnswer: q.correctAnswer,
          points: q.points ?? 1,
          order: i + 1,
        })),
      });
    }
    return tx.quiz.update({
      where: { id: params.id },
      data: {
        title: title ?? undefined,
        passingScore: passingScore ?? undefined,
        timeLimitMinutes:
          timeLimitMinutes === null
            ? null
            : typeof timeLimitMinutes === "number"
              ? timeLimitMinutes
              : undefined,
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  });

  return NextResponse.json({ quiz: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  const isOwner =
    session.role === "ADMIN" ||
    (session.role === "TEACHER" && quiz.lesson.module.course.teacherId === session.sub);
  if (!isOwner) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  await prisma.quiz.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
