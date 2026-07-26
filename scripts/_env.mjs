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
    const val = trimmed.slice(eqIdx + 1).trim();
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
export function getConnectionString() {
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
 * A Neon connection is treated as production unless it is local or points at a
 * non-default branch. Neon branch endpoints are all *.neon.tech, so the host
 * alone cannot tell us which branch we are on — that is exactly why the
 * override below has to be explicit and typed out in full.
 */
export function looksLikeProduction(url) {
  const host = describeConnection(url);
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host)) return false;
  if (/^host\.docker\.internal(:|$)/.test(host)) return false;
  return true;
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
