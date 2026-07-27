import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET ALL CERTIFICATES
export async function GET(req: NextRequest) {
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