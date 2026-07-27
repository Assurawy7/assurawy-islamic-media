import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { Role } from "@prisma/client";
// Tilasta Next.js KAR YAYI CACHING na wannan API Route ɗin ko kaɗan
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 1. GET: Samo saite-saiten yanzu daga Database
export async function GET() {
  try {
    const db = prisma as any;
    let settings = await db.siteSettings.findUnique({
      where: { id: "default" },
    });

    // Idan babu saiti tukunna, a kirkiri default settings
    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          id: "default",
          siteName: "Assurawy",
          siteTagline: "Qur'an Academy",
          logoUrl: "/logo.png",
          primaryColor: "#D4AF37",
          fontFamily: "serif",
          defaultLang: "ha",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Kuskure wajen samo saiti" },
      { status: 500 }
    );
  }
}

// 2. POST: Adana sabbin saite-saiten da Admin ya gyara
export async function POST(req: Request) {
  try {
    // Tabbatar cewa wanda yake gyarawan Admin ne
    await requireRole([Role.ADMIN]);

    const body = await req.json();
    console.log("BAYANIN DA KE SHIGOWA DAGA FRONTEND:", body);

    // Muna karbar font ko fontFamily, da defaultLang ko language (ko wanne aka tura)
    const fontValue = body.fontFamily || body.font || "serif";
    const langValue = body.defaultLang || body.language || body.lang || "ha";
    const primaryColorValue = body.primaryColor || "#D4AF37";

    const db = prisma as any;

    const updated = await db.siteSettings.upsert({
      where: { id: "default" },
      update: {
        siteName: body.siteName,
        siteTagline: body.siteTagline,
        logoUrl: body.logoUrl,
        primaryColor: primaryColorValue,
        fontFamily: fontValue,
        defaultLang: langValue,
      },
      create: {
        id: "default",
        siteName: body.siteName || "Assurawy",
        siteTagline: body.siteTagline || "Qur'an Academy",
        logoUrl: body.logoUrl || "/logo.png",
        primaryColor: primaryColorValue,
        fontFamily: fontValue,
        defaultLang: langValue,
      },
    });

    console.log("SAITI DA AKA AJIYE A DATABASE:", updated);

    // 🚀 Goge caching na duk shafukan da ke gidan gaba daya
    revalidatePath("/", "layout");

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: error?.message || "Kuskure wajen adana saiti" },
      { status: 500 }
    );
  }
}