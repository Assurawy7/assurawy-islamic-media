import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// POST - Kara Review / Rating sabo
export async function POST(req: NextRequest) {
  try {
    const { courseId, studentId, rating, review } = await req.json();

    if (!courseId || !studentId || !rating) {
      return NextResponse.json(
        { error: "Ranakun courseId, studentId, da rating suna da buƙata" },
        { status: 400 }
      );
    }

    const newReview = await prisma.courseReview.upsert({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
      update: {
        rating: Number(rating),
        review: review || null,
      },
      create: {
        courseId,
        studentId,
        rating: Number(rating),
        review: review || null,
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Kuskure wajen adana review:", error);
    return NextResponse.json(
      { error: "Kuskure wajen rubuta sharhi" },
      { status: 500 }
    );
  }
}