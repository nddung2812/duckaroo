import { NextResponse } from "next/server";
import { getAllOrders, createOrder } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";

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

export async function POST(request) {
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
