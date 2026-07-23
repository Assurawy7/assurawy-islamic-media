import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/certificate-pdf";

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
    console.error("[certificate-pdf] Generation failed:", err);
    return NextResponse.json(
      { error: "Could not generate the certificate PDF. Please contact support." },
      { status: 500 }
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
