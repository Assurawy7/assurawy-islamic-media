import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getOwnedCourseByLesson } from "@/lib/course-access";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const owned = await getOwnedCourseByLesson(params.id, session);
  if (!owned) return NextResponse.json({ error: "Lesson not found or not yours." }, { status: 404 });

  const { fileName, fileUrl } = await req.json().catch(() => ({}));
  if (!fileName || !fileUrl) {
    return NextResponse.json({ error: "fileName and fileUrl are required." }, { status: 400 });
  }

  const attachment = await prisma.attachment.create({
    data: { fileName, fileUrl, lessonId: params.id },
  });

  return NextResponse.json({ attachment }, { status: 201 });
}
