import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { awardPoints, recordLearningActivity, checkAndAwardBadges, POINTS } from "@/lib/gamification";
import { notifyCertificateIssued } from "@/lib/whatsapp";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: { module: { include: { course: { include: { modules: { include: { lessons: true } } } } } } },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId: session.sub, courseId: lesson.module.course.id },
    },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "You are not enrolled in this course." }, { status: 403 });
  }

  const alreadyCompleted = await prisma.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId: session.sub, lessonId: lesson.id } },
  });
  let created = !alreadyCompleted;
  if (created) {
    try {
      await prisma.lessonProgress.create({ data: { studentId: session.sub, lessonId: lesson.id } });
    } catch (err: any) {
      if (err?.code === "P2002") {
        created = false; // lost a race with a concurrent request — already completed, not an error
      } else {
        throw err;
      }
    }
  }

  let currentStreak = 0;
  if (created) {
    await awardPoints(session.sub, POINTS.LESSON_COMPLETE);
    const result = await recordLearningActivity(session.sub);
    currentStreak = result.currentStreak;
    await checkAndAwardBadges(session.sub);
  }

  // Check whether every lesson in the course is now complete.
  const allLessons = lesson.module.course.modules.flatMap((m) => m.lessons);
  const completedCount = await prisma.lessonProgress.count({
    where: { studentId: session.sub, lessonId: { in: allLessons.map((l) => l.id) } },
  });

  let certificateIssued = false;
  if (completedCount === allLessons.length && allLessons.length > 0) {
    // NOTE: Certificate has no courseId column (schema-level, not fixed here
    // since it'd need a migration) — this dedup check matches on courseTitle
    // string. If a teacher renames the course after a student is certified,
    // this lookup won't find the earlier certificate and could issue a
    // second one for the same course. Low-impact (an extra certificate, not
    // a security issue) but worth a `courseId` column + migration later.
    const existingCert = await prisma.certificate.findFirst({
      where: { studentId: session.sub, courseTitle: lesson.module.course.title },
    });
    if (!existingCert) {
      // Retry on a rare certificateNo collision (the suffix has ~9000 possible
      // values per year) instead of letting the unhandled P2002 error crash
      // the request after points have already been awarded above.
      let certificateNo = "";
      const maxAttempts = 5;
      let created = false;
      for (let attempt = 0; attempt < maxAttempts && !created; attempt++) {
        certificateNo = `AIM-CERT-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;
        try {
          await prisma.certificate.create({
            data: {
              certificateNo,
              studentId: session.sub,
              courseTitle: lesson.module.course.title,
            },
          });
          created = true;
        } catch (err: any) {
          if (err?.code === "P2002" && attempt < maxAttempts - 1) continue;
          throw err;
        }
      }
      certificateIssued = true;

      await awardPoints(session.sub, POINTS.COURSE_COMPLETE);
      await checkAndAwardBadges(session.sub);

      const student = await prisma.user.findUnique({ where: { id: session.sub } });
      if (student?.phone) {
        await notifyCertificateIssued(
          student.phone,
          student.name,
          lesson.module.course.title,
          certificateNo
        );
      }
    }
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { points: true } });
  const pointsAwarded =
    (created ? POINTS.LESSON_COMPLETE : 0) + (certificateIssued ? POINTS.COURSE_COMPLETE : 0);

  return NextResponse.json({
    ok: true,
    certificateIssued,
    gamification:
      pointsAwarded > 0 ? { pointsAwarded, points: user?.points ?? 0, currentStreak } : null,
  });
}
