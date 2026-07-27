import CourseForm from "@/components/dashboard/CourseForm";
export const dynamic = 'force-dynamic';
export default function AdminNewCoursePage() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Create a Course</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        You'll be taken to the course manager afterward to add modules, lessons, and quizzes.
      </p>
      <div className="mt-8">
        <CourseForm redirectPrefix="/teacher/courses" />
      </div>
    </div>
  );
}
