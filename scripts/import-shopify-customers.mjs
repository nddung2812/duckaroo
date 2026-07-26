/**
 * Phase 2 — import a Shopify customer export into the `users` table.
 *
 *   node scripts/import-shopify-customers.mjs --file=path/to/customers_export.csv
 *   node scripts/import-shopify-customers.mjs --file=... --commit
 *
 * Dry run is the DEFAULT. Writing requires --commit, and --commit refuses to
 * run against anything that does not look like a local or branch database
 * unless you also pass --i-know-this-is-production.
 *
 * Every imported user gets password_hash = NULL. That is the point: Shopify
 * does not export passwords, so nobody can log in with their old one. The NULL
 * marks the account as "claimable" — the login route sees it and emails that
 * one person a set-password link, which is what spreads the email volume out
 * over weeks instead of blasting everyone on launch day.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { neon } from "@neondatabase/serverless";
import {
  loadEnvLocal,
  parseArgs,
  getConnectionString,
  describeConnection,
  looksLikeProduction,
  PRODUCTION_OVERRIDE_FLAG,
} from "./_env.mjs";
import { parseCsv } from "./_csv.mjs";
import { dedupeShopifyRecords, upsertUserQuery } from "./_shopify.mjs";

loadEnvLocal();

const args = parseArgs();
const commit = Boolean(args.commit);
const filePath = typeof args.file === "string" ? args.file : null;
const overridden = Boolean(args[PRODUCTION_OVERRIDE_FLAG]);

if (!filePath) {
  console.error(
    "\nUsage: node scripts/import-shopify-customers.mjs --file=<csv> [--commit] [--" +
      PRODUCTION_OVERRIDE_FLAG +
      "]\n"
  );
  process.exit(1);
}

// ── Parse and dedupe ────────────────────────────────────────────────────────

const text = readFileSync(filePath, "utf8");
const { header, records } = parseCsv(text);

if (!header.includes("Email")) {
  console.error(
    `\n${filePath} has no "Email" column — is this a Shopify customer export?\n` +
      `Columns found: ${header.join(", ")}\n`
  );
  process.exit(1);
}

const { users, skipped, mergedRowCount } = dedupeShopifyRecords(records);

// ── Where are we pointing, and are we allowed to go there? ──────────────────

const connectionString = getConnectionString(args);
const host = describeConnection(connectionString);
const isProduction = looksLikeProduction(connectionString);
const mayTouchDatabase = !isProduction || overridden;

console.log(`\nShopify customer import`);
console.log(`  file   : ${filePath}`);
console.log(`  target : ${host}${isProduction ? "  (looks like PRODUCTION)" : ""}`);
console.log(`  mode   : ${commit ? "COMMIT — will write" : "dry run — no writes"}\n`);

if (commit && !mayTouchDatabase) {
  console.error(
    `Refusing to write to ${host}, which does not look like a local or branch database.\n` +
      `Point DATABASE_URL_UNPOOLED at a Neon branch, or re-run with --${PRODUCTION_OVERRIDE_FLAG}.\n`
  );
  process.exit(1);
}

// ── Compare against what is already there ───────────────────────────────────

let existingEmails = null; // null = we did not look

if (mayTouchDatabase && users.length > 0) {
  const sql = neon(connectionString);
  const rows = await sql`
    SELECT email FROM users WHERE email = ANY(${users.map((u) => u.email)})
  `;
  existingEmails = new Set(rows.map((r) => r.email));
}

// ── Write ───────────────────────────────────────────────────────────────────

let created = 0;
let updated = 0;
let unchanged = 0;

if (commit && users.length > 0) {
  const sql = neon(connectionString);
  const BATCH_SIZE = 100;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);

    // The statement itself lives in _shopify.mjs so the verification script can
    // execute the very same one against a real Postgres.
    const results = await sql.transaction(batch.map((user) => upsertUserQuery(sql, user)));

    for (const rows of results) {
      if (rows.length === 0) unchanged++;
      else if (rows[0].inserted) created++;
      else updated++;
    }

    console.log(`  …${Math.min(i + BATCH_SIZE, users.length)}/${users.length}`);
  }
} else if (existingEmails) {
  // Dry run with database access — project the outcome.
  for (const user of users) {
    if (existingEmails.has(user.email)) updated++;
    else created++;
  }
}

// ── Reject log ──────────────────────────────────────────────────────────────

let rejectPath = null;

if (skipped.length > 0) {
  mkdirSync("outputs", { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  rejectPath = `outputs/shopify-import-rejects-${stamp}.csv`;
  const lines = ["line,email,reason"];
  for (const row of skipped) {
    lines.push(`${row.line},"${row.email.replaceAll('"', '""')}",${row.reason}`);
  }
  writeFileSync(rejectPath, lines.join("\n") + "\n", "utf8");
}

// ── Summary ─────────────────────────────────────────────────────────────────

const bySkipReason = skipped.reduce((acc, row) => {
  acc[row.reason] = (acc[row.reason] || 0) + 1;
  return acc;
}, {});

console.log(`\nSummary`);
console.log(`  rows read           ${records.length}`);
console.log(`  rows merged away    ${mergedRowCount}  (duplicate email, collapsed into one user)`);
console.log(`  importable users    ${users.length}`);

if (commit) {
  console.log(`  users created       ${created}`);
  console.log(`  users updated       ${updated}`);
  console.log(`  users unchanged     ${unchanged}`);
} else if (existingEmails) {
  console.log(`  would create        ${created}`);
  console.log(`  would update        ${updated}  (at most — unchanged rows are left alone)`);
} else {
  console.log(`  would create        ?  (did not query ${host} — production target)`);
  console.log(`                         pass --${PRODUCTION_OVERRIDE_FLAG} to preview against it`);
}

console.log(`  skipped             ${skipped.length}`);
for (const [reason, count] of Object.entries(bySkipReason)) {
  console.log(`    ${reason.padEnd(18)}${count}`);
}
if (rejectPath) console.log(`\n  rejects written to  ${rejectPath}`);

if (!commit) {
  console.log(`\nNothing was written. Re-run with --commit to apply.\n`);
} else {
  console.log(`\nDone. Every imported user has password_hash = NULL.\n`);
}
