import { NextResponse } from "next/server";

import { createUser, findUserByEmail } from "@/lib/users";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { issueAuthToken, PURPOSE_SET_PASSWORD } from "@/lib/authTokens";
import { sendSetPasswordEmail } from "@/lib/email";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";
import { normalizeEmail, isValidEmail, checkPasswordStrength } from "@/lib/auth/policy.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "invalid", message: "Check the form and try again." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const ip = clientIp(request);

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { status: "invalid_email", message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const strength = checkPasswordStrength(password);
  if (!strength.ok) {
    return NextResponse.json({ status: "weak_password", message: strength.reason }, { status: 400 });
  }

  const limit = await checkLimits([[`signup:ip:${ip}`, LIMITS.signupPerIp]]);
  if (!limit.allowed) {
    return NextResponse.json(
      { status: "rate_limited", message: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const created = await createUser({
    email,
    passwordHash: await hashPassword(password),
    firstName,
    lastName,
    phone,
  });

  if (created) {
    await createSession(created.id);
    return NextResponse.json({ status: "ok" });
  }

  // The address is taken. Saying so would confirm the account exists, so
  // instead handle the case that actually matters: someone whose account came
  // across from Shopify is trying to "sign up" because they do not realise they
  // already have one. Email them a set-password link and show the same
  // check-your-email message a genuinely new signup would never see.
  const existing = await findUserByEmail(email);
  const isUnclaimed = existing && !existing.password_hash;

  if (isUnclaimed) {
    const mailLimit = await checkLimits([
      [`setpw-mail:email:${email}`, LIMITS.emailPerEmail],
      [`setpw-mail:ip:${ip}`, LIMITS.emailPerIp],
    ]);

    if (mailLimit.allowed) {
      const token = await issueAuthToken({
        userId: existing.id,
        purpose: PURPOSE_SET_PASSWORD,
      });
      await sendSetPasswordEmail({
        to: existing.email,
        firstName: existing.first_name,
        token,
      });
    }
  }

  return NextResponse.json({
    status: "check_email",
    message:
      "You may already have an account with us — check your email for a link to set your password.",
  });
}
