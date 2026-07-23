/**
 * Paystack integration (https://paystack.com) — Nigeria-focused payment
 * gateway. Requires PAYSTACK_SECRET_KEY (server-side only). This app uses
 * Paystack's hosted checkout (redirect flow), which never needs the public
 * key client-side — NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.example is only
 * there for later, if this ever switches to Paystack's inline JS popup.
 *
 * Flow used by this app:
 *   1. Student clicks "Pay & Enroll" on a priced course.
 *   2. POST /api/payments/initialize creates a Paystack transaction and
 *      returns an `authorization_url` — the browser redirects there.
 *   3. Paystack redirects back to /payment/callback?reference=...
 *   4. That page calls GET /api/payments/verify?reference=... which asks
 *      Paystack to confirm the charge, then enrolls the student.
 *   5. Paystack also POSTs to /api/payments/webhook independently — this is
 *      the source of truth in production (step 4 is just a fast UX path),
 *      since a user closing the tab shouldn't block the enrollment.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return key;
}

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export async function initializeTransaction(params: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo, // Paystack expects the smallest currency unit (kobo)
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to initialize Paystack transaction.");
  }
  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } }
  );
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to verify Paystack transaction.");
  }
  return data.data as {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    customer: { email: string };
    metadata?: Record<string, unknown>;
  };
}

/** Verifies the `x-paystack-signature` header on incoming webhooks. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const crypto = require("crypto") as typeof import("crypto");
  const hash = crypto.createHmac("sha512", secretKey()).update(rawBody).digest("hex");

  // Timing-safe comparison — a plain `===` leaks how many leading characters
  // matched via response-time differences, which (in theory) helps an
  // attacker brute-force a valid signature byte by byte.
  const expected = Buffer.from(hash, "hex");
  const actual = Buffer.from(signature, "hex");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}
