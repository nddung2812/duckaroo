import { getAllStockItems } from "@/lib/stock";

export async function generateStaticParams() {
  const products = await getAllStockItems();
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductLayout({ children }) {
  return children;
}
