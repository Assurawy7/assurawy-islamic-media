import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

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
}
