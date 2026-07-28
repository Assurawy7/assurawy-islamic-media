import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

type Context = {
  params: {
    id: string;
  };
};


// GET SINGLE CERTIFICATE
export async function GET(
  req: NextRequest,
  context: Context
) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Certificate ID required" },
        { status: 400 }
      );
    }


    const certificate = await prisma.certificate.findUnique({
      where:{
        id
      },
      include:{
        student:true
      }
    });


    if(!certificate){
      return NextResponse.json(
        {error:"Certificate not found"},
        {status:404}
      );
    }


    return NextResponse.json({
      certificate
    });


  } catch(error){

    console.error(error);

    return NextResponse.json(
      {
        error:"Failed to fetch certificate"
      },
      {
        status:500
      }
    );

  }
}



// DELETE CERTIFICATE

export async function DELETE(
  req: NextRequest,
  context: Context
){
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try{

    const {id}=context.params;


    await prisma.certificate.delete({
      where:{
        id
      }
    });


    return NextResponse.json({
      success:true
    });


  }catch(error){

    console.error(error);


    return NextResponse.json(
      {
        success:false,
        error:"Failed to delete certificate"
      },
      {
        status:500
      }
    );

  }

}