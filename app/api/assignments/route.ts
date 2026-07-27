import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Samo duk ayyukan gida (Assignments) na darasi
export async function GET(req: NextRequest) {
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
  try {
    const { title, description, dueDate, courseId } = await req.json();

    if (!title || !courseId) {
      return NextResponse.json(
        { error: "Title da Course ID suna da buƙata" },
        { status: 400 }
      );
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        courseId,
      },
    });

    return NextResponse.json(newAssignment);
  } catch (error) {
    console.error("Kuskure wajen ƙirƙirar assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}