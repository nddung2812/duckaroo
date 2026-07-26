import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStockItemsByIds } from "@/lib/stock";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";
import { isValidEmail } from "@/lib/auth/policy.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Flat rate, mirrored in the checkout UI. If this changes, change both.
const SHIPPING_COST = 15.0;
const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY_PER_ITEM = 99;

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
 * The client sends product ids and quantities; the amount is computed here
 * from prices in the database. The client-side total is display only — a
 * tampered request cannot buy a $500 tank for 50 cents.
 */
export async function POST(request) {
  const ip = clientIp(request);
  const limit = await checkLimits([[`payment-intent:ip:${ip}`, LIMITS.paymentIntentPerIp]]);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const { items, metadata, shipping } = body ?? {};

    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINE_ITEMS) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    // Collapse duplicates and validate shape before touching the DB.
    const quantities = new Map();
    for (const item of items) {
      const id = Number(item?.id);
      const quantity = Number(item?.quantity);
      if (
        !Number.isInteger(id) || id <= 0 ||
        !Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM
      ) {
        return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
      }
      quantities.set(id, (quantities.get(id) ?? 0) + quantity);
    }

    const customerEmail = typeof metadata?.customerEmail === "string" ? metadata.customerEmail.trim() : "";
    const customerName = typeof metadata?.customerName === "string" ? metadata.customerName.trim().slice(0, 120) : "";
    const orderNumber = typeof metadata?.orderNumber === "string" ? metadata.orderNumber.trim() : "";

    if (!isValidEmail(customerEmail) || !/^[A-Z0-9-]{4,32}$/i.test(orderNumber)) {
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 }
      );
    }

    const products = await getStockItemsByIds([...quantities.keys()]);
    if (products.length !== quantities.size) {
      return NextResponse.json({ error: "One or more products no longer exist" }, { status: 400 });
    }

    let subtotal = 0;
    const lineItems = [];
    for (const product of products) {
      const quantity = quantities.get(product.id);
      if (product.stock < quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}` },
          { status: 409 }
        );
      }
      subtotal += Number(product.price) * quantity;
      lineItems.push({ name: product.name, quantity, price: Number(product.price) });
    }

    const total = subtotal + SHIPPING_COST;

    const paymentIntentData = {
      amount: Math.round(total * 100), // Stripe expects amount in cents
      currency: "aud",
      metadata: {
        orderNumber,
        customerEmail,
        customerName,
        // Server-priced line items, so the webhook email reflects real prices.
        // Stripe caps metadata values at 500 chars; a truncated JSON string is
        // handled by the webhook's try/catch around JSON.parse.
        items: JSON.stringify(lineItems).slice(0, 500),
        shippingAddress:
          typeof metadata?.shippingAddress === "string"
            ? metadata.shippingAddress.slice(0, 500)
            : "",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail,
      description: `Order #${orderNumber} - Duckaroo`,
    };

    if (shipping && shipping.address) {
      paymentIntentData.shipping = {
        name: String(shipping.name ?? customerName).slice(0, 120),
        phone: typeof shipping.phone === "string" ? shipping.phone.slice(0, 40) : undefined,
        address: {
          line1: String(shipping.address.line1 ?? "").slice(0, 200),
          city: String(shipping.address.city ?? "").slice(0, 100),
          state: String(shipping.address.state ?? "").slice(0, 100),
          postal_code: String(shipping.address.postal_code ?? "").slice(0, 20),
          country: String(shipping.address.country ?? "AU").slice(0, 2),
        },
      };
    }

    const paymentIntent = await getStripe().paymentIntents.create(paymentIntentData);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      metadata: paymentIntent.metadata,
      // The authoritative total — the client compares this against what it
      // displayed and refuses to proceed on a mismatch (stale cart prices).
      amount: total,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: "Your card was declined. Please try a different payment method." },
        { status: 400 }
      );
    } else if (error.type === "StripeRateLimitError") {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    } else if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid request. Please check your information and try again." },
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
