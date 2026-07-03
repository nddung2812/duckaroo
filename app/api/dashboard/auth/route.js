import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const expectedUsername = process.env.DASHBOARD_USERNAME;
    const secret = process.env.DASHBOARD_SECRET;

    if (!secret || !expectedUsername) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Timing-safe comparison for username
    const usernameBuf = Buffer.from(username ?? "");
    const expectedUsernameBuf = Buffer.from(expectedUsername);

    let usernameMatch = false;
    if (usernameBuf.length === expectedUsernameBuf.length) {
      usernameMatch = timingSafeEqual(usernameBuf, expectedUsernameBuf);
    }

    // Timing-safe comparison for password
    const passwordBuf = Buffer.from(password ?? "");
    const secretBuf = Buffer.from(secret);

    let passwordMatch = false;
    if (passwordBuf.length === secretBuf.length) {
      passwordMatch = timingSafeEqual(passwordBuf, secretBuf);
    }

    if (!usernameMatch || !passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("dashboard_session", secret, COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("dashboard_session", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
