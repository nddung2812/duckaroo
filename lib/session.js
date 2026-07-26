import { cookies } from "next/headers";
import sql from "./neon";
import { generateToken, hashToken } from "./tokens";
import { SESSION_TTL_MS } from "./auth/policy.mjs";
import { toPublicUser } from "./users";

/**
 * Customer sessions.
 *
 * Database-backed rather than a signed JWT: sessions can then be revoked
 * server-side the instant a password changes, which a stateless token cannot
 * do. The cookie carries an opaque random token; the row stores only its
 * SHA-256.
 *
 * This is entirely separate from the admin `dashboard_session` cookie in
 * lib/auth.js — different audience, different lifetime, different table.
 */

export const SESSION_COOKIE = "duckaroo_session";

const COOKIE_OPTIONS = {
  httpOnly: true, // unreadable from JavaScript, so XSS cannot exfiltrate it
  secure: process.env.NODE_ENV === "production", // http on localhost only
  sameSite: "lax", // survives following a link in from an email; blocks cross-site POSTs
  path: "/",
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
};

/**
 * Create a session and set the cookie.
 * Only callable from a route handler or server action — RSC cannot set cookies.
 */
export async function createSession(userId) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${hashToken(token)}, ${expiresAt.toISOString()})
  `;

  (await cookies()).set(SESSION_COOKIE, token, COOKIE_OPTIONS);
  return { expiresAt };
}

/**
 * Read the signed-in customer. Safe to call from a React Server Component, a
 * route handler or a server action — it only reads.
 *
 * @returns {Promise<object|null>} the public-safe user, or null
 */
export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await sql`
    SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.email_verified_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.expires_at > NOW()
  `;

  return toPublicUser(rows[0] ?? null);
}

/** Convenience for route handlers that must have a user. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: { error: "Not signed in" }, status: 401 };
  return { user, error: null, status: 200 };
}

/** Delete the session row and clear the cookie. Idempotent. */
export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
  }

  jar.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

/** Housekeeping: drop expired session rows. Safe to run any time. */
export async function purgeExpiredSessions() {
  await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
}
