import sql from "@/lib/neon";

export async function getAllDiseases() {
  return await sql`
    SELECT id, slug, disease_name, common_names, disease_type,
           tank_type, image_url, image_credit, blog_paragraph,
           notifiable_in_australia, zoonotic
    FROM aquarium_diseases ORDER BY id
  `;
}

export async function getDiseaseBySlug(slug) {
  const rows = await sql`SELECT * FROM aquarium_diseases WHERE slug = ${slug}`;
  return rows[0] ?? null;
}

export async function getAllDiseaseSlugs() {
  return await sql`SELECT slug FROM aquarium_diseases ORDER BY id`;
}
