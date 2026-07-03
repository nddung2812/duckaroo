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
    const {
      amount,
      currency = "aud",
      metadata,
      shipping,
    } = await request.json();

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    if (!metadata?.customerEmail || !metadata?.orderNumber) {
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntentData = {
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        // Add production environment info
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Set receipt email for automatic Stripe receipts
      receipt_email: metadata.customerEmail,
      // Add description for better tracking
      description: `Order #${metadata.orderNumber} - Swan Design Aquatic Center`,
    };

    // Add shipping information if provided
    if (shipping && shipping.address) {
      paymentIntentData.shipping = shipping;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // Return specific error messages for different Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        {
          error:
            "Your card was declined. Please try a different payment method.",
        },
        { status: 400 }
      );
    } else if (error.type === "StripeRateLimitError") {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    } else if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        {
          error:
            "Invalid request. Please check your information and try again.",
        },
        { status: 400 }
      );
    } else if (error.type === "StripeAPIError") {
      return NextResponse.json(
        { error: "Payment service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again." },
        { status: 500 }
      );
    }
  }
}
