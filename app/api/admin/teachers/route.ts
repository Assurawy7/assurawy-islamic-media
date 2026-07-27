import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET ALL TEACHERS
export async function GET(req: NextRequest) {
  try {

    const teachers = await prisma.user.findMany({
      where:{
        role:"TEACHER"
      },
      select:{
        id:true,
        name:true,
        email:true,
        phone:true,
        bio:true,
        avatarUrl:true,
        createdAt:true,
      },
      orderBy:{
        createdAt:"desc"
      }
    });


    return NextResponse.json({
      teachers
    });


  } catch(error){

    console.error("TEACHERS FETCH ERROR:", error);

    return NextResponse.json(
      {
        error:"Failed to fetch teachers"
      },
      {
        status:500
      }
    );

  }
}



// CREATE TEACHER
export async function POST(req:NextRequest){

  try{

    const body = await req.json();

    const {
      name,
      email,
      passwordHash,
      bio,
    } = body;


    if(!name || !email || !passwordHash){

      return NextResponse.json(
        {
          error:"Missing required fields"
        },
        {
          status:400
        }
      );

    }


    const teacher = await prisma.user.create({

      data:{
        name,
        email,
        passwordHash,
        bio,
        role:"TEACHER"
      }

    });


    return NextResponse.json({
      teacher
    });


  }catch(error){

    console.error(error);

    return NextResponse.json(
      {
        error:"Failed to create teacher"
      },
      {
        status:500
      }
    );

  }

}