import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getOwnedCourseByLesson } from "@/lib/course-access";

type QuestionInput = {
  type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  points?: number;
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByLesson(params.id, session);
  if (!owned) return NextResponse.json({ error: "Lesson not found or not yours." }, { status: 404 });

  const quiz = await prisma.quiz.findUnique({
    where: { lessonId: params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ quiz });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByLesson(params.id, session);
  if (!owned) return NextResponse.json({ error: "Lesson not found or not yours." }, { status: 404 });

  const existing = await prisma.quiz.findUnique({ where: { lessonId: params.id } });
  if (existing) {
    return NextResponse.json(
      { error: "This lesson already has a quiz. Use PATCH to edit it." },
      { status: 409 }
    );
  }

  const { title, passingScore, questions } = await req.json().catch(() => ({}));
  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json(
      { error: "title and at least one question are required." },
      { status: 400 }
    );
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      passingScore: passingScore ?? 60,
      lessonId: params.id,
      questions: {
        create: (questions as QuestionInput[]).map((q, i) => ({
          type: q.type,
          prompt: q.prompt,
          options: q.type === "MULTIPLE_CHOICE" ? q.options ?? [] : undefined,
          correctAnswer: q.correctAnswer,
          points: q.points ?? 1,
          order: i + 1,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json({ quiz }, { status: 201 });
}
