import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let session;
    try {
      session = await getSession();
    } catch {
      // Idan aka samu matsalar cookies lokacin build step
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      include: {
        teacher: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}