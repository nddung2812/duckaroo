import { NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/users";
import { verifyPassword, equalizeTiming } from "@/lib/password";
import { createSession } from "@/lib/session";
import { issueAuthToken, PURPOSE_SET_PASSWORD } from "@/lib/authTokens";
import { sendSetPasswordEmail } from "@/lib/email";
import { checkLimits, clientIp, LIMITS } from "@/lib/rateLimit";
import { normalizeEmail, decideLoginOutcome } from "@/lib/auth/policy.mjs";

// argon2 is a native module, so this must run on the Node.js runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The copy the customer sees when their account came across from Shopify and
 * has no password on this site yet. Deliberately the same string whether or not
 * the address actually exists — see the note in POST.
 */
const CHECK_EMAIL_MESSAGE =
  "We've upgraded our store — check your email to set a new password.";

const GENERIC_FAILURE = "That email or password is not right.";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid", message: GENERIC_FAILURE }, { status: 400 });
  }

  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  const ip = clientIp(request);

  if (!email || !password) {
    return NextResponse.json({ status: "invalid", message: GENERIC_FAILURE }, { status: 400 });
  }

  const limit = await checkLimits([
    [`login:ip:${ip}`, LIMITS.loginPerIp],
    [`login:email:${email}`, LIMITS.loginPerEmail],
  ]);

  if (!limit.allowed) {
    return NextResponse.json(
      { status: "rate_limited", message: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const user = await findUserByEmail(email);

  // Only verify when there is something to verify against. decideLoginOutcome
  // ignores this flag for accounts with a NULL hash.
  const passwordMatches = user?.password_hash
    ? await verifyPassword(user.password_hash, password)
    : false;

  const outcome = decideLoginOutcome(user, passwordMatches);

  switch (outcome) {
    case "authenticated": {
      await createSession(user.id);
      return NextResponse.json({ status: "ok" });
    }

    case "needs_password_set": {
      // Imported from Shopify, never claimed. Email this one person a link.
      // Throttled per address so the endpoint cannot be used to mail-bomb
      // someone's inbox by submitting their address repeatedly.
      const mailLimit = await checkLimits([
        [`setpw-mail:email:${email}`, LIMITS.emailPerEmail],
        [`setpw-mail:ip:${ip}`, LIMITS.emailPerIp],
      ]);

      if (mailLimit.allowed) {
        const token = await issueAuthToken({
          userId: user.id,
          purpose: PURPOSE_SET_PASSWORD,
        });
        await sendSetPasswordEmail({
          to: user.email,
          firstName: user.first_name,
          token,
        });
      }

      // Same response either way — a customer who clicks twice must not be
      // able to tell that the second email was suppressed.
      return NextResponse.json({ status: "check_email", message: CHECK_EMAIL_MESSAGE });
    }

    case "no_account": {
      // Burn comparable CPU so response time does not reveal that no row exists.
      await equalizeTiming(password);

      // Return the *same* response as needs_password_set, without sending
      // anything.
      //
      // The brief asks for two things that pull against each other: show
      // "check your email" for migrated accounts, and never reveal which
      // addresses exist. Showing that message only for real accounts would turn
      // this endpoint into an address oracle for the whole Shopify list.
      // Mirroring it for unknown addresses closes that; the residual leak is
      // that an account which already HAS a password answers differently, which
      // is far less useful to an attacker and unavoidable without breaking
      // ordinary login UX.
      return NextResponse.json({ status: "check_email", message: CHECK_EMAIL_MESSAGE });
    }

    case "invalid_password":
    default:
      return NextResponse.json(
        { status: "invalid", message: GENERIC_FAILURE },
        { status: 401 }
      );
  }
}
