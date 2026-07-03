import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function isAdmin() {
  const session = (await cookies()).get("dashboard_session");
  const secret = process.env.DASHBOARD_SECRET;
  return Boolean(secret && session && session.value === secret);
}

export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
