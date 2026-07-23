import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const certificates = await prisma.certificate.findMany({
    where: { studentId: session.sub },
    orderBy: { issuedAt: "desc" },
  });

  return NextResponse.json({ certificates });
}
