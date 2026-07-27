import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    where: session.role === "TEACHER" ? { teacherId: session.sub } : {},
    include: {
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ courses });
}
