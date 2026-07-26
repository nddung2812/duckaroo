import test from "node:test";
import assert from "node:assert/strict";

import { parseCsv, parseCsvRows } from "../scripts/_csv.mjs";
import { dedupeShopifyRecords, mapShopifyRecord, SKIP_REASONS } from "../scripts/_shopify.mjs";

/** Build CSV records the way parseCsv would, without writing a file. */
function recordsFrom(header, rows) {
  return rows.map((cells, i) => {
    const values = {};
    header.forEach((name, c) => (values[name] = cells[c] ?? ""));
    return { values, line: i + 2 };
  });
}

const HEADER = [
  "Customer ID",
  "First Name",
  "Last Name",
  "Email",
  "Default Address Phone",
  "Phone",
];

test("CSV: quoted fields with commas, newlines and escaped quotes", () => {
  const text =
    'Customer ID,First Name,Email\n' +
    "'123,\"Le, Duc\",a@example.com\n" +
    "'124,\"multi\nline\",b@example.com\n" +
    "'125,\"say \"\"hi\"\"\",c@example.com\n";

  const { header, records } = parseCsv(text);

  assert.deepEqual(header, ["Customer ID", "First Name", "Email"]);
  assert.equal(records.length, 3);
  assert.equal(records[0].values["First Name"], "Le, Duc");
  assert.equal(records[1].values["First Name"], "multi\nline");
  assert.equal(records[2].values["First Name"], 'say "hi"');
});

test("CSV: trailing newline does not produce a phantom record", () => {
  const withNewline = parseCsv("Email\na@example.com\n");
  const withoutNewline = parseCsv("Email\na@example.com");

  assert.equal(withNewline.records.length, 1);
  assert.equal(withoutNewline.records.length, 1);
});

test("CSV: strips a UTF-8 BOM from the first header cell", () => {
  const rows = parseCsvRows("﻿Email,Phone\na@example.com,123\n");
  assert.equal(rows[0][0], "Email");
});

test("maps a row, normalising email and stripping the Shopify ID apostrophe", () => {
  const [record] = recordsFrom(HEADER, [
    ["'5655024337058", "Duc Minh", "Le", "  MiinhDuc@Gmail.COM ", "", "0400 000 000"],
  ]);

  const mapped = mapShopifyRecord(record);

  assert.equal(mapped.email, "miinhduc@gmail.com");
  assert.equal(mapped.shopifyCustomerId, "5655024337058");
  assert.equal(mapped.firstName, "Duc Minh");
  assert.equal(mapped.phone, "0400 000 000");
});

test("falls back to the address phone when the account phone is blank", () => {
  const [withAccountPhone] = recordsFrom(HEADER, [
    ["'1", "A", "B", "a@example.com", "07 1111 1111", "0422 222 222"],
  ]);
  const [addressOnly] = recordsFrom(HEADER, [
    ["'2", "A", "B", "b@example.com", "07 1111 1111", "   "],
  ]);

  assert.equal(mapShopifyRecord(withAccountPhone).phone, "0422 222 222");
  assert.equal(mapShopifyRecord(addressOnly).phone, "07 1111 1111");
});

test("blank fields become null rather than empty strings", () => {
  const [record] = recordsFrom(HEADER, [["", "  ", "", "a@example.com", "", ""]]);
  const mapped = mapShopifyRecord(record);

  assert.equal(mapped.firstName, null);
  assert.equal(mapped.lastName, null);
  assert.equal(mapped.phone, null);
  assert.equal(mapped.shopifyCustomerId, null);
});

// ── The dedupe rule itself ──────────────────────────────────────────────────

test("collapses multiple address rows into one user per email", () => {
  const records = recordsFrom(HEADER, [
    ["'1", "Jane", "Doe", "jane@example.com", "", "0400 111 111"],
    ["'1", "Jane", "Doe", "jane@example.com", "07 3333 3333", ""],
    ["'2", "Bob", "Roe", "bob@example.com", "", ""],
  ]);

  const { users, mergedRowCount, skipped } = dedupeShopifyRecords(records);

  assert.equal(users.length, 2);
  assert.equal(mergedRowCount, 1);
  assert.equal(skipped.length, 0);
  assert.deepEqual(
    users.map((u) => u.email),
    ["jane@example.com", "bob@example.com"]
  );
});

test("first non-empty value wins; later rows only fill gaps", () => {
  const records = recordsFrom(HEADER, [
    // First row has no name and no phone.
    ["", "", "", "jane@example.com", "", ""],
    // Second supplies both — they should be adopted.
    ["'99", "Jane", "Doe", "jane@example.com", "", "0400 111 111"],
    // Third tries to overwrite — it must not win.
    ["'77", "Janet", "Roe", "jane@example.com", "", "0499 999 999"],
  ]);

  const { users } = dedupeShopifyRecords(records);

  assert.equal(users.length, 1);
  assert.equal(users[0].firstName, "Jane");
  assert.equal(users[0].lastName, "Doe");
  assert.equal(users[0].phone, "0400 111 111");
  assert.equal(users[0].shopifyCustomerId, "99");
  assert.deepEqual(users[0].sourceLines, [2, 3, 4]);
});

test("groups by normalised email, so case and whitespace do not split a user", () => {
  const records = recordsFrom(HEADER, [
    ["'1", "Jane", "", "Jane@Example.com", "", ""],
    ["'1", "", "Doe", "  jane@example.COM  ", "", "0400 111 111"],
  ]);

  const { users, mergedRowCount } = dedupeShopifyRecords(records);

  assert.equal(users.length, 1);
  assert.equal(mergedRowCount, 1);
  assert.equal(users[0].email, "jane@example.com");
  assert.equal(users[0].firstName, "Jane");
  assert.equal(users[0].lastName, "Doe");
});

test("skips blank and structurally invalid emails, with a reason and line number", () => {
  const records = recordsFrom(HEADER, [
    ["'1", "", "", "", "", ""],
    ["'2", "", "", "not-an-email", "", ""],
    ["'3", "", "", "two@at@example.com", "", ""],
    ["'4", "", "", "no-domain-dot@example", "", ""],
    ["'5", "", "", "good@example.com", "", ""],
  ]);

  const { users, skipped } = dedupeShopifyRecords(records);

  assert.equal(users.length, 1);
  assert.equal(skipped.length, 4);
  assert.equal(skipped[0].reason, SKIP_REASONS.BLANK_EMAIL);
  assert.equal(skipped[0].line, 2);
  assert.equal(skipped[1].reason, SKIP_REASONS.INVALID_EMAIL);
  assert.equal(skipped[1].email, "not-an-email");
  assert.deepEqual(
    skipped.map((s) => s.line),
    [2, 3, 4, 5]
  );
});

test("guest checkouts — no name, no phone, no orders — are still imported", () => {
  const records = recordsFrom(HEADER, [["'5702786318498", "", "", "guest@example.com", "", ""]]);

  const { users, skipped } = dedupeShopifyRecords(records);

  assert.equal(skipped.length, 0);
  assert.equal(users.length, 1);
  assert.equal(users[0].email, "guest@example.com");
  assert.equal(users[0].firstName, null);
});

test("dedupe is deterministic and order-preserving across runs", () => {
  const build = () =>
    recordsFrom(HEADER, [
      ["'1", "A", "", "a@example.com", "", ""],
      ["'2", "B", "", "b@example.com", "", ""],
      ["'1", "", "Alpha", "a@example.com", "", ""],
    ]);

  const first = dedupeShopifyRecords(build());
  const second = dedupeShopifyRecords(build());

  assert.deepEqual(first.users, second.users);
  assert.deepEqual(
    first.users.map((u) => u.email),
    ["a@example.com", "b@example.com"]
  );
});
