import { getFeaturedStockItems } from "@/lib/stock";
import HomeClient from "./HomeClient";

// Statically generated, refreshed hourly (and on product changes via revalidatePath).
export const revalidate = 3600;

export default async function Home() {
  let featuredProducts = [];
  try {
    featuredProducts = await getFeaturedStockItems(3);
  } catch (error) {
    console.error("Failed to load featured products:", error);
  }

  return <HomeClient featuredProducts={featuredProducts} />;
}
