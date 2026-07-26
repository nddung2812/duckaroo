import { NextResponse } from "next/server";
import { getAllLeads, createLead } from "@/lib/leads";
import { requireAdmin } from "@/lib/auth";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";
import { normalizeEmail, isValidEmail } from "@/lib/auth/policy.mjs";

// Caps sized well above any genuine enquiry — they exist so the endpoint
// cannot be used to stuff megabytes of junk into the leads table.
const FIELD_LIMITS = {
  name: 120,
  phone: 40,
  location: 120,
  service: 120,
  message: 3000,
  source: 60,
};

function cleanField(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

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
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const name = cleanField(body?.name, FIELD_LIMITS.name);
    const email = normalizeEmail(body?.email);
    const phone = cleanField(body?.phone, FIELD_LIMITS.phone);
    const location = cleanField(body?.location, FIELD_LIMITS.location);
    const service = cleanField(body?.service, FIELD_LIMITS.service);
    const message = cleanField(body?.message, FIELD_LIMITS.message);
    const source = cleanField(body?.source, FIELD_LIMITS.source);

    if (!name || !email || !phone || !location || !service || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const ip = clientIp(request);
    const limit = await checkLimits([
      [`lead:ip:${ip}`, LIMITS.leadPerIp],
      [`lead:email:${email}`, LIMITS.leadPerEmail],
    ]);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const lead = await createLead({ name, email, phone, location, service, message, source });
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
