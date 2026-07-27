import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// GET - Samo aji guda daya tak (Single Live Class)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: { id: true, name: true, email: true },
        },
        attendances: true,
      },
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: "Aji ba sa samu ba" },
        { status: 404 }
      );
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Kuskure wajen zakulo ajin" },
      { status: 500 }
    );
  }
}

// PUT / PATCH - Gyara Aji (Edit Live Class)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updatedClass = await prisma.liveClass.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        meetingUrl: body.meetingUrl,
        platform: body.platform,
        teacherId: body.teacherId,
        courseId: body.courseId || null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
        duration: body.duration ? Number(body.duration) : undefined,
        status: body.status, // "UPCOMING", "LIVE", "ENDED", "CANCELLED"
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Kuskure wajen gyara ajin" },
      { status: 500 }
    );
  }
}

// DELETE - Goge Aji (Delete Live Class)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.liveClass.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "An goge ajin cikin nasara" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Kuskure wajen goge ajin" },
      { status: 500 }
    );
  }
}