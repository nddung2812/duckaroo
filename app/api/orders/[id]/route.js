import { NextResponse } from "next/server";
import { updateOrderStatus, deleteOrder } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["New", "Processing", "Shipped", "Delivered", "Cancelled"];

export async function PATCH(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await updateOrderStatus(Number(id), status);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const { id } = await params;
    await deleteOrder(Number(id));
    return NextResponse.json({ success: true, id: Number(id) });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
