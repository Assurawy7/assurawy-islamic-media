import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// 1. KARBO PROFILE, CERTIFICATES DA QUIZ SCORES (GET)
export async function GET() {
  try {
    // Shigar da cookies da verifySession maimakon getServerSession
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        certificates: true,
        quizScores: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// 2. SABUNTA PROFILE (PUT)
export async function PUT(req: Request) {
  try {
    // Shigar da cookies da verifySession a nan ma
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    
    if (body.avatarUrl || body.image) {
      updateData.image = body.avatarUrl || body.image;
    }

    if (body.settings !== undefined) {
      updateData.settings = body.settings;
    }

    if (body.password) {
      updateData.password = body.password;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.email },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}