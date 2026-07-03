import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStockItemById, updateStockItem, deleteStockItem } from "@/lib/stock";
import { requireAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const item = await getStockItemById(Number(id));
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    console.error("GET /api/stock/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, category, price, stock, images, description, features, specifications, reviews } = body;

    if (!name || !slug || !category || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await updateStockItem(Number(id), {
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

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath(`/products/${item.slug}`);
    revalidatePath("/products");
    return NextResponse.json({ item });
  } catch (error) {
    console.error("PUT /api/stock/[id] error:", error);
    if (error.message?.includes("unique")) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  try {
    const { id } = await params;
    await deleteStockItem(Number(id));
    revalidatePath("/products");
    return NextResponse.json({ success: true, id: Number(id) });
  } catch (error) {
    console.error("DELETE /api/stock/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
