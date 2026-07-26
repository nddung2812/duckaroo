import test from "node:test";
import assert from "node:assert/strict";

import {
  accountLabel,
  accountInitial,
  fullName,
  prefill,
} from "../app/components/accountDisplay.mjs";

const FULL = { firstName: "Duc Minh", lastName: "Le", email: "duc@example.com", phone: "0400 111 111" };
const NAMELESS = { firstName: null, lastName: null, email: "guest@example.com", phone: null };

// ── prefill: the rule that protects what the customer typed ─────────────────

test("prefill fills a field that is empty", () => {
  assert.equal(prefill("", "duc@example.com"), "duc@example.com");
});

test("prefill never overwrites something already typed", () => {
  assert.equal(prefill("someone.else@example.com", "duc@example.com"), "someone.else@example.com");
});

test("prefill treats a whitespace-only field as empty", () => {
  assert.equal(prefill("   ", "duc@example.com"), "duc@example.com");
});

test("prefill respects a value typed one character at a time", () => {
  // The /api/auth/me fetch can land at any point while someone types. Every
  // partial value must survive it — otherwise their input jumps mid-keystroke.
  for (const partial of ["d", "du", "duc", "duc@", "duc@ex"]) {
    assert.equal(prefill(partial, "different@example.com"), partial);
  }
});

test("prefill leaves the field empty when the account has nothing to offer", () => {
  assert.equal(prefill("", null), "");
  assert.equal(prefill("", undefined), "");
  assert.equal(prefill("", ""), "");
});

test("prefill is idempotent — a second pass changes nothing", () => {
  const once = prefill("", "duc@example.com");
  assert.equal(prefill(once, "duc@example.com"), once);
  assert.equal(prefill(once, "someone-else@example.com"), once);
});

test("prefill copes with a non-string current value", () => {
  assert.equal(prefill(undefined, "duc@example.com"), "duc@example.com");
  assert.equal(prefill(null, "duc@example.com"), "duc@example.com");
});

// ── fullName: single-field name forms ───────────────────────────────────────

test("fullName joins both parts", () => {
  assert.equal(fullName(FULL), "Duc Minh Le");
});

test("fullName copes with only one part present", () => {
  assert.equal(fullName({ firstName: "Duc", lastName: null }), "Duc");
  assert.equal(fullName({ firstName: null, lastName: "Le" }), "Le");
});

test("fullName is empty for a nameless import, not 'undefined undefined'", () => {
  // 439 of the imported rows have no name at all — this must not put junk in
  // the booking form.
  assert.equal(fullName(NAMELESS), "");
  assert.equal(fullName(null), "");
  assert.equal(fullName(undefined), "");
});

test("fullName trims stray whitespace from either part", () => {
  assert.equal(fullName({ firstName: "  Duc  ", lastName: "  Le " }), "Duc Le");
  assert.equal(fullName({ firstName: "   ", lastName: "Le" }), "Le");
});

test("a nameless account prefills nothing into a name field", () => {
  assert.equal(prefill("", fullName(NAMELESS)), "");
});

// ── header display ──────────────────────────────────────────────────────────

test("accountLabel shows the name, falling back to the email", () => {
  assert.equal(accountLabel(FULL), "Duc Minh");
  assert.equal(accountLabel(NAMELESS), "guest@example.com");
});

test("accountLabel is blank while loading and 'Sign in' when signed out", () => {
  assert.equal(accountLabel(undefined), "");
  assert.equal(accountLabel(null), "Sign in");
});

test("accountInitial is a single uppercase letter", () => {
  assert.equal(accountInitial(FULL), "D");
  assert.equal(accountInitial(NAMELESS), "G");
  assert.equal(accountInitial({ firstName: "  ada", email: "x@y.co" }), "A");
});

test("accountInitial is empty when there is no user", () => {
  assert.equal(accountInitial(null), "");
  assert.equal(accountInitial(undefined), "");
});
