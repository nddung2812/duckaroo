import { NextResponse } from "next/server";
import { getAllLeads, createLead } from "@/lib/leads";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const leads = await getAllLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, location, service, message, source } = body;

    if (!name || !email || !phone || !location || !service || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lead = await createLead({ name, email, phone, location, service, message, source });
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
