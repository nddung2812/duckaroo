import test from "node:test";
import assert from "node:assert/strict";

import {
  decideLoginOutcome,
  checkPasswordStrength,
  normalizeEmail,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
} from "../lib/auth/policy.mjs";

/**
 * The lazy-migration branch: an account exists but has never had a password on
 * this site, because Shopify does not export password hashes.
 */

const IMPORTED = { id: 1, email: "jane@example.com", password_hash: null };
const CLAIMED = { id: 2, email: "bob@example.com", password_hash: "$argon2id$v=19$..." };

test("an imported account with a NULL hash asks the customer to set a password", () => {
  assert.equal(decideLoginOutcome(IMPORTED, false), "needs_password_set");
});

test("the NULL-hash branch wins even if the caller claims the password matched", () => {
  // Nothing can legitimately verify against a NULL hash, so a truthy
  // passwordMatches here would be a bug upstream. The decision must not depend
  // on it — otherwise that bug becomes an authentication bypass on every
  // migrated account.
  assert.equal(decideLoginOutcome(IMPORTED, true), "needs_password_set");
});

test("undefined password_hash is treated the same as NULL", () => {
  // A SELECT that omits the column must not accidentally read as "claimed".
  assert.equal(decideLoginOutcome({ id: 3 }, false), "needs_password_set");
});

test("an unknown address never authenticates, whatever the password flag says", () => {
  assert.equal(decideLoginOutcome(null, false), "no_account");
  assert.equal(decideLoginOutcome(null, true), "no_account");
  assert.equal(decideLoginOutcome(undefined, true), "no_account");
});

test("a claimed account authenticates only when the password actually verified", () => {
  assert.equal(decideLoginOutcome(CLAIMED, true), "authenticated");
  assert.equal(decideLoginOutcome(CLAIMED, false), "invalid_password");
});

test("only one outcome ever authenticates", () => {
  const cases = [
    [null, true],
    [undefined, false],
    [IMPORTED, true],
    [IMPORTED, false],
    [CLAIMED, false],
    [CLAIMED, true],
  ];

  const authenticated = cases.filter(([user, ok]) => decideLoginOutcome(user, ok) === "authenticated");

  assert.equal(authenticated.length, 1);
  assert.equal(authenticated[0][0], CLAIMED);
});

test("an empty-string hash is not a valid credential", () => {
  // "" is falsy, so the route never calls verify against it — the decision
  // function must not report it as authenticated on the strength of a stale
  // passwordMatches flag.
  assert.equal(decideLoginOutcome({ id: 4, password_hash: "" }, false), "invalid_password");
});

// ── Input handling at the login boundary ────────────────────────────────────

test("email normalisation is case- and whitespace-insensitive", () => {
  assert.equal(normalizeEmail("  Jane@Example.COM "), "jane@example.com");
  assert.equal(normalizeEmail(null), "");
  assert.equal(normalizeEmail(undefined), "");
  assert.equal(normalizeEmail(12345), "");
});

test("structurally impossible addresses are rejected", () => {
  for (const good of ["a@b.co", "first.last+tag@sub.example.com.au"]) {
    assert.equal(isValidEmail(good), true, good);
  }
  for (const bad of ["", "no-at-sign", "two@at@example.com", "trailing@dot.", "a@b", "sp ace@e.com", "@example.com"]) {
    assert.equal(isValidEmail(bad), false, bad);
  }
});

test("password strength is enforced at the documented minimum", () => {
  assert.equal(checkPasswordStrength("x".repeat(MIN_PASSWORD_LENGTH)).ok, true);
  assert.equal(checkPasswordStrength("x".repeat(MIN_PASSWORD_LENGTH - 1)).ok, false);
  assert.equal(checkPasswordStrength("").ok, false);
  assert.equal(checkPasswordStrength(null).ok, false);
  // Bounded so a huge body cannot be used to burn argon2 CPU.
  assert.equal(checkPasswordStrength("x".repeat(5000)).ok, false);
});
