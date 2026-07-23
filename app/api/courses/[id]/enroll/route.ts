import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notifyEnrollment } from "@/lib/whatsapp";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to enroll." }, { status: 401 });
  }

  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (course.priceKobo > 0) {
    return NextResponse.json(
      { error: "This is a paid course. Use /api/payments/initialize instead." },
      { status: 400 }
    );
  }

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: session.sub, courseId: params.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already enrolled in this course." }, { status: 409 });
  }

  const enrollment = await prisma.enrollment.create({
    data: { studentId: session.sub, courseId: params.id },
  });

  const student = await prisma.user.findUnique({ where: { id: session.sub } });
  if (student?.phone) {
    await notifyEnrollment(student.phone, student.name, course.title);
  }

  return NextResponse.json({ enrollment }, { status: 201 });
}
