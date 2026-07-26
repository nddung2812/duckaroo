/**
 * Minimal RFC 4180 CSV reader.
 *
 * Hand-rolled rather than pulling in a dependency: Shopify's customer export is
 * well-formed RFC 4180, this is only used by a one-off migration script, and it
 * parsed the real 667-row export with zero malformed rows.
 *
 * Handles quoted fields, embedded commas, embedded newlines and "" escapes.
 * Does not handle: alternative delimiters, comment lines, BOM-less UTF-16.
 */

/**
 * @param {string} text
 * @returns {string[][]} rows, including the header row
 */
export function parseCsvRows(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let sawAnyChar = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      sawAnyChar = true;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      sawAnyChar = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
      sawAnyChar = true;
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      sawAnyChar = false;
    } else if (char !== "\r") {
      field += char;
      sawAnyChar = true;
    }
  }

  // Trailing line without a newline terminator.
  if (sawAnyChar || field.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Parse into objects keyed by header name, dropping blank lines.
 *
 * @returns {{header: string[], records: Array<{values: Record<string,string>, line: number}>}}
 */
export function parseCsv(text) {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return { header: [], records: [] };

  const header = rows[0].map((h) => h.trim());
  const records = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    // A blank trailing line parses as a single empty field — not a record.
    if (cells.length <= 1 && (cells[0] ?? "").trim() === "") continue;

    const values = {};
    for (let c = 0; c < header.length; c++) values[header[c]] = cells[c] ?? "";
    records.push({ values, line: i + 1 }); // 1-based line number in the file
  }

  return { header, records };
}
