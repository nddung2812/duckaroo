import { NextResponse } from "next/server";
import { updateLeadStatus, deleteLead } from "@/lib/leads";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["New", "Contacted", "Not Contacted", "Closed"];

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

    const lead = await updateLeadStatus(Number(id), status);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch (error) {
    console.error("PATCH /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const { id } = await params;
    await deleteLead(Number(id));
    return NextResponse.json({ success: true, id: Number(id) });
  } catch (error) {
    console.error("DELETE /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
