import { NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/users";
import {
  issueAuthToken,
  PURPOSE_RESET_PASSWORD,
  PURPOSE_SET_PASSWORD,
} from "@/lib/authTokens";
import { sendResetPasswordEmail, sendSetPasswordEmail } from "@/lib/email";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";
import { normalizeEmail } from "@/lib/auth/policy.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One response, always. Whether the address has an account, has an unclaimed
 * Shopify account, or has never been seen, the customer reads exactly this.
 */
const GENERIC_RESPONSE = {
  status: "ok",
  message: "If that address has an account, we've sent it a link to set a new password.",
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const email = normalizeEmail(body?.email);
  const ip = clientIp(request);

  if (!email) return NextResponse.json(GENERIC_RESPONSE);

  const limit = await checkLimits([
    [`reset-mail:email:${email}`, LIMITS.emailPerEmail],
    [`reset-mail:ip:${ip}`, LIMITS.emailPerIp],
  ]);

  // Being throttled returns the generic response too, rather than a 429 — a
  // different answer here would confirm the address is worth hammering.
  if (!limit.allowed) return NextResponse.json(GENERIC_RESPONSE);

  const user = await findUserByEmail(email);

  if (user) {
    // Someone who never set a password gets the migration email instead of a
    // reset one — "reset your password" would be nonsense for an account that
    // has never had one.
    const isUnclaimed = user.password_hash === null || user.password_hash === undefined;

    const token = await issueAuthToken({
      userId: user.id,
      purpose: isUnclaimed ? PURPOSE_SET_PASSWORD : PURPOSE_RESET_PASSWORD,
    });

    if (isUnclaimed) {
      await sendSetPasswordEmail({ to: user.email, firstName: user.first_name, token });
    } else {
      await sendResetPasswordEmail({ to: user.email, firstName: user.first_name, token });
    }
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
