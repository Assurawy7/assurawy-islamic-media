import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// POST - Ɗalibi na miƙa amsar aikin gida (Assignment Submission)
export async function POST(req: NextRequest) {
  try {
    const { assignmentId, studentId, answer, fileUrl } = await req.json();

    if (!assignmentId || !studentId) {
      return NextResponse.json(
        { error: "Assignment ID da Student ID suna da buƙata" },
        { status: 400 }
      );
    }

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      update: {
        answer: answer || null,
        fileUrl: fileUrl || null,
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId,
        answer: answer || null,
        fileUrl: fileUrl || null,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Kuskure wajen miƙa amsar assignment:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}