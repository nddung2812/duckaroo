import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Initialized lazily so a missing env var fails the request, not the build
let stripe;
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
  return stripe;
}

/**
 * Reports whether a payment went through, and nothing else. The full
 * PaymentIntent carries the customer's email, shipping address and order
 * contents — returning it here would let anyone who obtains an intent id
 * read another customer's details.
 */
export async function POST(request) {
  const ip = clientIp(request);
  const limit = await checkLimits([[`confirm-payment:ip:${ip}`, LIMITS.confirmPaymentPerIp]]);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const { paymentIntentId } = await request.json();

    if (typeof paymentIntentId !== "string" || !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) {
      return NextResponse.json({ error: "Invalid payment intent id" }, { status: 400 });
    }

    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
