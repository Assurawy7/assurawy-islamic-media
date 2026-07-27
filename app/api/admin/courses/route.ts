import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET COURSES
export async function GET(req: NextRequest) {
  try {

    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        teacher: {
          select:{
            id:true,
            name:true,
            email:true,
          }
        },
        modules:true,
        _count:{
          select:{
            enrollments:true
          }
        }
      },
    });


    return NextResponse.json({
      courses,
    });


  } catch(error){

    console.error("COURSES ERROR:", error);


    return NextResponse.json(
      {
        error:"Failed to fetch courses",
      },
      {
        status:500
      }
    );

  }
}



// CREATE COURSE
export async function POST(req: NextRequest){

  try{

    const body = await req.json();


    const {
      title,
      description,
      slug,
      teacherId,
      level,
      priceKobo
    } = body;



    if(!title || !description || !slug || !teacherId){

      return NextResponse.json(
        {
          error:"Missing required fields"
        },
        {
          status:400
        }
      );

    }



    const course = await prisma.course.create({

      data:{
        title,
        description,
        slug,
        teacherId,
        level: level || "Foundational",
        priceKobo: priceKobo || 0,
      }

    });



    return NextResponse.json({
      course
    });



  }catch(error){

    console.error("CREATE COURSE ERROR:", error);


    return NextResponse.json(
      {
        error:"Failed to create course"
      },
      {
        status:500
      }
    );

  }

}