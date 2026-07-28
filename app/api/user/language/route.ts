import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isSupportedLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { language } = body ?? {};

  if (!isSupportedLang(language)) {
    return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
  }

  const session = await getSession();
  if (session) {
    await prisma.user.update({
      where: { id: session.sub },
      data: { language },
    });
  }

  const res = NextResponse.json({ language });
  res.cookies.set("lang", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
