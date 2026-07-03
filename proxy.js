import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip the login page itself to avoid redirect loop
  if (pathname.startsWith("/dashboard/login")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("dashboard_session");
  const secret = process.env.DASHBOARD_SECRET;

  if (!secret || !cookie || cookie.value !== secret) {
    const loginUrl = new URL("/dashboard/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
