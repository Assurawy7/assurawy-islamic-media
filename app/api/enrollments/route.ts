import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.sub },
    include: {
      course: {
        include: { modules: { include: { lessons: true } } },
      },
    },
  });

  const completedLessonIds = new Set(
    (
      await prisma.lessonProgress.findMany({
        where: { studentId: session.sub },
        select: { lessonId: true },
      })
    ).map((p) => p.lessonId)
  );

  const result = enrollments.map((e) => {
    const lessons = e.course.modules.flatMap((m) => m.lessons);
    const total = lessons.length;
    const completed = lessons.filter((l) => completedLessonIds.has(l.id)).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      courseId: e.course.id,
      title: e.course.title,
      totalLessons: total,
      completedLessons: completed,
      progress,
    };
  });

  return NextResponse.json({ enrollments: result });
}
