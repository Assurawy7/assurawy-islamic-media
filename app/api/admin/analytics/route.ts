import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireRole(["ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const [
      students,
      teachers,
      courses,
      certificates,
      enrollments,
      quizAttempts,
      payments,
      topStudents,
      recentUsers,
      recentCertificates,
      recentQuizAttempts,
    ] = await Promise.all([

      prisma.user.count({
        where: {
          role: "STUDENT",
        },
      }),

      prisma.user.count({
        where: {
          role: "TEACHER",
        },
      }),

      prisma.course.count(),

      prisma.certificate.count(),

      prisma.enrollment.count(),

      prisma.quizAttempt.count(),

      prisma.payment.aggregate({
        _sum: {
          amountKobo: true,
        },
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.user.findMany({
        where: {
          role: "STUDENT",
        },
        orderBy: {
          points: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          points: true,
        },
      }),

      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),

      prisma.certificate.findMany({
        orderBy: {
          issuedAt: "desc",
        },
        take: 5,
        include: {
          student: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.quizAttempt.findMany({
        orderBy: {
          submittedAt: "desc",
        },
        take: 5,
        include: {
          student: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const totalRevenue = payments._sum.amountKobo ?? 0;

    const completionRate =
      enrollments === 0
        ? 0
        : Math.round((certificates / enrollments) * 100);

    return NextResponse.json({
      overview: {
        students,
        teachers,
        courses,
        certificates,
        enrollments,
        quizAttempts,
        revenueKobo: totalRevenue,
        revenueNaira: totalRevenue / 100,
        completionRate,
      },

      topStudents,

      recentActivities: {
        users: recentUsers,
        certificates: recentCertificates,
        quizzes: recentQuizAttempts,
      },
    });

  } catch (error) {

    console.error("[ADMIN_ANALYTICS]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics.",
      },
      {
        status: 500,
      }
    );
  }
}