import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID yana da buƙata" },
        { status: 400 }
      );
    }

    const logs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Kuskure wajen samo activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, action, details } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "User ID da Action suna da buƙata" },
        { status: 400 }
      );
    }

    const dataToCreate: { userId: string; action: string; details?: string } = {
      userId,
      action,
    };

    if (details) {
      dataToCreate.details = details;
    }

    const newLog = await prisma.activityLog.create({
      data: dataToCreate,
    });

    return NextResponse.json(newLog);
  } catch (error) {
    console.error("Kuskure wajen adana activity log:", error);
    return NextResponse.json(
      { error: "Failed to create activity log" },
      { status: 500 }
    );
  }
}