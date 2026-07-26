import { randomBytes, createHash } from "crypto";

/**
 * Opaque bearer tokens for email links and session cookies.
 *
 * The raw token exists in exactly one place — the email or the cookie. The
 * database only ever holds its SHA-256, so a database leak yields no working
 * links and no live sessions.
 *
 * SHA-256 with no salt or stretching is the right choice here, unlike for
 * passwords: these are 256 bits of CSPRNG output, so there is no dictionary to
 * attack and nothing to slow an attacker down for. Fast hashing also keeps the
 * lookup a plain indexed equality check.
 */

/** 32 random bytes, base64url encoded — 43 URL-safe characters. */
export function generateToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
