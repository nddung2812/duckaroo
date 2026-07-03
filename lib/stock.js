import { cache } from "react";
import sql from "./neon";

function parseRow(row) {
  if (!row) return row;
  return {
    ...row,
    images: typeof row.images === "string" ? JSON.parse(row.images) : (row.images ?? []),
    features: typeof row.features === "string" ? JSON.parse(row.features) : (row.features ?? []),
    specifications: typeof row.specifications === "string" ? JSON.parse(row.specifications) : (row.specifications ?? {}),
    reviews: typeof row.reviews === "string" ? JSON.parse(row.reviews) : (row.reviews ?? {}),
  };
}

export async function getAllStockItems() {
  const rows = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
  `;
  return rows.map(parseRow);
}

export async function getFeaturedStockItems(limit = 3) {
  const rows = await sql`
    SELECT id, name, slug, price, images, description FROM products
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map(parseRow);
}

export async function getRelatedStockItems(category, excludeId, limit = 3) {
  const rows = await sql`
    SELECT id, name, slug, price, images, description, category, stock FROM products
    WHERE category = ${category} AND id != ${excludeId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map(parseRow);
}

export async function getStockItemsPaginated({ page, limit, category, search, sort }) {
  const offset = (page - 1) * limit;
  const searchPattern = `%${search}%`;

  const rows = await sql`
    SELECT * FROM products
    WHERE (${category} = 'all' OR category = ${category})
      AND (${search} = '' OR name ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
    ORDER BY
      CASE WHEN ${sort} = 'price-asc'    THEN price END ASC  NULLS LAST,
      CASE WHEN ${sort} = 'price-desc'   THEN price END DESC NULLS LAST,
      CASE WHEN ${sort} = 'rating-desc'  THEN (reviews->>'rating')::float END DESC NULLS LAST,
      CASE WHEN ${sort} = 'reviews-desc' THEN (reviews->>'count')::int   END DESC NULLS LAST,
      created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows.map(parseRow);
}

export async function getStockItemsCount({ category, search }) {
  const searchPattern = `%${search}%`;

  const rows = await sql`
    SELECT COUNT(*) as total FROM products
    WHERE (${category} = 'all' OR category = ${category})
      AND (${search} = '' OR name ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
  `;
  return Number(rows[0].total);
}

export async function getStockCategoryCounts() {
  const rows = await sql`
    SELECT category, COUNT(*) as count FROM products GROUP BY category
  `;
  return rows;
}

export async function getStockItemById(id) {
  const rows = await sql`
    SELECT * FROM products WHERE id = ${id}
  `;
  return parseRow(rows[0] ?? null);
}

export const getStockItemBySlug = cache(async function getStockItemBySlug(slug) {
  const rows = await sql`
    SELECT * FROM products WHERE slug = ${slug}
  `;
  return parseRow(rows[0] ?? null);
});

export async function createStockItem({
  name,
  slug,
  category,
  price,
  stock,
  images,
  description,
  features,
  specifications,
  reviews,
}) {
  const rows = await sql`
    INSERT INTO products
      (name, slug, category, price, stock, images, description, features, specifications, reviews)
    VALUES (
      ${name},
      ${slug},
      ${category},
      ${price},
      ${stock},
      ${JSON.stringify(images ?? [])},
      ${description ?? null},
      ${JSON.stringify(features ?? [])},
      ${JSON.stringify(specifications ?? {})},
      ${JSON.stringify(reviews ?? {})}
    )
    RETURNING *
  `;
  return parseRow(rows[0]);
}

export async function updateStockItem(
  id,
  { name, slug, category, price, stock, images, description, features, specifications, reviews }
) {
  const rows = await sql`
    UPDATE products SET
      name           = ${name},
      slug           = ${slug},
      category       = ${category},
      price          = ${price},
      stock          = ${stock},
      images         = ${JSON.stringify(images ?? [])},
      description    = ${description ?? null},
      features       = ${JSON.stringify(features ?? [])},
      specifications = ${JSON.stringify(specifications ?? {})},
      reviews        = ${JSON.stringify(reviews ?? {})}
    WHERE id = ${id}
    RETURNING *
  `;
  return parseRow(rows[0] ?? null);
}

export async function deleteStockItem(id) {
  await sql`DELETE FROM products WHERE id = ${id}`;
}
