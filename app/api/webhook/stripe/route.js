import { NextResponse } from "next/server";
import Stripe from "stripe";
import emailjs from "@emailjs/browser";
import { createOrder } from "@/lib/orders";

// Validate webhook secret
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn(
    "STRIPE_WEBHOOK_SECRET not set - webhook signature verification disabled"
  );
}

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

const sendConfirmationEmail = async (paymentIntent) => {
  try {
    const metadata = paymentIntent.metadata;
    const shipping = paymentIntent.shipping;

    // Parse items from metadata
    let items = [];
    try {
      items = JSON.parse(metadata.items || "[]");
    } catch (e) {
      console.warn("Failed to parse items from metadata:", e);
    }

    const templateParams = {
      to_email: metadata.customerEmail,
      customer_name: metadata.customerName,
      order_number: metadata.orderNumber,
      order_total: `$${(paymentIntent.amount / 100).toFixed(2)} AUD`,
      items: items
        .map(
          (item) =>
            `${item.name} (Qty: ${item.quantity}) - $${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n"),
      shipping_address: shipping
        ? `${shipping.address.line1}, ${shipping.address.city}, ${shipping.address.state} ${shipping.address.postal_code}`
        : "No shipping address provided",
      shipping_method: "Standard Shipping (5-7 days) - $15.99",
    };

    // Send confirmation email using EmailJS
    await emailjs.send(
      "service_nyo9717", // EmailJS service ID
      "template_0xpbklp", // EmailJS template ID for order confirmation
      templateParams,
      "PlnxkEthyMpuKG_kJ" // EmailJS public key
    );

    console.log(`Confirmation email sent for order: ${metadata.orderNumber}`);
  } catch (error) {
    console.error("Failed to send confirmation email via webhook:", error);
  }
};

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = getStripe().webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json(
          { error: "Webhook signature verification failed" },
          { status: 400 }
        );
      }
    } else {
      // Parse the event without signature verification (development only)
      event = JSON.parse(body);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `Payment succeeded for order: ${paymentIntent.metadata?.orderNumber}`
        );

        // Send confirmation email
        await sendConfirmationEmail(paymentIntent);

        // Save order to database (backup — client may have already saved it)
        try {
          const metadata = paymentIntent.metadata || {};
          let items = [];
          try { items = JSON.parse(metadata.items || "[]"); } catch {}
          let shippingAddr = null;
          try { shippingAddr = JSON.parse(metadata.shippingAddress || "null"); } catch {}

          await createOrder({
            order_number: metadata.orderNumber || `WH-${Date.now()}`,
            stripe_payment_id: paymentIntent.id,
            customer_name: metadata.customerName || "Unknown",
            customer_email: metadata.customerEmail || "",
            customer_phone: null,
            shipping_address: shippingAddr || paymentIntent.shipping?.address || {},
            billing_address: null,
            items,
            subtotal: (paymentIntent.amount / 100) - 15,
            shipping: 15,
            total: paymentIntent.amount / 100,
            currency: paymentIntent.currency?.toUpperCase() || "AUD",
          });
        } catch (orderErr) {
          console.error("Webhook: failed to save order:", orderErr);
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log(
          `Payment failed for order: ${failedPayment.metadata?.orderNumber}`
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
