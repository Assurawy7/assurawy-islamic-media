import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      teacher: { select: { name: true } },
      modules: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    courses: courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      level: c.level,
      thumbnailUrl: c.thumbnailUrl,
      instructor: c.teacher.name,
      moduleCount: c.modules.length,
      priceKobo: c.priceKobo,
    })),
  });
}

export async function POST(req: NextRequest) {
  // Only Admins and Teachers may create courses.
  const session = await requireRole(["ADMIN", "TEACHER"]);
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { title, slug, description, level, priceKobo } = body ?? {};
  if (!title || !slug || !description) {
    return NextResponse.json(
      { error: "title, slug and description are required." },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        level: level || "Foundational",
        priceKobo: Number.isFinite(priceKobo) && priceKobo > 0 ? Math.round(priceKobo) : 0,
        teacherId: session.sub,
        published: false,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "A course with this slug already exists. Choose a different slug." },
        { status: 409 }
      );
    }
    throw err;
  }
}
