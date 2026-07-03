import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get("dashboard_session");
  const secret = process.env.DASHBOARD_SECRET;

  if (!secret || !session || session.value !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json(
      { error: "Deploy hook URL not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Deploy hook request failed" },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to trigger deploy" },
      { status: 500 }
    );
  }
}
