import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { fulfillSuccessfulPayment, markPaymentFailed } from "@/lib/payment-fulfillment";
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "reference is required." }, { status: 400 });
  }

  try {
    const tx = await verifyTransaction(reference);

    if (tx.status !== "success") {
      await markPaymentFailed(reference);
      return NextResponse.json({ success: false, status: tx.status });
    }

    const result = await fulfillSuccessfulPayment(reference);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.reason }, { status: 404 });
    }

    return NextResponse.json({ success: true, courseId: result.courseId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Verification failed." }, { status: 502 });
  }
}
