import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Who am I — for client components that need the signed-in customer. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
