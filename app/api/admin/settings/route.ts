import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
// GET SETTINGS
export async function GET() {
  try {

    const settings = await prisma.siteSettings.findUnique({
      where:{
        id:"default"
      }
    });


    if(!settings){

      const created = await prisma.siteSettings.create({
        data:{
          id:"default"
        }
      });

      return NextResponse.json({
        settings: created
      });

    }


    return NextResponse.json({
      settings
    });


  } catch(error){

    console.error("SETTINGS GET ERROR:", error);

    return NextResponse.json(
      {
        error:"Failed to fetch settings"
      },
      {
        status:500
      }
    );

  }
}



// UPDATE SETTINGS
export async function PUT(req:NextRequest){

  try{

    const body = await req.json();


    const settings = await prisma.siteSettings.upsert({

      where:{
        id:"default"
      },

      update:{
        ...body
      },

      create:{
        id:"default",
        ...body
      }

    });


    return NextResponse.json({
      settings
    });


  }catch(error){

    console.error("SETTINGS UPDATE ERROR:", error);


    return NextResponse.json(
      {
        error:"Failed to update settings"
      },
      {
        status:500
      }
    );

  }

}