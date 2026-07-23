import { prisma } from "@/lib/prisma";

export const POINTS = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 20,
  QUIZ_PERFECT: 30, // awarded instead of QUIZ_PASS when score is 100%
  COURSE_COMPLETE: 100,
} as const;

/** Badge catalog. Seed these rows with `npm run seed` (see prisma/seed.ts). */
export const BADGE_CATALOG = [
  { code: "first_lesson", name: "First Step", description: "Completed your first lesson.", icon: "🌱" },
  { code: "five_lessons", name: "Steady Learner", description: "Completed 5 lessons.", icon: "📖" },
  { code: "first_quiz_pass", name: "Quiz Achiever", description: "Passed your first quiz.", icon: "✅" },
  { code: "quiz_perfect", name: "Perfect Score", description: "Scored 100% on a quiz.", icon: "💯" },
  { code: "first_certificate", name: "Certified", description: "Earned your first certificate.", icon: "🎓" },
  { code: "streak_7", name: "Week of Consistency", description: "Maintained a 7-day learning streak.", icon: "🔥" },
  { code: "streak_30", name: "Month of Dedication", description: "Maintained a 30-day learning streak.", icon: "🕌" },
] as const;

export async function awardPoints(userId: string, amount: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
  });
}

function isSameUtcDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function isYesterday(prev: Date, now: Date) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const prevMidnight = Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth(), prev.getUTCDate());
  const nowMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return nowMidnight - prevMidnight === oneDayMs;
}

/** Call once per learning activity (lesson completed, quiz submitted). Updates the streak. */
export async function recordLearningActivity(userId: string): Promise<{ currentStreak: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActivityAt: true, currentStreak: true, longestStreak: true },
  });
  if (!user) return { currentStreak: 0 };

  const now = new Date();
  let nextStreak = user.currentStreak;

  if (!user.lastActivityAt) {
    nextStreak = 1;
  } else if (isSameUtcDay(user.lastActivityAt, now)) {
    nextStreak = user.currentStreak || 1; // already logged today, no change
  } else if (isYesterday(user.lastActivityAt, now)) {
    nextStreak = user.currentStreak + 1;
  } else {
    nextStreak = 1; // streak broken
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: nextStreak,
      longestStreak: Math.max(nextStreak, user.longestStreak),
      lastActivityAt: now,
    },
  });

  return { currentStreak: nextStreak };
}

/** Awards a badge by code if the user doesn't already have it. Silently no-ops if the badge isn't seeded. */
export async function awardBadge(userId: string, code: string) {
  const badge = await prisma.badge.findUnique({ where: { code } });
  if (!badge) return;
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id },
  });
}

/** Runs all the simple count-based badge checks. Call after awarding points for an activity. */
export async function checkAndAwardBadges(userId: string) {
  const [lessonCount, quizPasses, quizPerfect, certCount, user] = await Promise.all([
    prisma.lessonProgress.count({ where: { studentId: userId } }),
    prisma.quizAttempt.count({ where: { studentId: userId, passed: true } }),
    prisma.quizAttempt.count({ where: { studentId: userId, percentage: 100 } }),
    prisma.certificate.count({ where: { studentId: userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { currentStreak: true } }),
  ]);

  if (lessonCount >= 1) await awardBadge(userId, "first_lesson");
  if (lessonCount >= 5) await awardBadge(userId, "five_lessons");
  if (quizPasses >= 1) await awardBadge(userId, "first_quiz_pass");
  if (quizPerfect >= 1) await awardBadge(userId, "quiz_perfect");
  if (certCount >= 1) await awardBadge(userId, "first_certificate");
  if (user && user.currentStreak >= 7) await awardBadge(userId, "streak_7");
  if (user && user.currentStreak >= 30) await awardBadge(userId, "streak_30");
}
