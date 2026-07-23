import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getOwnedCourse } from "@/lib/course-access";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const course = await getOwnedCourse(params.id, session);
  if (!course) return NextResponse.json({ error: "Course not found or not yours." }, { status: 404 });

  const { title, order } = await req.json().catch(() => ({}));
  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  const moduleCount = await prisma.module.count({ where: { courseId: course.id } });

  const module_ = await prisma.module.create({
    data: { title, order: order ?? moduleCount + 1, courseId: course.id },
  });

  return NextResponse.json({ module: module_ }, { status: 201 });
}
