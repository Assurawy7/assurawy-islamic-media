import { prisma } from "@/lib/prisma";
import { notifyPaymentSuccess, notifyEnrollment } from "@/lib/whatsapp";

/**
 * Marks a payment as successful and enrolls the student, idempotently.
 * Safe to call twice for the same reference (e.g. once from the callback
 * page and once from the webhook) — the enrollment upsert and the
 * payment status check both no-op on a repeat call.
 */
export async function fulfillSuccessfulPayment(reference: string) {
  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { student: true, course: true },
  });
  if (!payment) return { ok: false as const, reason: "Payment record not found." };

  if (payment.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { reference },
      data: { status: "SUCCESS", paidAt: new Date() },
    });
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: payment.studentId, courseId: payment.courseId } },
  });
  if (!existingEnrollment) {
    await prisma.enrollment.create({
      data: { studentId: payment.studentId, courseId: payment.courseId },
    });

    if (payment.student.phone) {
      await notifyPaymentSuccess(payment.student.phone, payment.student.name, payment.course.title);
      await notifyEnrollment(payment.student.phone, payment.student.name, payment.course.title);
    }
  }

  return { ok: true as const, courseId: payment.courseId };
}

export async function markPaymentFailed(reference: string) {
  await prisma.payment
    .update({ where: { reference }, data: { status: "FAILED" } })
    .catch(() => null);
}
