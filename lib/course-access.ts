import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/auth";

/** Returns the course if the session is an Admin, or a Teacher who owns it. Otherwise null. */
export async function getOwnedCourse(courseId: string, session: SessionPayload) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return null;
  if (session.role === "ADMIN") return course;
  if (session.role === "TEACHER" && course.teacherId === session.sub) return course;
  return null;
}

/** Same check, but starting from a moduleId — walks up to the course. */
export async function getOwnedCourseByModule(moduleId: string, session: SessionPayload) {
  const module_ = await prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } });
  if (!module_) return null;
  const { course } = module_;
  if (session.role === "ADMIN") return { course, module: module_ };
  if (session.role === "TEACHER" && course.teacherId === session.sub) return { course, module: module_ };
  return null;
}

/** Same check, but starting from a lessonId — walks up through module to the course. */
export async function getOwnedCourseByLesson(lessonId: string, session: SessionPayload) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });
  if (!lesson) return null;
  const { course } = lesson.module;
  if (session.role === "ADMIN") return { course, lesson };
  if (session.role === "TEACHER" && course.teacherId === session.sub) return { course, lesson };
  return null;
}

/** Same check, but starting from an attachmentId — walks up through lesson/module to the course. */
export async function getOwnedCourseByAttachment(attachmentId: string, session: SessionPayload) {
  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });
  if (!attachment) return null;
  const { course } = attachment.lesson.module;
  if (session.role === "ADMIN") return { course, attachment };
  if (session.role === "TEACHER" && course.teacherId === session.sub) return { course, attachment };
  return null;
}
