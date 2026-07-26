import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function isAdmin() {
  const session = (await cookies()).get("dashboard_session");
  const secret = process.env.DASHBOARD_SECRET;
  return Boolean(secret && session && safeEqual(session.value, secret));
}

export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
