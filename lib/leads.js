import sql from "./neon";

export async function getAllLeads() {
  const rows = await sql`
    SELECT * FROM leads
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function createLead({ name, email, phone, location, service, message, source }) {
  const rows = await sql`
    INSERT INTO leads (name, email, phone, location, service, message, source)
    VALUES (
      ${name},
      ${email},
      ${phone},
      ${location},
      ${service},
      ${message || null},
      ${source}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function updateLeadStatus(id, status) {
  const rows = await sql`
    UPDATE leads SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function deleteLead(id) {
  await sql`DELETE FROM leads WHERE id = ${id}`;
}
