import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
// GET - Samo duk Malaman da ke cikin Database (TEACHER ko ADMIN)
export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: {
          in: ["TEACHER", "ADMIN"], // Za mu samo waɗanda ke da matsayin TEACHER ko ADMIN
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Kuskure wajen samo malamai:", error);
    return NextResponse.json(
      { error: "Kuskure wajen zakulo Malaman" },
      { status: 500 }
    );
  }
}