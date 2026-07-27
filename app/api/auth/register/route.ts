import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, SESSION_COOKIE } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { sendNotificationEmail } from "@/lib/email"; // Email function
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  const rate = checkRateLimit(`register:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const { name, email, password, phone } = body ?? {};

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (phone && !/^\+?[1-9]\d{7,14}$/.test(phone)) {
    return NextResponse.json(
      { error: "Phone number should be in international format, e.g. +2348012345678." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, passwordHash, role: "STUDENT" },
  });

  // 📩 WANNAN SHI NE WURIN AIKA EMAIL ƊIN:
  try {
    await sendNotificationEmail({
      to: user.email,
      subject: "Barka da Zuwa Shafin Assurawy Islamic Media!",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Barka da zuwa, ${user.name}! 👋</h2>
          <p>Mun gode da yin rijista a shafinmu na karatu.</p>
          <p>Yanzu za ka iya shiga ka fara duba darussan da muke da su tare da yin enrollment.</p>
          <br>
          <p>Buri na gari,<br><b>Assurawy Islamic Media Team</b></p>
        </div>
      `,
    });
  } catch (emailError) {
    // Muna amfani da try/catch anan domin ko da email din ya samu matsala, rijistar kar ta tsaya
    console.error("Kuskure wajen tura email din rijista:", emailError);
  }

  const token = await signSession({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}