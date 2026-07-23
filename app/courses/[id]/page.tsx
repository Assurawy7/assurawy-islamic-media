import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import EnrollButton from "@/components/EnrollButton";
import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) return { title: "Course — Assurawy Islamic Media" };
  return {
    title: `${course.title} — Assurawy Islamic Media`,
    description: course.description,
    alternates: { canonical: `/courses/${course.id}` },
    openGraph: { title: course.title, description: course.description, type: "website" },
  };
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, session] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.id },
      include: {
        teacher: { select: { name: true, bio: true } },
        modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      },
    }),
    getSession(),
  ]);

  if (!course || !course.published) notFound();

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  let isEnrolled = false;
  if (session?.role === "STUDENT") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: session.sub, courseId: course.id } },
    });
    isEnrolled = Boolean(enrollment);
  }

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Assurawy Islamic Media",
      sameAs: process.env.NEXT_PUBLIC_SITE_URL || "https://assurawy.org",
    },
    ...(course.priceKobo > 0 && {
      offers: {
        "@type": "Offer",
        price: (course.priceKobo / 100).toFixed(2),
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(courseJsonLd) }}
      />
      <section className="bg-deep py-16 text-cream">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
            {course.level}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-cream/80">{course.description}</p>
          <p className="mt-3 text-sm text-cream/60">
            Instructor {course.teacher.name} · {course.modules.length} modules · {totalLessons} lessons
          </p>
          <div className="mt-8">
            {isEnrolled ? (
              <span className="rounded-full bg-emerald/15 px-5 py-2.5 text-sm font-semibold text-emerald">
                ✓ You're enrolled — start below
              </span>
            ) : (
              <EnrollButton
                courseId={course.id}
                priceKobo={course.priceKobo}
                isLoggedIn={Boolean(session)}
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 md:px-8">
        <h2 className="font-display text-2xl font-semibold text-deep">Course Curriculum</h2>
        <div className="sanad-line mt-6 space-y-6 pl-8">
          {course.modules.map((m, mi) => (
            <div key={m.id} className="relative">
              <span className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-cream text-xs font-semibold text-deep">
                {mi + 1}
              </span>
              <p className="font-display text-lg font-semibold text-deep">{m.title}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {m.lessons.map((l) => (
                  <li key={l.id} className="flex items-center gap-2">
                    <span className="text-ink/30">▸</span>
                    {isEnrolled ? (
                      <a
                        href={`/courses/${course.id}/lessons/${l.id}`}
                        className="focus-ring font-medium text-emerald hover:text-deep"
                      >
                        {l.title}
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 text-ink/60">
                        {l.title} <span className="text-xs text-ink/30">🔒</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
