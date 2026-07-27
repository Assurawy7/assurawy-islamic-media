import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/certificate-pdf";
export const dynamic = 'force-dynamic';
// Public: the PDF only contains the same non-sensitive info as /api/certificates/:id
// (student name, course, date, certificate number), so no auth is required —
// consistent with certificates being shareable, verifiable documents.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNo: params.id },
    include: { student: { select: { name: true } } },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateCertificatePdf({
      studentName: certificate.student.name,
      courseTitle: certificate.courseTitle,
      certificateNo: certificate.certificateNo,
      issuedAt: certificate.issuedAt,
    });
  } catch (err) {
    // Most likely cause: a name/title contains characters the standard PDF
    // fonts can't encode (see the limitation noted in lib/certificate-pdf.ts).
  console.error("CERTIFICATE PDF ERROR:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      { 
  error: String(err)
}
    );
  }

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certificate.certificateNo}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
