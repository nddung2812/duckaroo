import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllStockItems, createStockItem, getStockItemsPaginated, getStockItemsCount, getStockCategoryCounts } from "@/lib/stock";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Legacy: no page param → return all items (used by product [slug] page etc.)
    if (!searchParams.has('page')) {
      const items = await getAllStockItems();
      return NextResponse.json({ items });
    }

    const page     = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit    = Math.min(48, parseInt(searchParams.get('limit') ?? '12'));
    const category = searchParams.get('category') ?? 'all';
    const search   = searchParams.get('search')   ?? '';
    const sort     = searchParams.get('sort')     ?? 'price-asc';

    const [items, total, countRows] = await Promise.all([
      getStockItemsPaginated({ page, limit, category, search, sort }),
      getStockItemsCount({ category, search }),
      getStockCategoryCounts(),
    ]);

    const categoryCounts = Object.fromEntries(countRows.map(r => [r.category, Number(r.count)]));
    return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), categoryCounts });
  } catch (error) {
    console.error("GET /api/stock error:", error);
    return NextResponse.json({ error: "Failed to fetch stock items" }, { status: 500 });
  }
}

export async function POST(request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const body = await request.json();
    const { name, slug, category, price, stock, images, description, features, specifications, reviews } = body;

    if (!name || !slug || !category || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await createStockItem({
      name,
      slug,
      category,
      price: Number(price),
      stock: Number(stock),
      images: images ?? [],
      description,
      features: features ?? [],
      specifications: specifications ?? {},
      reviews: reviews ?? {},
    });

    revalidatePath(`/products/${item.slug}`);
    revalidatePath("/products");
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stock error:", error);
    // Slug uniqueness violation
    if (error.message?.includes("unique")) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
