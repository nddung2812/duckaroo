import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAllOrders, createOrder } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";
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

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

/**
 * Public because the checkout client calls it after paying, but nothing is
 * stored on say-so: the order is only written when the referenced Stripe
 * payment exists, succeeded, and its charged amount matches the claimed
 * total. Fabricated or replayed requests fail one of those checks (replays
 * hit the unique index on stripe_payment_id).
 */
export async function POST(request) {
  const ip = clientIp(request);
  const limit = await checkLimits([[`order-create:ip:${ip}`, LIMITS.orderCreatePerIp]]);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const {
      order_number,
      stripe_payment_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      billing_address,
      items,
      subtotal,
      shipping,
      total,
      currency,
    } = body;

    if (!order_number || !stripe_payment_id || !customer_name || !customer_email || !items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (
      typeof stripe_payment_id !== "string" ||
      !/^pi_[A-Za-z0-9]+$/.test(stripe_payment_id) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 100
    ) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    let paymentIntent;
    try {
      paymentIntent = await getStripe().paymentIntents.retrieve(stripe_payment_id);
    } catch {
      return NextResponse.json({ error: "Payment not found" }, { status: 400 });
    }

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment has not succeeded" }, { status: 400 });
    }

    if (Math.round(Number(total) * 100) !== paymentIntent.amount) {
      return NextResponse.json(
        { error: "Order total does not match the payment" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      order_number,
      stripe_payment_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      billing_address,
      items,
      subtotal,
      shipping,
      total,
      currency,
    });

    if (!order) {
      return NextResponse.json({ message: "Order already exists" }, { status: 200 });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
