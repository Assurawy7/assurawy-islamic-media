import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { initializeTransaction, isPaystackConfigured } from "@/lib/paystack";
import crypto from "crypto";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to enroll." }, { status: 401 });
  }

  const { courseId } = await req.json().catch(() => ({}));
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: session.sub, courseId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already enrolled in this course." }, { status: 409 });
  }

  // Free course — enroll immediately, no payment needed.
  if (course.priceKobo <= 0) {
    await prisma.enrollment.create({ data: { studentId: session.sub, courseId } });
    return NextResponse.json({ free: true });
  }

  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: "Payments aren't configured yet. Set PAYSTACK_SECRET_KEY (see .env.example)." },
      { status: 501 }
    );
  }

  const reference = `AIM-${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  await prisma.payment.create({
    data: {
      reference,
      studentId: session.sub,
      courseId,
      amountKobo: course.priceKobo,
      status: "PENDING",
    },
  });

  try {
    const tx = await initializeTransaction({
      email: session.email,
      amountKobo: course.priceKobo,
      reference,
      callbackUrl: `${siteUrl}/payment/callback`,
      metadata: { courseId, studentId: session.sub },
    });
    return NextResponse.json({ authorizationUrl: tx.authorization_url, reference });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Could not start payment." },
      { status: 502 }
    );
  }
}
