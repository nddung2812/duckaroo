/**
 * Phase 1 — customer authentication schema.
 *
 * Creates: users, auth_tokens, sessions, rate_limits.
 * Idempotent: every statement is IF NOT EXISTS / OR REPLACE, so re-running is
 * safe and is the intended way to apply this to each environment.
 *
 * This project has no migration tool — schema lives in scripts, the same way
 * scripts/seed-products.mjs creates the products table.
 *
 *   node scripts/migrate-auth.mjs --dry-run   # print the statements, touch nothing
 *   node scripts/migrate-auth.mjs             # apply
 *
 * Note: unlike the importer, this is *allowed* to run against production —
 * that is the whole point of a migration. It prints the target host first.
 */

import { neon } from "@neondatabase/serverless";
import {
  loadEnvLocal,
  parseArgs,
  getConnectionString,
  describeConnection,
} from "./_env.mjs";

loadEnvLocal();

const args = parseArgs();
const dryRun = Boolean(args["dry-run"]);
const connectionString = getConnectionString();

/**
 * Every statement, in dependency order. One statement per entry — the Neon HTTP
 * driver executes a single statement per call.
 *
 * Design notes:
 *
 * - `email` is TEXT with a `lower(email)` CHECK rather than citext. It avoids
 *   requiring an extension, and it makes the "we always store emails
 *   lowercased" invariant fail loudly at the DB boundary instead of silently
 *   working only because of a collation.
 *
 * - `password_hash` is nullable on purpose. That NULL is the entire lazy
 *   migration strategy: a row with a NULL hash is an imported Shopify customer
 *   who has not set a password on the new site yet.
 *
 * - `shopify_customer_id` is indexed but NOT unique. If a customer changes
 *   their email in a later export, an upsert-on-email would legitimately create
 *   a second row; a unique constraint would turn that into a hard crash
 *   mid-import. The importer reports these as a warning instead.
 *
 * - auth_tokens and sessions store only a SHA-256 of the token. The raw value
 *   exists in the email/cookie and nowhere else, so a database leak does not
 *   hand out working links or live sessions.
 */
const statements = [
  [
    "users table",
    (sql) => sql`
      CREATE TABLE IF NOT EXISTS users (
        id                  BIGSERIAL PRIMARY KEY,
        email               TEXT NOT NULL,
        password_hash       TEXT,
        first_name          TEXT,
        last_name           TEXT,
        phone               TEXT,
        source              TEXT NOT NULL DEFAULT 'signup',
        shopify_customer_id TEXT,
        email_verified_at   TIMESTAMPTZ,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT users_email_not_blank  CHECK (length(email) > 0),
        CONSTRAINT users_email_lowercased CHECK (email = lower(email)),
        CONSTRAINT users_source_valid     CHECK (source IN ('shopify', 'signup'))
      )
    `,
  ],
  [
    "users.email unique index",
    (sql) => sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (email)`,
  ],
  [
    "users.shopify_customer_id index",
    (sql) => sql`
      CREATE INDEX IF NOT EXISTS users_shopify_customer_id_idx
      ON users (shopify_customer_id)
      WHERE shopify_customer_id IS NOT NULL
    `,
  ],

  [
    "auth_tokens table",
    (sql) => sql`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id         BIGSERIAL PRIMARY KEY,
        user_id    BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        purpose    TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at    TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT auth_tokens_purpose_valid
          CHECK (purpose IN ('set_password', 'reset_password'))
      )
    `,
  ],
  [
    "auth_tokens.token_hash unique index",
    (sql) => sql`
      CREATE UNIQUE INDEX IF NOT EXISTS auth_tokens_token_hash_key
      ON auth_tokens (token_hash)
    `,
  ],
  [
    "auth_tokens live-token lookup index",
    (sql) => sql`
      CREATE INDEX IF NOT EXISTS auth_tokens_user_live_idx
      ON auth_tokens (user_id, purpose)
      WHERE used_at IS NULL
    `,
  ],
  [
    "auth_tokens expiry sweep index",
    (sql) => sql`
      CREATE INDEX IF NOT EXISTS auth_tokens_expires_at_idx ON auth_tokens (expires_at)
    `,
  ],

  [
    "sessions table",
    (sql) => sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id           BIGSERIAL PRIMARY KEY,
        user_id      BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        token_hash   TEXT NOT NULL,
        expires_at   TIMESTAMPTZ NOT NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `,
  ],
  [
    "sessions.token_hash unique index",
    (sql) => sql`
      CREATE UNIQUE INDEX IF NOT EXISTS sessions_token_hash_key ON sessions (token_hash)
    `,
  ],
  [
    "sessions.user_id index",
    (sql) => sql`CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id)`,
  ],
  [
    "sessions expiry sweep index",
    (sql) => sql`
      CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at)
    `,
  ],

  // Fixed-window counters. Postgres rather than Redis: no new infrastructure,
  // and at this traffic level the extra write per attempt is irrelevant.
  [
    "rate_limits table",
    (sql) => sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        bucket       TEXT PRIMARY KEY,
        count        INTEGER NOT NULL DEFAULT 0,
        window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at   TIMESTAMPTZ NOT NULL
      )
    `,
  ],
  [
    "rate_limits expiry sweep index",
    (sql) => sql`
      CREATE INDEX IF NOT EXISTS rate_limits_expires_at_idx ON rate_limits (expires_at)
    `,
  ],

  // updated_at maintenance, matching the pattern used for the products table.
  [
    "set_updated_at() function",
    (sql) => sql`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `,
  ],
  [
    "drop users updated_at trigger",
    (sql) => sql`DROP TRIGGER IF EXISTS set_users_updated_at ON users`,
  ],
  [
    "users updated_at trigger",
    (sql) => sql`
      CREATE TRIGGER set_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `,
  ],
];

console.log(`\nAuth schema migration`);
console.log(`  target : ${describeConnection(connectionString)}`);
console.log(`  mode   : ${dryRun ? "dry run (no writes)" : "apply"}\n`);

if (dryRun) {
  for (const [label] of statements) console.log(`  would run  ${label}`);
  console.log(`\n${statements.length} statements. Nothing was written.\n`);
  process.exit(0);
}

const sql = neon(connectionString);

for (const [label, run] of statements) {
  await run(sql);
  console.log(`  ok  ${label}`);
}

console.log(`\nDone — ${statements.length} statements applied.\n`);
