import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const metadata = { title: "Courses — Assurawy Islamic Media" };

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      teacher: { select: { name: true } },
      modules: { orderBy: { order: "asc" }, include: { lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-deep py-16 text-cream">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Courses</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Structured Islamic Courses</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Every course is broken into a chain of modules — each one building
            on what came before, much like a sanad carries knowledge forward.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <div className="space-y-10">
          {courses.map((c) => {
            const totalLessons = c.modules.reduce((s, m) => s + m.lessons.length, 0);
            const price = c.priceKobo > 0 ? `₦${(c.priceKobo / 100).toLocaleString()}` : "Free";
            return (
              <div
                key={c.id}
                id={c.slug}
                className="rounded-xl2 border border-deep/10 bg-white p-8 shadow-card scroll-mt-24"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                      {c.level}
                    </span>
                    <span className="ml-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-deep">
                      {price}
                    </span>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-deep">{c.title}</h2>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold">
                      Instructor · {c.teacher.name} · {c.modules.length} modules · {totalLessons} lessons
                    </p>
                  </div>
                  <Link
                    href={`/courses/${c.id}`}
                    className="focus-ring rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight"
                  >
                    View Course
                  </Link>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/75">{c.description}</p>

                <div className="sanad-line mt-6 space-y-4 pl-8">
                  {c.modules.map((m, i) => (
                    <div key={m.id} className="relative">
                      <span className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-cream text-xs font-semibold text-deep">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-deep">{m.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {courses.length === 0 && (
            <p className="text-center text-sm text-ink/50">
              New courses are being prepared — check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
