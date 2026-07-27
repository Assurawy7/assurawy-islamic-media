import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID yana da buƙata" },
        { status: 400 }
      );
    }

    // Yin rijistar ɗaliba a LiveAttendance (Idan bai shiga ba a baya)
    const attendance = await prisma.liveAttendance.upsert({
      where: {
        liveClassId_studentId: {
          liveClassId: params.id,
          studentId: studentId,
        },
      },
      update: {
        joinedAt: new Date(),
      },
      create: {
        liveClassId: params.id,
        studentId: studentId,
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Kuskure wajen yi ma ɗalibi attendance:", error);
    return NextResponse.json(
      { error: "Rijistar halarta ta gaza" },
      { status: 500 }
    );
  }
}
