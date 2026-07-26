import sql from "./neon";
import { generateToken, hashToken } from "./tokens";
import { checkTokenUsable, TOKEN_TTL_MS } from "./auth/policy.mjs";

/**
 * Single-use, one-hour tokens for set-password and reset-password links.
 *
 * Only the SHA-256 is stored. The raw token is returned once, goes into an
 * email, and is never persisted or logged.
 */

export const PURPOSE_SET_PASSWORD = "set_password";
export const PURPOSE_RESET_PASSWORD = "reset_password";

/**
 * Issue a token, invalidating any earlier unused token for the same user and
 * purpose. Requesting a second link therefore silently kills the first, so a
 * forwarded or intercepted older email stops working.
 *
 * @returns {Promise<string>} the raw token — put it in the email, nowhere else
 */
export async function issueAuthToken({ userId, purpose, ttlMs = TOKEN_TTL_MS }) {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlMs);

  await sql`
    UPDATE auth_tokens
    SET used_at = NOW()
    WHERE user_id = ${userId} AND purpose = ${purpose} AND used_at IS NULL
  `;

  await sql`
    INSERT INTO auth_tokens (user_id, token_hash, purpose, expires_at)
    VALUES (${userId}, ${tokenHash}, ${purpose}, ${expiresAt.toISOString()})
  `;

  return token;
}

/**
 * Redeem a token. Marks it used in the same statement that claims it, so two
 * concurrent requests with the same token cannot both succeed — the second
 * matches zero rows.
 *
 * The SELECT beforehand exists only to tell the customer *why* a link failed
 * ("that link has expired" reads better than "invalid"). The UPDATE is the
 * authority; if it claims nothing, the token is not usable regardless of what
 * the SELECT saw a moment earlier.
 *
 * @returns {Promise<{ok: true, userId: string} | {ok: false, reason: string}>}
 */
export async function consumeAuthToken({ token, purposes }) {
  if (typeof token !== "string" || token.length === 0) {
    return { ok: false, reason: "not_found" };
  }

  const allowed = Array.isArray(purposes) ? purposes : [purposes];
  const tokenHash = hashToken(token);

  const rows = await sql`
    SELECT user_id, purpose, expires_at, used_at
    FROM auth_tokens
    WHERE token_hash = ${tokenHash}
  `;

  const row = rows[0] ?? null;
  // A token issued for a different purpose is treated as if it did not exist,
  // so one kind of link can never be replayed as another.
  if (row && !allowed.includes(row.purpose)) return { ok: false, reason: "not_found" };

  const check = checkTokenUsable(row);
  if (!check.usable) return { ok: false, reason: check.reason };

  const claimed = await sql`
    UPDATE auth_tokens
    SET used_at = NOW()
    WHERE token_hash = ${tokenHash}
      AND purpose = ANY(${allowed})
      AND used_at IS NULL
      AND expires_at > NOW()
    RETURNING user_id
  `;

  if (claimed.length === 0) return { ok: false, reason: "already_used" };
  return { ok: true, userId: String(claimed[0].user_id) };
}

/**
 * Inspect a token without redeeming it, so the set-password page can show a
 * useful message before the customer types a new password into a dead form.
 */
export async function peekAuthToken({ token, purposes }) {
  if (typeof token !== "string" || token.length === 0) {
    return { usable: false, reason: "not_found" };
  }

  const allowed = Array.isArray(purposes) ? purposes : [purposes];

  const rows = await sql`
    SELECT purpose, expires_at, used_at
    FROM auth_tokens
    WHERE token_hash = ${hashToken(token)}
  `;

  const row = rows[0] ?? null;
  if (row && !allowed.includes(row.purpose)) return { usable: false, reason: "not_found" };
  return checkTokenUsable(row);
}

/** Housekeeping: drop tokens that are long dead. Safe to run any time. */
export async function purgeExpiredAuthTokens() {
  await sql`DELETE FROM auth_tokens WHERE expires_at < NOW() - INTERVAL '7 days'`;
}
