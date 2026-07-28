import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, requireRole } from "@/lib/session";
import { getOwnedCourse } from "@/lib/course-access";
import { notifyNewAssignment } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// GET - Samo duk ayyukan gida (Assignments) na darasi
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID yana da buƙata" },
        { status: 400 }
      );
    }

    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      include: {
        submissions: {
          select: {
            id: true,
            studentId: true,
            score: true,
            submittedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Kuskure wajen samo assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

// POST - Malami na ƙirƙirar sabon Assignment
export async function POST(req: NextRequest) {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { title, description, dueDate, courseId } = await req.json();

    if (!title || !courseId) {
      return NextResponse.json(
        { error: "Title da Course ID suna da buƙata" },
        { status: 400 }
      );
    }

    const owned = await getOwnedCourse(courseId, session);
    if (!owned) {
      return NextResponse.json({ error: "Course not found or not yours." }, { status: 404 });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        courseId,
      },
    });

    // Notify every enrolled student with WhatsApp opted in — fire-and-forget.
    prisma.enrollment
      .findMany({
        where: { courseId },
        select: { student: { select: { name: true, phone: true, whatsappOptIn: true } } },
      })
      .then((enrollments) => {
        for (const { student } of enrollments) {
          if (student.phone && student.whatsappOptIn) {
            notifyNewAssignment(
              student.phone,
              student.name,
              owned.title,
              title,
              newAssignment.dueDate ? newAssignment.dueDate.toDateString() : null
            ).catch(() => {});
          }
        }
      })
      .catch(() => {});

    return NextResponse.json(newAssignment);
  } catch (error) {
    console.error("Kuskure wajen ƙirƙirar assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
