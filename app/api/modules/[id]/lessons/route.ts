import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getOwnedCourseByModule } from "@/lib/course-access";
import { notifyNewLesson } from "@/lib/whatsapp";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByModule(params.id, session);
  if (!owned) return NextResponse.json({ error: "Module not found or not yours." }, { status: 404 });

  const { title, videoUrl, audioUrl, content, order } = await req.json().catch(() => ({}));
  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  const lessonCount = await prisma.lesson.count({ where: { moduleId: params.id } });

  const lesson = await prisma.lesson.create({
    data: {
      title,
      videoUrl: videoUrl || null,
      audioUrl: audioUrl || null,
      content: content || null,
      order: order ?? lessonCount + 1,
      moduleId: params.id,
    },
  });

  // Notify every enrolled student with WhatsApp opted in — fire-and-forget.
  prisma.enrollment
    .findMany({
      where: { courseId: owned.course.id },
      select: { student: { select: { name: true, phone: true, whatsappOptIn: true } } },
    })
    .then((enrollments) => {
      for (const { student } of enrollments) {
        if (student.phone && student.whatsappOptIn) {
          notifyNewLesson(student.phone, student.name, owned.course.title, title).catch(() => {});
        }
      }
    })
    .catch(() => {});

  return NextResponse.json({ lesson }, { status: 201 });
}
