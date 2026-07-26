import test from "node:test";
import assert from "node:assert/strict";

import { checkTokenUsable, isSessionLive, TOKEN_TTL_MS, SESSION_TTL_MS } from "../lib/auth/policy.mjs";
import { generateToken, hashToken } from "../lib/tokens.js";

const NOW = new Date("2026-07-26T10:00:00.000Z");
const minutes = (n) => new Date(NOW.getTime() + n * 60 * 1000);

function tokenRow(overrides = {}) {
  return { expires_at: minutes(60), used_at: null, ...overrides };
}

// ── Expiry ──────────────────────────────────────────────────────────────────

test("tokens live for exactly one hour, as the emails promise", () => {
  assert.equal(TOKEN_TTL_MS, 60 * 60 * 1000);
});

test("a fresh token is usable", () => {
  assert.deepEqual(checkTokenUsable(tokenRow(), NOW), { usable: true });
});

test("a token one minute past expiry is rejected", () => {
  const result = checkTokenUsable(tokenRow({ expires_at: minutes(-1) }), NOW);
  assert.deepEqual(result, { usable: false, reason: "expired" });
});

test("expiry is exclusive — a token expiring exactly now is already dead", () => {
  const result = checkTokenUsable(tokenRow({ expires_at: NOW }), NOW);
  assert.deepEqual(result, { usable: false, reason: "expired" });
});

test("a token one second inside the window still works", () => {
  const almost = new Date(NOW.getTime() + 1000);
  assert.deepEqual(checkTokenUsable(tokenRow({ expires_at: almost }), NOW), { usable: true });
});

test("expiry works off ISO strings, which is what the driver returns", () => {
  assert.deepEqual(checkTokenUsable(tokenRow({ expires_at: minutes(30).toISOString() }), NOW), {
    usable: true,
  });
  assert.deepEqual(checkTokenUsable(tokenRow({ expires_at: minutes(-30).toISOString() }), NOW), {
    usable: false,
    reason: "expired",
  });
});

test("an unparseable expiry is treated as expired, never as usable", () => {
  assert.deepEqual(checkTokenUsable(tokenRow({ expires_at: "not a date" }), NOW), {
    usable: false,
    reason: "expired",
  });
});

// ── Single use ──────────────────────────────────────────────────────────────

test("a redeemed token is dead even while still inside its window", () => {
  const result = checkTokenUsable(
    tokenRow({ expires_at: minutes(59), used_at: minutes(-1) }),
    NOW
  );
  assert.deepEqual(result, { usable: false, reason: "already_used" });
});

test("used beats expired — a spent token never reports as merely expired", () => {
  const result = checkTokenUsable(
    tokenRow({ expires_at: minutes(-120), used_at: minutes(-119) }),
    NOW
  );
  assert.equal(result.reason, "already_used");
});

test("a used_at in the future still counts as used", () => {
  // Clock skew between the app and the database must not resurrect a token.
  const result = checkTokenUsable(tokenRow({ used_at: minutes(5) }), NOW);
  assert.deepEqual(result, { usable: false, reason: "already_used" });
});

test("a missing token row is reported as not_found, not as usable", () => {
  assert.deepEqual(checkTokenUsable(null, NOW), { usable: false, reason: "not_found" });
  assert.deepEqual(checkTokenUsable(undefined, NOW), { usable: false, reason: "not_found" });
});

test("no combination of inputs makes a spent or expired token usable", () => {
  const rows = [
    tokenRow({ used_at: minutes(-1) }),
    tokenRow({ expires_at: minutes(-1) }),
    tokenRow({ expires_at: minutes(-1), used_at: minutes(-2) }),
    tokenRow({ expires_at: null }),
    null,
  ];

  for (const row of rows) {
    assert.equal(checkTokenUsable(row, NOW).usable, false, JSON.stringify(row));
  }
});

// ── Token material ──────────────────────────────────────────────────────────

test("tokens are 256 bits of URL-safe randomness", () => {
  const token = generateToken();
  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.equal(token, encodeURIComponent(token), "must survive a query string unescaped");
  assert.equal(Buffer.from(token, "base64url").length, 32);
});

test("tokens do not repeat", () => {
  const tokens = new Set(Array.from({ length: 2000 }, generateToken));
  assert.equal(tokens.size, 2000);
});

test("hashToken is deterministic, and is a SHA-256 hex digest", () => {
  const token = generateToken();
  assert.equal(hashToken(token), hashToken(token));
  assert.match(hashToken(token), /^[0-9a-f]{64}$/);
});

test("the stored hash does not contain the raw token", () => {
  const token = generateToken();
  assert.ok(!hashToken(token).includes(token));
  assert.notEqual(hashToken(token), token);
});

test("different tokens hash differently", () => {
  assert.notEqual(hashToken("a"), hashToken("b"));
});

// ── Sessions ────────────────────────────────────────────────────────────────

test("sessions last 30 days and are multi-use, unlike auth tokens", () => {
  assert.equal(SESSION_TTL_MS, 30 * 24 * 60 * 60 * 1000);
  assert.equal(isSessionLive({ expires_at: minutes(1) }, NOW), true);
  assert.equal(isSessionLive({ expires_at: minutes(-1) }, NOW), false);
  assert.equal(isSessionLive({ expires_at: NOW }, NOW), false);
  assert.equal(isSessionLive(null, NOW), false);
  assert.equal(isSessionLive({ expires_at: "nonsense" }, NOW), false);
});
