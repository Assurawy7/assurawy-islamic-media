import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { notifyCertificateIssued } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// GET ALL CERTIFICATES
export async function GET(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {

    const certificates = await prisma.certificate.findMany({
      orderBy: {
        issuedAt: "desc",
      },
      include: {
        student: true,
      },
    });


    return NextResponse.json({
      certificates,
    });


  } catch (error) {

    console.error("CERTIFICATE FETCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch certificates",
      },
      {
        status: 500,
      }
    );
  }
}



// CREATE CERTIFICATE
export async function POST(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {

    const body = await req.json();

    const {
      certificateNo,
      studentId,
      courseTitle,
    } = body;


    if(!certificateNo || !studentId || !courseTitle){

      return NextResponse.json(
        {
          error:"Missing required fields"
        },
        {
          status:400
        }
      );

    }


    const certificate = await prisma.certificate.create({

      data:{
        certificateNo,
        studentId,
        courseTitle,
      }

    });

    // Fire-and-forget WhatsApp notification — never blocks the response
    // or fails the request if WhatsApp isn't configured / errors out.
    prisma.user
      .findUnique({ where: { id: studentId }, select: { name: true, phone: true } })
      .then((student) => {
        if (student?.phone) {
          notifyCertificateIssued(student.phone, student.name, courseTitle, certificateNo).catch(
            () => {}
          );
        }
      })
      .catch(() => {});

    return NextResponse.json({
      certificate
    });


  } catch(error){

    console.error("CREATE CERTIFICATE ERROR:", error);


    return NextResponse.json(
      {
        error:"Failed to create certificate"
      },
      {
        status:500
      }
    );

  }

}