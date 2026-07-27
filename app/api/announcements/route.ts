import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { author: { select: { name: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "TEACHER"]);
    if (!session) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { title, body } = await req.json().catch(() => ({}));
    if (!title || !body) {
      return NextResponse.json({ error: "title and body are required." }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: { title, body, authorId: session.sub },
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}