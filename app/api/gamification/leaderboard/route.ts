import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const top = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, points: true, currentStreak: true },
    orderBy: { points: "desc" },
    take: 20,
  });

  return NextResponse.json({
    leaderboard: top.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      points: u.points,
      currentStreak: u.currentStreak,
      isMe: u.id === session.sub,
    })),
  });
}
