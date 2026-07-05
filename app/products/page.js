"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ProductGrid from "./components/ProductGrid";
import CategoryFilter from "./components/CategoryFilter";
import Cart from "./components/Cart";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { categories } from "./data/products";
import Footer from "@/app/components/Footer";
import PageAmbience from "../components/PageAmbience";
import { useCart } from "@/app/context/CartContext";

const getImageSrc = (img) => (typeof img === "string" ? img : img?.url ?? "");

// JSON-LD structured data component for the products listing page
function ProductsListingStructuredData({ products, selectedCategory, totalCount }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://aquaticswandesign.com.au";

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Duckaroo - Swan Design Aquatic Center",
    url: baseUrl,
    description:
      "Brisbane's premier aquatic plant and aquarium supply specialist",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brisbane",
      addressRegion: "QLD",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: "AU",
    },
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${baseUrl}/products`,
      },
    ],
  };

  // Collection page structured data
  const collectionPageData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      selectedCategory === "all"
        ? "Premium Aquatic Plants & Aquarium Supplies"
        : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
        } - Aquatic Plants & Supplies`,
    description:
      selectedCategory === "all"
        ? "Discover Australia's premier collection of rare Bucephalandra, Anubias, and other exotic aquatic plants. Shipped nationwide from our Brisbane facility."
        : `Premium ${selectedCategory} for aquascaping enthusiasts. Australia-wide shipping with live arrival guarantee.`,
    url:
      selectedCategory === "all"
        ? `${baseUrl}/products`
        : `${baseUrl}/products?category=${selectedCategory}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.name,
        url: `${baseUrl}/products/${product.slug}`,
        image: getImageSrc(product.images?.[0]),
        description: product.description.substring(0, 160) + "...",
        offers: {
          "@type": "Offer",
          price: product.price.toString(),
          priceCurrency: "AUD",
          priceValidUntil: "2026-12-31",
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${baseUrl}/products/${product.slug}`,
          seller: {
            "@type": "Organization",
            name: "Duckaroo - Swan Design Aquatic Center",
          },
        },
        aggregateRating: product.reviews
          ? {
            "@type": "AggregateRating",
            ratingValue: product.reviews.rating,
            reviewCount: product.reviews.count,
            bestRating: "5",
            worstRating: "1",
          }
          : undefined,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageData) }}
      />
    </>
  );
}

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  const loadMoreRef = useRef(null);

  // Use global cart context (only need addToCart for ProductGrid)
  const { addToCart } = useCart();

  // Debounce search input 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async (pageNum, cat, search, sort, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        category: cat,
        search,
        sort,
      });
      const data = await fetch(`/api/stock?${params}`).then((r) => r.json());
      setProducts((prev) => {
        if (append) {
          const existingIds = new Set(prev.map((p) => p.id));
          return [...prev, ...(data.items ?? []).filter((p) => !existingIds.has(p.id))];
        }
        return data.items ?? [];
      });
      setTotalCount(data.total ?? 0);
      setHasMore(pageNum < (data.totalPages ?? 1));
      if (data.categoryCounts) setCategoryCounts(data.categoryCounts);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, []);

  // Re-fetch when filters change — reset to page 1
  useEffect(() => {
    setPage(1);
    fetchProducts(1, selectedCategory, debouncedSearch, sortBy);
  }, [selectedCategory, debouncedSearch, sortBy, fetchProducts]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loadingMore) {
        setPage((prev) => {
          const nextPage = prev + 1;
          fetchProducts(nextPage, selectedCategory, debouncedSearch, sortBy, true);
          return nextPage;
        });
      }
    },
    [hasMore, loadingMore, selectedCategory, debouncedSearch, sortBy, fetchProducts]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [handleObserver]);

  const totalAllCount = Object.values(categoryCounts).reduce((sum, c) => sum + c, 0);
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? totalAllCount : (categoryCounts[cat.id] ?? 0),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <PageAmbience />
      <ProductsListingStructuredData
        products={products}
        selectedCategory={selectedCategory}
        totalCount={totalCount}
      />
      <div className="flex-grow relative z-10 pt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-2 rounded-full border border-cream/30 bg-transparent text-cream/90 hover:border-cream/60 hover:bg-cream/5 hover:text-cream"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
          </div>

          {/* SEO-Optimized Header Section */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-5xl font-medium text-parchment mb-4 [text-wrap:balance]">
              Rare Aquatic Plants & Aquarium Supplies
            </h1>
            <h2 className="text-xl md:text-2xl text-amber-glow font-medium mb-6">
              Australia Wide Shipping • Live Arrival Guarantee • 100% Customer
              Satisfaction
            </h2>
            <p className="text-lg text-cream/70 max-w-4xl mx-auto mb-8 leading-relaxed">
              Discover Australia&apos;s premier collection of{" "}
              <strong>rare Bucephalandra</strong>, <strong>Anubias</strong>, and
              other exotic aquatic plants. Shipped nationwide from our Brisbane
              facility with guaranteed live arrival and complete customer
              satisfaction. Perfect for aquascaping enthusiasts and planted
              aquarium hobbyists seeking premium quality plants and equipment.
            </p>

            {/* Key Features */}

            {/* Popular Categories */}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="lg:w-1/4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={categoriesWithCounts}
              />
            </div>
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-cream/60">
                  {totalCount} product{totalCount !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-sm text-cream/70 whitespace-nowrap">Sort by:</label>
                  <select
                    id="sort-by"
                    aria-label="Sort products by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm text-cream border border-cream/20 rounded-full px-3 py-1.5 bg-abyss/40 focus:outline-none focus:border-amber-glow focus:ring-2 focus:ring-amber-glow/40 cursor-pointer"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="reviews-desc">Most Reviewed</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-glow"></div>
                </div>
              ) : (
                <ProductGrid
                  products={products}
                  onAddToCart={addToCart}
                />
              )}

              {/* Infinite Scroll Sentinel */}
              <div ref={loadMoreRef} className="py-4" />
              {loadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-glow"></div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-cream/5 border border-cream/15 backdrop-blur-sm p-8 rounded-2xl mb-8">
            <h3 className="font-display text-2xl font-medium text-parchment mb-4">
              Featured Plant Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  🌿 Bucephalandra Species
                </h4>
                <p className="text-sm text-cream/70">
                  Rare and exotic Bucephalandra varieties including Kegadang and
                  other sought-after species
                </p>
              </div>
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  🍃 Anubias Collection
                </h4>
                <p className="text-sm text-cream/70">
                  Hardy Anubias plants perfect for low-light aquariums and
                  beginner aquascapers
                </p>
              </div>
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  🌱 Aquascaping Plants
                </h4>
                <p className="text-sm text-cream/70">
                  Complete range of foreground, midground, and background
                  aquatic plants
                </p>
              </div>
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  🔧 Equipment & Supplies
                </h4>
                <p className="text-sm text-cream/70">
                  Professional aquascaping tools, CO2 systems, and aquarium
                  maintenance equipment
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
            <div className="bg-cream/5 p-6 rounded-2xl border border-cream/15 backdrop-blur-sm hover:border-amber-glow/50 transition-colors">
              <h3 className="font-display text-lg font-medium text-amber-glow mb-2">
                🚚 Australia Wide Shipping
              </h3>
              <p className="text-cream/70">
                Fast, secure delivery to all Australian states and territories
              </p>
            </div>
            <div className="bg-cream/5 p-6 rounded-2xl border border-cream/15 backdrop-blur-sm hover:border-amber-glow/50 transition-colors">
              <h3 className="font-display text-lg font-medium text-amber-glow mb-2">
                🌱 Live Arrival Guarantee
              </h3>
              <p className="text-cream/70">
                All plants guaranteed to arrive alive and healthy or full
                replacement
              </p>
            </div>
            <div className="bg-cream/5 p-6 rounded-2xl border border-cream/15 backdrop-blur-sm hover:border-amber-glow/50 transition-colors">
              <h3 className="font-display text-lg font-medium text-amber-glow mb-2">
                ⭐ 100% Satisfaction
              </h3>
              <p className="text-cream/70">
                Complete satisfaction guarantee on every order
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-cream/5 backdrop-blur-sm p-8 rounded-2xl border border-cream/15 mb-8">
            <h2 className="font-display text-3xl font-medium text-parchment text-center mb-8">
              Why Choose Duckaroo for Your Aquatic Plants?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium text-amber-glow mb-4">
                  🌿 Rare Plant Specialists
                </h3>
                <p className="text-cream/70 mb-4">
                  We specialize in sourcing and growing the rarest Bucephalandra
                  species, premium Anubias varieties, and hard-to-find
                  aquascaping plants. Our Brisbane facility ensures optimal
                  growing conditions for healthy, vibrant plants.
                </p>
                <ul className="text-cream/60 space-y-2">
                  <li>• Bucephalandra Kegadang and rare species</li>
                  <li>• Premium Anubias Nana and variants</li>
                  <li>• Exotic foreground and carpet plants</li>
                  <li>• Sustainably sourced specimens</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium text-amber-glow mb-4">
                  📦 Guaranteed Safe Delivery
                </h3>
                <p className="text-cream/70 mb-4">
                  Our Australia-wide shipping system ensures your plants arrive
                  in perfect condition. We use specialized packaging techniques
                  developed over years of experience shipping live aquatic
                  plants across the continent.
                </p>
                <ul className="text-cream/60 space-y-2">
                  <li>• Live arrival guarantee on all plants</li>
                  <li>• Insulated packaging for temperature control</li>
                  <li>• Fast 2-7 day delivery Australia wide</li>
                  <li>• Full replacement for DOA plants</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Care Information */}
          <div className="bg-moss/40 backdrop-blur-sm p-8 rounded-2xl border border-cream/15 mb-8">
            <h2 className="font-display text-2xl font-medium text-parchment text-center mb-6">
              Expert Plant Care & Aquascaping Support
            </h2>
            <p className="text-cream/75 text-center mb-6 max-w-3xl mx-auto">
              Every plant comes with detailed care instructions. Our
              Brisbane-based team provides ongoing support to help you create
              stunning aquascapes with your Bucephalandra, Anubias, and other
              aquatic plants.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  🔬 Plant Specifications
                </h4>
                <p className="text-cream/70 text-sm">
                  Detailed lighting, CO2, and water parameter requirements for
                  each species
                </p>
              </div>
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  🎨 Aquascaping Tips
                </h4>
                <p className="text-cream/70 text-sm">
                  Professional guidance on placement and design techniques
                </p>
              </div>
              <div>
                <h4 className="font-medium text-amber-glow mb-2">
                  📞 Ongoing Support
                </h4>
                <p className="text-cream/70 text-sm">
                  Brisbane team available for care questions and troubleshooting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Fixed Floating Cart Widget */}
      <Cart />
    </div>
  );
}
