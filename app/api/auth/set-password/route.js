import { NextResponse } from "next/server";

import { setUserPassword, findUserById } from "@/lib/users";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import {
  consumeAuthToken,
  PURPOSE_SET_PASSWORD,
  PURPOSE_RESET_PASSWORD,
} from "@/lib/authTokens";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";
import { checkPasswordStrength } from "@/lib/auth/policy.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Redeem a set-password or reset-password link and store the new password.
 *
 * Both link types land here — they differ only in the email copy that got the
 * customer to this point, and the token itself records which it was.
 */
const TOKEN_MESSAGES = {
  not_found: "That link is not valid. Request a new one and try again.",
  expired: "That link has expired. Request a new one and try again.",
  already_used: "That link has already been used. Request a new one and try again.",
};

export async function POST(request) {
  const ip = clientIp(request);

  // Guessing a 256-bit token is hopeless, but the limit stops someone using
  // this endpoint to grind the database.
  const limit = await checkLimits([[`setpw:ip:${ip}`, LIMITS.setPasswordPerIp]]);
  if (!limit.allowed) {
    return NextResponse.json(
      { status: "rate_limited", message: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "invalid", message: TOKEN_MESSAGES.not_found },
      { status: 400 }
    );
  }

  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  // Check the password before spending the token, so a customer who typed
  // something too short does not have to request a whole new email.
  const strength = checkPasswordStrength(password);
  if (!strength.ok) {
    return NextResponse.json({ status: "weak_password", message: strength.reason }, { status: 400 });
  }

  const result = await consumeAuthToken({
    token,
    purposes: [PURPOSE_SET_PASSWORD, PURPOSE_RESET_PASSWORD],
  });

  if (!result.ok) {
    return NextResponse.json(
      { status: result.reason, message: TOKEN_MESSAGES[result.reason] ?? TOKEN_MESSAGES.not_found },
      { status: 400 }
    );
  }

  // setUserPassword also stamps email_verified_at and deletes every existing
  // session for this user.
  await setUserPassword(result.userId, await hashPassword(password));

  // Sign them straight in — they have just proved they control the mailbox,
  // and making them immediately type the password they just chose is friction
  // with no security benefit. This session is created after the old ones are
  // deleted, so it survives.
  const user = await findUserById(result.userId);
  if (user) await createSession(user.id);

  return NextResponse.json({ status: "ok", message: "Your password is set. You're signed in." });
}
