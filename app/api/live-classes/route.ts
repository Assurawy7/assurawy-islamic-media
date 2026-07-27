import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// GET - Fetch all live classes
export async function GET() {
  try {
    const classes = await prisma.liveClass.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attendances: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch live classes" },
      { status: 500 }
    );
  }
}

// POST - Create live class & Notify Students Automatically
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Kirqiri Live Class
    const live = await prisma.liveClass.create({
      data: {
        title: body.title,
        description: body.description || null,
        meetingUrl: body.meetingUrl,
        platform: body.platform || "ZOOM",
        teacherId: body.teacherId,
        courseId: body.courseId || null,
        scheduledAt: new Date(body.scheduledAt || body.startTime),
        duration: Number(body.duration) || 60,
        status: body.status || "UPCOMING",
      },
    });

    // 2. Samo duk dalibai (STUDENT) domin tura musu notification
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    // 3. Tura Sanarwa ta Automatik (Automatic Notification) ga kowane dalibi
    if (students.length > 0) {
      const notificationData = students.map((student) => ({
        userId: student.id,
        title: "🔴 Sabon Live Class!",
        message: `An sanya sabon ajin kai tsaye: "${live.title}" ranar ${new Date(live.scheduledAt).toLocaleString()}.`,
        type: "LIVE_CLASS",
      }));

      await prisma.notification.createMany({
        data: notificationData,
      });
    }

    return NextResponse.json(live);
  } catch (error) {
    console.error("Kuskure wajen kirqirar aji ko tura notification:", error);
    return NextResponse.json(
      { error: "Unable to create class and send notification" },
      { status: 500 }
    );
  }
}