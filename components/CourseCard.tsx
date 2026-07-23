import Link from "next/link";

export type Course = {
  slug: string;
  title: string;
  instructor: string;
  level: string;
  modules: number;
  lessons: number;
  description: string;
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group flex flex-col rounded-xl2 border border-deep/10 bg-white p-6 shadow-card transition hover:-translate-y-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
          {course.level}
        </span>
        <span className="text-xs text-ink/50">
          {course.modules} modules · {course.lessons} lessons
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold text-deep">
        {course.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
        {course.description}
      </p>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gold">
        Instructor · {course.instructor}
      </p>
      <Link
        href={`/courses#${course.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald group-hover:text-deep"
      >
        View Course
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
