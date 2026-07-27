import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
export const dynamic = 'force-dynamic';
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      points: true,
      currentStreak: true,
      longestStreak: true,
      badges: { include: { badge: true }, orderBy: { earnedAt: "desc" } },
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const rank =
    (await prisma.user.count({
      where: { role: "STUDENT", points: { gt: user.points } },
    })) + 1;

  return NextResponse.json({
    points: user.points,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    rank,
    badges: user.badges.map((ub) => ({
      code: ub.badge.code,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      earnedAt: ub.earnedAt,
    })),
  });
}
