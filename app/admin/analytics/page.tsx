import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Wallet,
  Target,
} from "lucide-react";

async function getAnalyticsData() {
  const [
    students,
    teachers,
    courses,
    certificates,
    enrollments,
    payments,
    topStudents,
    recentCertificates,
    recentUsers,
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

    prisma.certificate.findMany({
      take: 5,
      orderBy: {
        issuedAt: "desc",
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),

    prisma.quizAttempt.findMany({
      take: 5,
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const revenue = (payments._sum.amountKobo ?? 0) / 100;

  const completion =
    enrollments === 0
      ? 0
      : Math.round((certificates / enrollments) * 100);

  return {
    students,
    teachers,
    courses,
    certificates,
    revenue,
    completion,
    topStudents,
    recentCertificates,
    recentUsers,
    recentQuizAttempts,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-emerald-700">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Assurawy Islamic Media LMS Overview
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Students"
          value={data.students.toLocaleString()}
          icon={Users}
          color="bg-emerald-600"
          change="+"
        />

        <StatsCard
          title="Teachers"
          value={data.teachers.toLocaleString()}
          icon={GraduationCap}
          color="bg-blue-600"
          change="+"
        />

        <StatsCard
          title="Courses"
          value={data.courses.toLocaleString()}
          icon={BookOpen}
          color="bg-purple-600"
          change="+"
        />

        <StatsCard
          title="Certificates"
          value={data.certificates.toLocaleString()}
          icon={Award}
          color="bg-yellow-500"
          change="+"
        />

        <StatsCard
          title="Revenue"
          value={`₦${data.revenue.toLocaleString()}`}
          icon={Wallet}
          color="bg-red-600"
          change="+"
        />

        <StatsCard
          title="Completion"
          value={`${data.completion}%`}
          icon={Target}
          color="bg-green-700"
          change="+"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold">📈 Student Growth</h2>
          <div className="flex h-52 items-end justify-between gap-3">
            <div className="w-full rounded-t-xl bg-emerald-500 h-20" />
            <div className="w-full rounded-t-xl bg-emerald-500 h-28" />
            <div className="w-full rounded-t-xl bg-emerald-500 h-36" />
            <div className="w-full rounded-t-xl bg-emerald-500 h-44" />
            <div className="w-full rounded-t-xl bg-emerald-500 h-52" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold">🎯 Completion Rate</h2>
          <div className="flex h-full flex-col justify-center">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold">Overall Completion</span>
              <span className="text-3xl font-bold text-emerald-700">
                {data.completion}%
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-4 rounded-full bg-emerald-600 transition-all"
                style={{
                  width: `${data.completion}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities + Top Students */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-bold">🕒 Recent Activities</h2>
          <div className="space-y-5">
            {data.recentQuizAttempts.map((quiz) => (
              <div key={quiz.id} className="border-b pb-3">
                <h3 className="font-semibold">
                  📝 {quiz.student?.name ?? "Student"}
                </h3>
                <p className="text-sm text-gray-500">
                  Completed Quiz • Score {(quiz as any).percentage ?? 0}%
                </p>
              </div>
            ))}

            {data.recentCertificates.map((cert) => (
              <div key={cert.id} className="border-b pb-3">
                <h3 className="font-semibold">
                  🏆 {cert.student?.name ?? "Student"}
                </h3>
                <p className="text-sm text-gray-500">Certificate Issued</p>
              </div>
            ))}

            {data.recentUsers.map((user) => (
              <div key={user.id} className="border-b pb-3">
                <h3 className="font-semibold">
                  👤 {user.name ?? "New User"}
                </h3>
                <p className="text-sm text-gray-500">Joined Assurawy LMS</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-bold">🏅 Top Students</h2>
          <div className="space-y-5">
            {data.topStudents.map((student, index) => {
              const medal =
                index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : "⭐";

              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <h3 className="font-bold">
                      {medal} {student.name ?? "Student"}
                    </h3>
                    <p className="text-sm text-gray-500">Student</p>
                  </div>
                  <div className="text-lg font-bold text-emerald-700">
                    {(student.points ?? 0).toLocaleString()} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions (Now Clickable) */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Link
            href="/admin/courses/new"
            className="flex flex-col items-center justify-center rounded-xl bg-emerald-600 p-5 font-semibold text-white transition hover:bg-emerald-700 text-center cursor-pointer"
          >
            <span className="text-2xl mb-1">📚</span>
            Create Course
          </Link>

          <Link
            href="/admin/students"
            className="flex flex-col items-center justify-center rounded-xl bg-blue-600 p-5 font-semibold text-white transition hover:bg-blue-700 text-center cursor-pointer"
          >
            <span className="text-2xl mb-1">👨‍🎓</span>
            Add Student
          </Link>

          <Link
            href="/admin/quizzes/new"
            className="flex flex-col items-center justify-center rounded-xl bg-purple-600 p-5 font-semibold text-white transition hover:bg-purple-700 text-center cursor-pointer"
          >
            <span className="text-2xl mb-1">📝</span>
            Create Quiz
          </Link>

          <Link
            href="/admin/certificates"
            className="flex flex-col items-center justify-center rounded-xl bg-yellow-500 p-5 font-semibold text-white transition hover:bg-yellow-600 text-center cursor-pointer"
          >
            <span className="text-2xl mb-1">🏆</span>
            Certificates
          </Link>

          <Link
            href="/admin/announcements"
            className="flex flex-col items-center justify-center rounded-xl bg-red-600 p-5 font-semibold text-white transition hover:bg-red-700 text-center cursor-pointer"
          >
            <span className="text-2xl mb-1">📢</span>
            Announcement
          </Link>

          <Link
            href="/admin/settings"
            className="flex flex-col items-center justify-center rounded-xl bg-slate-700 p-5 font-semibold text-white transition hover:bg-slate-800 text-center cursor-pointer"
          >
            <span className="text-2xl mb-1">⚙️</span>
            Settings
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-2xl border bg-white p-5 text-center shadow">
        <h3 className="text-lg font-bold text-emerald-700">
          Assurawy Islamic Media LMS
        </h3>
        <p className="mt-2 text-sm text-gray-500">
  {"Designing Da'wah with Excellence"}
</p>
        <p className="mt-2 text-xs text-gray-400">
          © {new Date().getFullYear()} Assurawy Islamic Media. All rights reserved.
        </p>
      </div>
    </div>
  );
}