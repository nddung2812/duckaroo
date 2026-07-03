import { NextResponse } from "next/server";
import Stripe from "stripe";

// Validate Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  try {
    const { paymentIntentId } = await request.json();

    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      paymentIntent: paymentIntent,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
