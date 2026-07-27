import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, getSession } from "@/lib/session";
export const dynamic = 'force-dynamic';
type Params = { params: { id: string } };

/**
 * Returns course structure. Access is tiered:
 *  - The owning teacher or an admin gets everything, published or not
 *    (this is what the teacher course-editor page relies on).
 *  - An enrolled student gets full lesson content (video/text/attachments).
 *  - Everyone else (anonymous visitors, non-enrolled students) only gets the
 *    published course's outline — titles and counts, no video/text/attachment
 *    URLs — same as what the public course landing page shows. Unpublished
 *    courses are a 404 for this group.
 *
 * Previously this had no auth check at all and always returned full lesson
 * content/videoUrl/attachments, for unpublished and paid courses alike — a
 * direct paywall and draft-content bypass for anyone who called the API
 * directly instead of going through the UI.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: { select: { name: true, bio: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { attachments: true, quiz: { select: { id: true, title: true } } },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const session = await getSession();
  const isOwnerOrAdmin =
    session?.role === "ADMIN" || (session?.role === "TEACHER" && session.sub === course.teacherId);

  if (!course.published && !isOwnerOrAdmin) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  let isEnrolled = false;
  if (session?.role === "STUDENT") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: session.sub, courseId: course.id } },
    });
    isEnrolled = Boolean(enrollment);
  }

  const canSeeContent = isOwnerOrAdmin || isEnrolled;

  return NextResponse.json({
    course: {
      ...course,
      modules: course.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          canSeeContent
            ? l
            : {
                id: l.id,
                title: l.title,
                order: l.order,
                moduleId: l.moduleId,
                videoUrl: null,
                content: null,
                attachments: [],
                quiz: l.quiz,
              }
        ),
      })),
    },
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireRole(["ADMIN", "TEACHER"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (session.role === "TEACHER" && course.teacherId !== session.sub) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { title, description, level, thumbnailUrl, published, priceKobo } = body;

  const updated = await prisma.course.update({
    where: { id: params.id },
    data: { title, description, level, thumbnailUrl, published, priceKobo },
  });

  return NextResponse.json({ course: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  await prisma.course.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
