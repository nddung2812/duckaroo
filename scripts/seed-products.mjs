/**
 * Seed script: creates the products table and seeds all 124 products.
 * Each product's images are uploaded to Cloudinary under products/[slug]/
 *
 * Run: node scripts/seed-products.mjs
 */

import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { v2 as cloudinary } from "cloudinary";

// ── Load .env.local manually ────────────────────────────────────────────────
const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("=")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (key && val && !process.env[key]) process.env[key] = val;
}

// ── Validate env vars ────────────────────────────────────────────────────────
const { DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");
if (!CLOUDINARY_CLOUD_NAME) throw new Error("CLOUDINARY_CLOUD_NAME not set");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const sql = neon(DATABASE_URL);

// ── Import products data ─────────────────────────────────────────────────────
const { productsData } = await import("../app/products/data/products.js");

// ── Create table ─────────────────────────────────────────────────────────────
console.log("Creating products table…");
await sql`
  CREATE TABLE IF NOT EXISTS products (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    slug           VARCHAR(255) NOT NULL UNIQUE,
    category       VARCHAR(50)  NOT NULL,
    price          NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock          INTEGER NOT NULL DEFAULT 0,
    images         JSONB NOT NULL DEFAULT '[]',
    description    TEXT,
    features       JSONB NOT NULL DEFAULT '[]',
    specifications JSONB NOT NULL DEFAULT '{}',
    reviews        JSONB NOT NULL DEFAULT '{}',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE OR REPLACE FUNCTION update_products_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
  $$ LANGUAGE plpgsql
`;

// Drop and recreate trigger so the function change takes effect
await sql`DROP TRIGGER IF EXISTS set_products_updated_at ON products`;
await sql`
  CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_products_updated_at()
`;

await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)`;
await sql`CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug)`;

console.log("Table ready.\n");

// ── Upload images and seed products ─────────────────────────────────────────
let seeded = 0;
let skipped = 0;
let errors = [];

for (const product of productsData) {
  // Check if already seeded
  const existing = await sql`SELECT id FROM products WHERE slug = ${product.slug}`;
  if (existing.length > 0) {
    console.log(`  skip  [${String(product.id).padStart(3)}] ${product.slug} (already exists)`);
    skipped++;
    continue;
  }

  // Upload images to Cloudinary
  const cloudinaryImages = [];
  for (let i = 0; i < product.images.length; i++) {
    const imageUrl = product.images[i];
    const publicId = `products/${product.slug}/${i === 0 ? "main" : `image-${i}`}`;
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: `products/${product.slug}`,
        public_id: i === 0 ? "main" : `image-${i}`,
        overwrite: false,
        resource_type: "image",
      });
      cloudinaryImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      // If already uploaded (overwrite: false throws), try to get the existing URL
      const fallbackUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
      cloudinaryImages.push({ url: fallbackUrl, public_id: publicId });
      console.warn(`    warn  image ${i} for ${product.slug}: ${err.message}`);
    }
  }

  // Insert into DB
  try {
    await sql`
      INSERT INTO products
        (name, slug, category, price, stock, images, description, features, specifications, reviews)
      VALUES (
        ${product.name},
        ${product.slug},
        ${product.category},
        ${product.price},
        ${product.stock},
        ${JSON.stringify(cloudinaryImages)},
        ${product.description ?? null},
        ${JSON.stringify(product.features ?? [])},
        ${JSON.stringify(product.specifications ?? {})},
        ${JSON.stringify(product.reviews ?? {})}
      )
    `;
    seeded++;
    console.log(`  done  [${String(product.id).padStart(3)}] ${product.slug} (${cloudinaryImages.length} images)`);
  } catch (err) {
    errors.push({ slug: product.slug, error: err.message });
    console.error(`  error [${String(product.id).padStart(3)}] ${product.slug}: ${err.message}`);
  }
}

console.log(`\n✓ Done — ${seeded} seeded, ${skipped} skipped, ${errors.length} errors`);
if (errors.length > 0) {
  console.error("\nErrors:");
  errors.forEach((e) => console.error(`  ${e.slug}: ${e.error}`));
}
