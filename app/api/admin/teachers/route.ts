import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET ALL TEACHERS
export async function GET(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            coursesTaught: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      teachers,
    });
  } catch (error) {
    console.error("TEACHERS FETCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch teachers",
      },
      {
        status: 500,
      }
    );
  }
}

// PROMOTE AN EXISTING STUDENT TO TEACHER
// (the admin UI only ever sends { userId } — it never creates brand-new
// teacher accounts from scratch, so this promotes rather than inserts.)
export async function POST(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Missing required field: userId",
        },
        {
          status: 400,
        }
      );
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (existing.role === "TEACHER" || existing.role === "ADMIN") {
      return NextResponse.json(
        { error: "User is already a teacher or admin" },
        { status: 400 }
      );
    }

    const teacher = await prisma.user.update({
      where: { id: userId },
      data: { role: "TEACHER" },
    });

    return NextResponse.json({
      teacher,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to promote user",
      },
      {
        status: 500,
      }
    );
  }
}
