import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, getSession } from "@/lib/session";
import { getOwnedCourseByLesson } from "@/lib/course-access";
export const dynamic = 'force-dynamic';
type Params = { params: { id: string } };

/**
 * Returns full lesson content — video, text, attachments, and the quiz
 * (without correctAnswer, which stays server-side) — to the owning teacher,
 * an admin, or a student enrolled in the parent course. This is the route
 * the student lesson-player page calls; before this fix it didn't exist,
 * so an enrolled student had no way to actually view a lesson's content.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: {
      attachments: true,
      quiz: { include: { questions: { orderBy: { order: "asc" } } } },
      module: { include: { course: { select: { id: true, title: true, teacherId: true } } } },
    },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const course = lesson.module.course;
  const isOwnerOrAdmin =
    session.role === "ADMIN" || (session.role === "TEACHER" && session.sub === course.teacherId);

  if (!isOwnerOrAdmin) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: session.sub, courseId: course.id } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "You are not enrolled in this course." }, { status: 403 });
    }
  }

  const quiz = lesson.quiz
    ? {
        id: lesson.quiz.id,
        title: lesson.quiz.title,
        passingScore: lesson.quiz.passingScore,
        timeLimitMinutes: lesson.quiz.timeLimitMinutes,
        questions: lesson.quiz.questions.map((q) => ({
          id: q.id,
          type: q.type,
          prompt: q.prompt,
          options: q.options,
          points: q.points,
        })),
      }
    : null;

  const completed = session.role === "STUDENT"
    ? await prisma.lessonProgress.findUnique({
        where: { studentId_lessonId: { studentId: session.sub, lessonId: lesson.id } },
      })
    : null;

  return NextResponse.json({
    lesson: {
      id: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      audioUrl: lesson.audioUrl,
      content: lesson.content,
      attachments: lesson.attachments,
      quiz,
    },
    course: { id: course.id, title: course.title },
    completed: Boolean(completed),
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByLesson(params.id, session);
  if (!owned) return NextResponse.json({ error: "Lesson not found or not yours." }, { status: 404 });

  const { title, videoUrl, audioUrl, content, order } = await req.json().catch(() => ({}));
  const updated = await prisma.lesson.update({
    where: { id: params.id },
    data: { title, videoUrl, audioUrl, content, order },
  });

  return NextResponse.json({ lesson: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByLesson(params.id, session);
  if (!owned) return NextResponse.json({ error: "Lesson not found or not yours." }, { status: 404 });

  await prisma.lesson.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
