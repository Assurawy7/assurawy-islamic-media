/**
 * WhatsApp notifications via Meta's WhatsApp Business Cloud API.
 *
 * Requires WHATSAPP_TOKEN (a permanent access token from a Meta App with the
 * WhatsApp product added) and WHATSAPP_PHONE_NUMBER_ID (the sending
 * number's ID from the Meta dashboard).
 *
 * IMPORTANT — template messages: Meta only allows free-form text messages
 * within a 24-hour window after the user messages you first. Outside that
 * window (e.g. a certificate notification sent proactively), you must use a
 * pre-approved message **template**. Templates are created and approved in
 * Meta Business Manager before they can be used — this file assumes you've
 * already created templates named `enrollment_confirmation` and
 * `certificate_issued` (edit `sendTemplate` calls below to match whatever
 * you actually register).
 *
 * All functions here fail soft: if WhatsApp isn't configured, or the API
 * call errors, they log and return rather than throwing — a notification
 * failure should never break enrollment, certificate issuance, etc.
 */

const GRAPH_BASE = "https://graph.facebook.com/v20.0";

export function isWhatsAppConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

async function sendRaw(payload: Record<string, unknown>) {
  if (!isWhatsAppConfigured()) {
    console.warn("[whatsapp] Not configured — skipping message.", payload);
    return;
  }
  try {
    const res = await fetch(
      `${GRAPH_BASE}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[whatsapp] Send failed:", res.status, body);
    }
  } catch (err) {
    console.error("[whatsapp] Send error:", err);
  }
}

/** Sends a pre-approved template message. `params` fill the template's {{1}}, {{2}}... placeholders in order. */
export async function sendTemplate(to: string, templateName: string, params: string[]) {
  await sendRaw({
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: params.map((text) => ({ type: "text", text })),
        },
      ],
    },
  });
}

/** Free-form text — only deliverable within 24h of the user's last message to you. Use templates otherwise. */
export async function sendText(to: string, body: string) {
  await sendRaw({ to, type: "text", text: { body } });
}

// --- App-specific notification helpers -------------------------------------

export async function notifyEnrollment(phone: string, studentName: string, courseTitle: string) {
  await sendTemplate(phone, "enrollment_confirmation", [studentName, courseTitle]).catch(() => {});
}

export async function notifyCertificateIssued(
  phone: string,
  studentName: string,
  courseTitle: string,
  certificateNo: string
) {
  await sendTemplate(phone, "certificate_issued", [studentName, courseTitle, certificateNo]).catch(
    () => {}
  );
}

export async function notifyPaymentSuccess(phone: string, studentName: string, courseTitle: string) {
  await sendTemplate(phone, "payment_success", [studentName, courseTitle]).catch(() => {});
}

/** Quiz result — pass/fail with percentage. Requires a "quiz_result" template approved in Meta Business Manager. */
export async function notifyQuizResult(
  phone: string,
  studentName: string,
  quizTitle: string,
  percentage: number,
  passed: boolean
) {
  await sendTemplate(phone, "quiz_result", [
    studentName,
    quizTitle,
    `${percentage}%`,
    passed ? "PASSED" : "NOT PASSED",
  ]).catch(() => {});
}

/** New lesson published in a course the student is enrolled in. Requires a "new_lesson" template. */
export async function notifyNewLesson(phone: string, studentName: string, courseTitle: string, lessonTitle: string) {
  await sendTemplate(phone, "new_lesson", [studentName, courseTitle, lessonTitle]).catch(() => {});
}

/** New assignment posted in a course the student is enrolled in. Requires a "new_assignment" template. */
export async function notifyNewAssignment(
  phone: string,
  studentName: string,
  courseTitle: string,
  assignmentTitle: string,
  dueDate: string | null
) {
  await sendTemplate(phone, "new_assignment", [
    studentName,
    courseTitle,
    assignmentTitle,
    dueDate ?? "No due date",
  ]).catch(() => {});
}
