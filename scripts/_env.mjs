/**
 * Shared helpers for the standalone scripts in this folder.
 *
 * There is no dotenv dependency in this project — scripts read .env.local by
 * hand, the same way scripts/seed-products.mjs has always done it.
 */

import { readFileSync } from "fs";

/** Load .env.local into process.env. Existing vars always win. */
export function loadEnvLocal(path = ".env.local") {
  let envFile;
  try {
    envFile = readFileSync(path, "utf8");
  } catch {
    return; // fine — the vars may already be in the environment
  }

  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("=")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();

    // `vercel env pull` and `vercel integration add` write KEY="value"; the
    // original loader in seed-products.mjs did not strip those quotes, which
    // silently turned every connection string into an unparseable one.
    if (val.length >= 2 && ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))) {
      val = val.slice(1, -1);
    }

    if (key && val && !process.env[key]) process.env[key] = val;
  }
}

/**
 * A stand-in for the Neon `sql` tag that renders the query instead of running
 * it, so a statement written once can be printed, reviewed or executed through
 * psql without being copied out and allowed to drift.
 *
 * @returns {{text: string, values: unknown[]}}
 */
export function renderQuery(strings, ...values) {
  let text = "";
  strings.forEach((part, i) => {
    text += part;
    if (i < values.length) text += `$${i + 1}`;
  });
  return { text: text.trim(), values };
}

/** Minimal `--flag` / `--key=value` parser. */
export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const eqIdx = arg.indexOf("=");
    if (eqIdx === -1) args[arg.slice(2)] = true;
    else args[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
  }
  return args;
}

/**
 * Scripts and migrations use the direct (unpooled) connection — the pooled one
 * is for the app. Falls back to DATABASE_URL so a local setup with only the one
 * var still works.
 */
export function getConnectionString(args = {}) {
  // --db=SOME_ENV_VAR targets a different database, e.g. a dev Neon instance
  // provisioned alongside production with a DEV_ prefix.
  if (typeof args.db === "string") {
    const url = process.env[args.db];
    if (!url) throw new Error(`--db=${args.db}, but ${args.db} is not set in the environment.`);
    return url;
  }

  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Set DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL in .env.local before running scripts."
    );
  }
  return url;
}

/** Host of a connection string, for logging. Never returns the credentials. */
export function describeConnection(url) {
  try {
    return new URL(url).host;
  } catch {
    return "<unparseable connection string>";
  }
}

/**
 * "Production" means precisely one thing: the database the deployed app reads
 * from, i.e. whatever DATABASE_URL points at. Anything else — a local Postgres,
 * a Neon branch, a separately provisioned dev instance — is not production.
 *
 * This used to treat every *.neon.tech host as production, which was crude: it
 * blocked legitimate dev databases while offering no real protection, since a
 * branch endpoint looks identical to the production one. Comparing hosts is
 * both more permissive where it should be and more precise where it matters.
 *
 * Neon's pooled and unpooled endpoints for the same database differ only by a
 * "-pooler" infix, so they are normalised before comparison.
 */
export function looksLikeProduction(url) {
  const host = describeConnection(url);
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host)) return false;
  if (/^host\.docker\.internal(:|$)/.test(host)) return false;

  const productionUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!productionUrl) return true; // cannot tell — assume the worst

  const normalise = (h) => h.replace("-pooler", "");
  return normalise(host) === normalise(describeConnection(productionUrl));
}

export const PRODUCTION_OVERRIDE_FLAG = "i-know-this-is-production";

/**
 * Abort unless the target is clearly non-production or the caller passed the
 * override. Callers must have already parsed args.
 */
export function assertNotProduction(url, args, { action = "This script" } = {}) {
  if (!looksLikeProduction(url)) return;
  if (args[PRODUCTION_OVERRIDE_FLAG]) {
    console.warn(
      `\n  !!  Production override in effect — writing to ${describeConnection(url)}\n`
    );
    return;
  }
  throw new Error(
    `${action} refuses to run against ${describeConnection(url)}, which does not look like a local or branch database.\n` +
      `Point DATABASE_URL_UNPOOLED at a Neon branch or a local Postgres, or re-run with --${PRODUCTION_OVERRIDE_FLAG} if you really mean it.`
  );
}
