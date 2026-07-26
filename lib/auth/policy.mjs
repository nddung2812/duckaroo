/**
 * Pure auth policy — no database, no crypto, no I/O.
 *
 * Everything here is a decision function over plain data, which is what makes
 * the security-critical branches (the NULL-password login path, token expiry
 * and reuse) testable without a database. The thin SQL wrappers in lib/*.js
 * fetch the rows; these functions decide what the rows mean.
 *
 * This file is .mjs because the importer scripts and the node:test suite both
 * import it directly, and package.json has no "type": "module".
 */

/** Lowercase and trim. The DB has a CHECK constraint enforcing the same thing. */
export function normalizeEmail(raw) {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase();
}

/**
 * Deliberately permissive. The only genuine proof an address works is that mail
 * to it arrives, so this rejects the structurally impossible and nothing else.
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  if (email.length === 0 || email.length > 254) return false;
  if (/\s/.test(email)) return false;
  const at = email.indexOf("@");
  if (at <= 0 || at !== email.lastIndexOf("@")) return false;
  const domain = email.slice(at + 1);
  if (domain.length < 3 || !domain.includes(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
  return true;
}

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 200; // argon2 has no low cap; this bounds CPU per request

/** @returns {{ok: true} | {ok: false, reason: string}} */
export function checkPasswordStrength(password) {
  if (typeof password !== "string" || password.length === 0) {
    return { ok: false, reason: "Enter a password." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, reason: `Use at most ${MAX_PASSWORD_LENGTH} characters.` };
  }
  return { ok: true };
}

/**
 * The heart of the lazy migration.
 *
 * Called with the user row (or null) and, when a password hash exists, the
 * result of verifying it. Returns which of three things happened — the caller
 * turns that into a response, and deliberately gives the SAME generic response
 * for "no such user" and "wrong password" so the endpoint cannot be used to
 * enumerate which emails exist.
 *
 * @param {{password_hash: string|null}|null} user
 * @param {boolean} passwordMatches  ignored unless the user has a hash
 * @returns {"no_account"|"needs_password_set"|"invalid_password"|"authenticated"}
 */
export function decideLoginOutcome(user, passwordMatches) {
  if (!user) return "no_account";
  if (user.password_hash === null || user.password_hash === undefined) {
    // Imported from Shopify, never set a password here. Shopify does not export
    // password hashes, so there is nothing to verify against — this account can
    // only be claimed via an emailed set-password link.
    return "needs_password_set";
  }
  return passwordMatches ? "authenticated" : "invalid_password";
}

export const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Whether an auth token row may be redeemed right now.
 *
 * Single use and time limited: a token that has been redeemed once is dead
 * forever, even inside its expiry window.
 *
 * @param {{expires_at: Date|string, used_at: Date|string|null}|null} token
 * @param {Date} now
 * @returns {{usable: true} | {usable: false, reason: "not_found"|"already_used"|"expired"}}
 */
export function checkTokenUsable(token, now = new Date()) {
  if (!token) return { usable: false, reason: "not_found" };
  if (token.used_at !== null && token.used_at !== undefined) {
    return { usable: false, reason: "already_used" };
  }
  const expiresAt = token.expires_at instanceof Date ? token.expires_at : new Date(token.expires_at);
  if (Number.isNaN(expiresAt.getTime())) return { usable: false, reason: "expired" };
  if (expiresAt.getTime() <= now.getTime()) return { usable: false, reason: "expired" };
  return { usable: true };
}

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Same shape of check for session rows — expiry only, sessions are multi-use. */
export function isSessionLive(session, now = new Date()) {
  if (!session) return false;
  const expiresAt =
    session.expires_at instanceof Date ? session.expires_at : new Date(session.expires_at);
  if (Number.isNaN(expiresAt.getTime())) return false;
  return expiresAt.getTime() > now.getTime();
}
