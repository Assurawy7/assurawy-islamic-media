import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Kept in sync with BADGE_CATALOG in lib/gamification.ts. Duplicated here
// (rather than imported) because this script runs under plain ts-node,
// which doesn't resolve the "@/*" tsconfig path alias used elsewhere.
const BADGE_CATALOG = [
  { code: "first_lesson", name: "First Step", description: "Completed your first lesson.", icon: "🌱" },
  { code: "five_lessons", name: "Steady Learner", description: "Completed 5 lessons.", icon: "📖" },
  { code: "first_quiz_pass", name: "Quiz Achiever", description: "Passed your first quiz.", icon: "✅" },
  { code: "quiz_perfect", name: "Perfect Score", description: "Scored 100% on a quiz.", icon: "💯" },
  { code: "first_certificate", name: "Certified", description: "Earned your first certificate.", icon: "🎓" },
  { code: "streak_7", name: "Week of Consistency", description: "Maintained a 7-day learning streak.", icon: "🔥" },
  { code: "streak_30", name: "Month of Dedication", description: "Maintained a 30-day learning streak.", icon: "🕌" },
];

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  for (const b of BADGE_CATALOG) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: { name: b.name, description: b.description, icon: b.icon },
      create: b,
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@assurawy.org" },
    update: {},
    create: {
      name: "Assurawy Admin",
      email: "admin@assurawy.org",
      passwordHash,
      role: "ADMIN",
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "ibrahim.sani@assurawy.org" },
    update: {},
    create: {
      name: "Ustadh Ibrahim Sani",
      email: "ibrahim.sani@assurawy.org",
      passwordHash,
      role: "TEACHER",
      bio: "12 years teaching Fiqh, ijazah in the Maliki school.",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "fatima@example.com" },
    update: {},
    create: {
      name: "Fatima",
      email: "fatima@example.com",
      phone: "+2348012345678",
      passwordHash,
      role: "STUDENT",
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "fiqh-101" },
    update: {},
    create: {
      slug: "fiqh-101",
      title: "Introduction to Fiqh",
      description:
        "A structured introduction to Islamic jurisprudence, covering the essential rulings a Muslim needs for daily worship.",
      level: "Foundational",
      published: true,
      teacherId: teacher.id,
      modules: {
        create: [
          {
            title: "Taharah",
            order: 1,
            lessons: {
              create: [
                { title: "What is Taharah?", order: 1, content: "Introduction to ritual purity." },
                { title: "Types of Water", order: 2, content: "Water permissible for purification." },
              ],
            },
          },
          {
            title: "Salah",
            order: 2,
            lessons: {
              create: [
                { title: "Conditions of Salah", order: 1, content: "What must be met before praying." },
                { title: "Pillars of Salah", order: 2, content: "The essential components of the prayer." },
              ],
            },
          },
        ],
      },
    },
    include: { modules: { include: { lessons: true } } },
  });

  // Attach a quiz to the first lesson of the first module, if not already present.
  const firstLesson = course.modules[0]?.lessons[0];
  if (firstLesson) {
    await prisma.quiz.upsert({
      where: { lessonId: firstLesson.id },
      update: {},
      create: {
        title: "Taharah — Chapter Quiz",
        passingScore: 60,
        lessonId: firstLesson.id,
        questions: {
          create: [
            {
              type: "MULTIPLE_CHOICE",
              prompt: "What does 'Taharah' mean?",
              options: ["Prayer", "Purity", "Charity", "Fasting"],
              correctAnswer: "Purity",
              points: 1,
              order: 1,
            },
            {
              type: "SHORT_ANSWER",
              prompt: "Name one type of water valid for wudu.",
              correctAnswer: "rainwater",
              points: 1,
              order: 2,
            },
          ],
        },
      },
    });
  }

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: {},
    create: { studentId: student.id, courseId: course.id },
  });

  // A second, paid course to exercise the Paystack flow (₦5,000).
  await prisma.course.upsert({
    where: { slug: "tafseer-101" },
    update: {},
    create: {
      slug: "tafseer-101",
      title: "Introduction to Tafseer",
      description:
        "An entry point into Qur'anic exegesis — its sciences, methodology, and applied Surah explanation.",
      level: "Intermediate",
      published: true,
      priceKobo: 500000, // ₦5,000
      teacherId: teacher.id,
      modules: {
        create: [
          { title: "Meaning of Tafseer", order: 1 },
          { title: "Qur'an Sciences", order: 2 },
          { title: "Surah Explanation", order: 3 },
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log(`  Admin:   ${admin.email} / Password123!`);
  console.log(`  Teacher: ${teacher.email} / Password123!`);
  console.log(`  Student: ${student.email} / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
