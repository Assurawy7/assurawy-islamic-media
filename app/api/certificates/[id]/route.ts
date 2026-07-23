import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint: anyone with a certificate number (e.g. an employer) can verify it.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNo: params.id },
    include: { student: { select: { name: true } } },
  });

  if (!certificate) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    certificateNo: certificate.certificateNo,
    studentName: certificate.student.name,
    courseTitle: certificate.courseTitle,
    issuedAt: certificate.issuedAt,
  });
}
