import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Public, read-only site branding settings.
 *
 * Deliberately separate from /api/admin/settings (which requires ADMIN and
 * exposes/accepts the full settings record). This route only ever returns
 * the small subset of fields that are safe and necessary for public pages
 * (Navbar, Logo, HeaderActions) to render branding before the visitor is
 * authenticated. Never add maintenanceMode toggles, allowRegistration, or
 * anything else administrative here — use /api/admin/settings for that.
 */
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: {
        siteName: true,
        siteTagline: true,
        logoUrl: true,
        faviconUrl: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        defaultLanguage: true,
      },
    });

    if (!settings) {
      // No row yet — return the schema defaults rather than creating one
      // here (creation is an admin-only side effect, handled by
      // /api/admin/settings on first load of the admin panel).
      return NextResponse.json({
        siteName: "Assurawy Islamic Media",
        siteTagline: "Designing Da'wah with Excellence",
        logoUrl: "/logo.png",
        faviconUrl: null,
        primaryColor: "#D4AF37",
        secondaryColor: "#1B2A4A",
        fontFamily: "Inter",
        defaultLanguage: "ha",
      });
    }

    // Flat shape — Navbar, Logo, and HeaderActions all read data.logoUrl /
    // data.siteName directly off the top level, not a nested object.
    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUBLIC SETTINGS FETCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
