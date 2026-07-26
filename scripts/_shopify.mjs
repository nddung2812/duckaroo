/**
 * Shopify customer export → user records. Pure functions, no I/O, no database.
 *
 * Kept separate from the importer script so the dedupe rules can be tested
 * directly (test/dedupe.test.mjs).
 */

import { normalizeEmail, isValidEmail } from "../lib/auth/policy.mjs";

/** "" and whitespace-only become null, so COALESCE in SQL behaves sensibly. */
function blankToNull(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Shopify writes the customer ID with a leading apostrophe so spreadsheets do
 * not mangle it into a float: '5655024337058
 */
function cleanCustomerId(value) {
  const trimmed = blankToNull(value);
  if (trimmed === null) return null;
  return blankToNull(trimmed.replace(/^'/, ""));
}

/**
 * Map one CSV record to the shape of a `users` row.
 * Does not validate — that is the caller's job, so it can report why.
 */
export function mapShopifyRecord(record) {
  const values = record.values ?? {};
  return {
    line: record.line,
    rawEmail: values["Email"] ?? "",
    email: normalizeEmail(values["Email"]),
    firstName: blankToNull(values["First Name"]),
    lastName: blankToNull(values["Last Name"]),
    // The account-level phone is the better one; the address phone is a fallback.
    phone: blankToNull(values["Phone"]) ?? blankToNull(values["Default Address Phone"]),
    shopifyCustomerId: cleanCustomerId(values["Customer ID"]),
  };
}

/**
 * The upsert the importer runs, as a single reusable statement.
 *
 * Lives here rather than inline in the importer so it has exactly one
 * definition: the importer executes it against Neon, and the verification
 * script renders the same function through a fake tag to run it against a real
 * Postgres. There is no second copy to drift.
 *
 * password_hash, source and email_verified_at are absent from the DO UPDATE SET
 * list, so re-running can never clobber a password a customer has already set.
 * The WHERE clause suppresses no-op updates, so an unchanged row returns no
 * rows at all and is reported as unchanged rather than as an update.
 *
 * @param sql a Neon `sql` tag, or renderQuery from ./_env.mjs
 */
export function upsertUserQuery(sql, user) {
  return sql`
    INSERT INTO users (email, first_name, last_name, phone, source, shopify_customer_id)
    VALUES (
      ${user.email},
      ${user.firstName},
      ${user.lastName},
      ${user.phone},
      'shopify',
      ${user.shopifyCustomerId}
    )
    ON CONFLICT (email) DO UPDATE SET
      first_name          = COALESCE(users.first_name, EXCLUDED.first_name),
      last_name           = COALESCE(users.last_name, EXCLUDED.last_name),
      phone               = COALESCE(users.phone, EXCLUDED.phone),
      shopify_customer_id = COALESCE(users.shopify_customer_id, EXCLUDED.shopify_customer_id)
    WHERE (users.first_name          IS NULL AND EXCLUDED.first_name          IS NOT NULL)
       OR (users.last_name           IS NULL AND EXCLUDED.last_name           IS NOT NULL)
       OR (users.phone               IS NULL AND EXCLUDED.phone               IS NOT NULL)
       OR (users.shopify_customer_id IS NULL AND EXCLUDED.shopify_customer_id IS NOT NULL)
    RETURNING (xmax = 0) AS inserted
  `;
}

export const SKIP_REASONS = {
  BLANK_EMAIL: "blank email",
  INVALID_EMAIL: "invalid email",
};

/**
 * Collapse the export into one user per email address.
 *
 * Shopify emits one row per customer *address*, so a customer with a billing
 * and a shipping address appears more than once. The first non-empty value for
 * each field wins, in file order — later rows only fill gaps, they never
 * overwrite a value an earlier row already supplied.
 *
 * @param {Array<{values: Record<string,string>, line: number}>} records
 * @returns {{
 *   users: Array<object>,
 *   skipped: Array<{line: number, email: string, reason: string}>,
 *   mergedRowCount: number
 * }}
 */
export function dedupeShopifyRecords(records) {
  const byEmail = new Map();
  const skipped = [];
  let mergedRowCount = 0;

  for (const record of records) {
    const mapped = mapShopifyRecord(record);

    if (mapped.email.length === 0) {
      skipped.push({
        line: mapped.line,
        email: "",
        reason: SKIP_REASONS.BLANK_EMAIL,
      });
      continue;
    }

    if (!isValidEmail(mapped.email)) {
      skipped.push({
        line: mapped.line,
        email: mapped.rawEmail.trim(),
        reason: SKIP_REASONS.INVALID_EMAIL,
      });
      continue;
    }

    const existing = byEmail.get(mapped.email);

    if (!existing) {
      byEmail.set(mapped.email, {
        email: mapped.email,
        firstName: mapped.firstName,
        lastName: mapped.lastName,
        phone: mapped.phone,
        shopifyCustomerId: mapped.shopifyCustomerId,
        sourceLines: [mapped.line],
      });
      continue;
    }

    // Fill gaps only — first non-empty value wins.
    existing.firstName ??= mapped.firstName;
    existing.lastName ??= mapped.lastName;
    existing.phone ??= mapped.phone;
    existing.shopifyCustomerId ??= mapped.shopifyCustomerId;
    existing.sourceLines.push(mapped.line);
    mergedRowCount++;
  }

  return { users: [...byEmail.values()], skipped, mergedRowCount };
}
