import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST rather than GET so a stray <img src> or a prefetch cannot log someone
 * out, and so sameSite=lax does not carry the cookie on a cross-site request.
 */
export async function POST() {
  await destroySession();
  return NextResponse.json({ status: "ok" });
}
