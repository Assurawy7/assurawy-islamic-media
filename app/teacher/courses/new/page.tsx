import CourseForm from "@/components/dashboard/CourseForm";
export const dynamic = 'force-dynamic';
export default function TeacherNewCoursePage() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">Teacher</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-deep">Create a Course</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        Give it a title and description now - you can add modules, lessons, PDFs and quizzes right after.
      </p>
      <div className="mt-8">
        <CourseForm redirectPrefix="/teacher/courses" />
      </div>
    </div>
  );
}
