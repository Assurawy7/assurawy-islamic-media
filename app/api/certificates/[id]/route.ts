import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tabbatar da cewa ba za a yi static prerendering na shafin yayin build ba
export const dynamic = 'force-dynamic';

// Public endpoint: anyone with a certificate number (e.g. an employer) can verify it.
export async function GET(
  _req: Request, 
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Warware params idan yana matsayin Promise (Next.js 15 compatibility)
    const resolvedParams = await params;
    const certificateNo = resolvedParams.id;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNo },
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
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}