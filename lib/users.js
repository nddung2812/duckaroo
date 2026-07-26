import sql from "./neon";
import { normalizeEmail } from "./auth/policy.mjs";

/**
 * Query helpers for the `users` table. All SQL touching users lives here, the
 * same way lib/leads.js and lib/orders.js own their tables.
 *
 * Every email crossing this boundary is normalised first — the DB has a
 * CHECK (email = lower(email)) constraint that will reject anything that slips
 * through, but normalising here means callers never have to think about it.
 */

export async function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const rows = await sql`
    SELECT id, email, password_hash, first_name, last_name, phone,
           source, shopify_customer_id, email_verified_at, created_at, updated_at
    FROM users
    WHERE email = ${normalized}
  `;
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const rows = await sql`
    SELECT id, email, password_hash, first_name, last_name, phone,
           source, shopify_customer_id, email_verified_at, created_at, updated_at
    FROM users
    WHERE id = ${id}
  `;
  return rows[0] ?? null;
}

/**
 * Create a brand-new account from the signup form.
 *
 * Returns null if the address is already taken, so the caller can return the
 * same generic response it would for a successful signup rather than
 * confirming the address exists.
 */
export async function createUser({ email, passwordHash, firstName, lastName, phone }) {
  const normalized = normalizeEmail(email);

  const rows = await sql`
    INSERT INTO users (email, password_hash, first_name, last_name, phone, source, email_verified_at)
    VALUES (
      ${normalized},
      ${passwordHash},
      ${firstName || null},
      ${lastName || null},
      ${phone || null},
      'signup',
      NULL
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, first_name, last_name
  `;
  return rows[0] ?? null;
}

/**
 * Set or replace a password.
 *
 * Also stamps email_verified_at: the only way to reach this is by following a
 * link sent to that address, which proves the customer controls the mailbox.
 * Revokes every existing session so a reset kicks out anyone already logged in
 * — the usual reason someone resets a password is that they suspect they
 * should not be the only one who knows it.
 */
export async function setUserPassword(userId, passwordHash) {
  await sql`
    UPDATE users
    SET password_hash = ${passwordHash},
        email_verified_at = COALESCE(email_verified_at, NOW())
    WHERE id = ${userId}
  `;
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
}

/** Strip everything a browser has no business seeing. */
export function toPublicUser(user) {
  if (!user) return null;
  return {
    id: String(user.id),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    emailVerified: Boolean(user.email_verified_at),
  };
}
