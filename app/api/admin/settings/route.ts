import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

// The admin settings UI has always used `defaultLang` (and reads/writes
// flat top-level fields, not a nested `settings` object). The DB column is
// `defaultLanguage`. Rather than rename the column or rewrite the frontend,
// this route maps between the two at the boundary.
function toClientShape(settings: {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  defaultLanguage: string;
  supportEmail: string | null;
  emailNotifications: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}) {
  const { defaultLanguage, ...rest } = settings;
  return { ...rest, defaultLang: defaultLanguage };
}

// GET SETTINGS
export async function GET() {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "default" } });
    }

    return NextResponse.json(toClientShape(settings));
  } catch (error) {
    console.error("SETTINGS GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

async function saveSettings(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { defaultLang, ...rest } = body ?? {};

    // Only pass through known SiteSettings columns — never spread arbitrary
    // client input straight into Prisma (an unknown key throws, and a
    // malicious/garbage key could otherwise reach the query).
    const allowedKeys = [
      "siteName",
      "siteTagline",
      "logoUrl",
      "faviconUrl",
      "primaryColor",
      "secondaryColor",
      "fontFamily",
      "supportEmail",
      "emailNotifications",
      "maintenanceMode",
      "allowRegistration",
    ] as const;

    const data: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (rest[key] !== undefined) data[key] = rest[key];
    }
    if (defaultLang !== undefined) data.defaultLanguage = defaultLang;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });

    return NextResponse.json(toClientShape(settings));
  } catch (error) {
    console.error("SETTINGS UPDATE ERROR:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

// UPDATE SETTINGS — the admin settings page POSTs (see app/admin/settings/page.tsx),
// PUT is kept too for any other/future callers using the more conventional verb.
export async function PUT(req: NextRequest) {
  return saveSettings(req);
}

export async function POST(req: NextRequest) {
  return saveSettings(req);
}
