import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { fulfillSuccessfulPayment, markPaymentFailed } from "@/lib/payment-fulfillment";

/**
 * Configure this URL (https://yourdomain.com/api/payments/webhook) in the
 * Paystack dashboard under Settings → API Keys & Webhooks. Paystack calls
 * this independently of the browser redirect, so it's the reliable path —
 * the /api/payments/verify callback is just a faster UX for the common case.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    if (reference) await fulfillSuccessfulPayment(reference);
  } else if (event.event === "charge.failed") {
    const reference = event.data?.reference;
    if (reference) await markPaymentFailed(reference);
  }

  return NextResponse.json({ received: true });
}
