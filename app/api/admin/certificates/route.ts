import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// WANNAN LAYIN SHI NE MAFI MUHIMMANCI A SAMAN FAYIL DIN!
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const q = req.nextUrl.searchParams.get("q")?.trim();

    const certificates = await prisma.certificate.findMany({
      where: q
        ? {
            OR: [
              { certificateNo: { contains: q, mode: "insensitive" } },
              { courseTitle: { contains: q, mode: "insensitive" } },
              { student: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: { student: { select: { name: true, email: true } } },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}