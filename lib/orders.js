import sql from "./neon";

function parseRow(row) {
  return {
    ...row,
    shipping_address: typeof row.shipping_address === "string" ? JSON.parse(row.shipping_address) : row.shipping_address,
    billing_address: typeof row.billing_address === "string" ? JSON.parse(row.billing_address) : row.billing_address,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
  };
}

export async function getAllOrders() {
  const rows = await sql`
    SELECT * FROM orders
    ORDER BY created_at DESC
  `;
  return rows.map(parseRow);
}

export async function createOrder({
  order_number,
  stripe_payment_id,
  customer_name,
  customer_email,
  customer_phone,
  shipping_address,
  billing_address,
  items,
  subtotal,
  shipping,
  total,
  currency,
}) {
  const rows = await sql`
    INSERT INTO orders (
      order_number, stripe_payment_id,
      customer_name, customer_email, customer_phone,
      shipping_address, billing_address, items,
      subtotal, shipping, total, currency
    )
    VALUES (
      ${order_number},
      ${stripe_payment_id},
      ${customer_name},
      ${customer_email},
      ${customer_phone || null},
      ${JSON.stringify(shipping_address)},
      ${JSON.stringify(billing_address || null)},
      ${JSON.stringify(items)},
      ${subtotal},
      ${shipping},
      ${total},
      ${currency || "AUD"}
    )
    ON CONFLICT (stripe_payment_id) DO NOTHING
    RETURNING *
  `;
  return rows[0] ? parseRow(rows[0]) : null;
}

export async function updateOrderStatus(id, status) {
  const rows = await sql`
    UPDATE orders SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? parseRow(rows[0]) : null;
}

export async function deleteOrder(id) {
  await sql`DELETE FROM orders WHERE id = ${id}`;
}
