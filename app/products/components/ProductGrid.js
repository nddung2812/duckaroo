import { useState, useEffect } from "react";

const getImageSrc = (img) => (typeof img === "string" ? img : img?.url ?? "");
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Star, ExternalLink, AlertTriangle } from "lucide-react";
import ProductModal from "./ProductModal";
import { useCart } from "@/app/context/CartContext";
import { getBuyerAwareWarning } from "@/lib/buyerAware";
import { toast } from "react-toastify";

export default function ProductGrid({ products, onAddToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use global cart context
  const {
    isClient,
    getCartItemQuantity,
    addToCart: addToCartContext,
  } = useCart();

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle add to cart with stock validation
  const handleAddToCart = (product) => {
    const currentCartQuantity = getCartItemQuantity(product.id);
    const totalQuantityAfterAdd = currentCartQuantity + 1;

    // Validate if total quantity exceeds stock
    if (totalQuantityAfterAdd > product.stock) {
      if (currentCartQuantity >= product.stock) {
        toast.warning(
          `This item is already at maximum stock in your cart (${product.stock} available)`
        );
        return;
      } else {
        const availableToAdd = product.stock - currentCartQuantity;
        toast.warning(
          `Only ${availableToAdd} more can be added to cart. Maximum stock: ${product.stock}`
        );
        return;
      }
    }

    // Use global cart context to add to cart
    addToCartContext(product, 1);
  };

  // Check if product can be added to cart
  const canAddToCart = (product) => {
    if (product.stock === 0) return false;
    if (!isClient) return true; // Allow on server-side
    const currentCartQuantity = getCartItemQuantity(product.id);
    return currentCartQuantity < product.stock;
  };

  // Get button text based on stock status
  const getAddToCartButtonText = (product) => {
    if (product.stock === 0) return "Out of Stock";
    if (!isClient) return "Add to Cart"; // Default text on server-side
    const currentCartQuantity = getCartItemQuantity(product.id);
    if (currentCartQuantity >= product.stock) return "Max in Cart";
    return "Add to Cart";
  };

  const formatPrice = (price) => {
    return (
      new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(price) + " AUD"
    );
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case "plants":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow hover:bg-moss/80";
      case "livestock":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow hover:bg-moss/80";
      case "probiotics":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow hover:bg-moss/80";
      case "accessories":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow hover:bg-moss/80";
      case "equipment":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow hover:bg-moss/80";
      default:
        return "bg-moss/60 border border-cream/20 text-cream/75 hover:bg-moss/80";
    }
  };

  // Helper to strip HTML tags for card description
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-cream/70 text-lg">
          No products found matching your criteria
        </div>
        <p className="text-cream/50 mt-2">
          Try adjusting your search or filter options
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group flex h-full flex-col rounded-2xl bg-cream/5 border-cream/15 backdrop-blur-sm hover:border-amber-glow/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-2xl">
                <Link href={`/products/${product.slug}`}>
                  <Image
                    src={
                      getImageSrc(product.images?.[0]) ||
                      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=center"
                    }
                    alt={product.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover md:group-hover:scale-105 md:transition-transform md:duration-300 cursor-pointer"
                    loading="lazy"
                    quality={80}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <Badge
                  className={`absolute top-2 right-2 ${getCategoryBadgeColor(
                    product.category
                  )}`}
                >
                  {product.category}
                </Badge>
                {product.stock < 10 && (
                  <Badge className="absolute top-2 left-2 bg-red-950/30 border border-red-800/40 text-red-300">
                    Low Stock
                  </Badge>
                )}
                {getBuyerAwareWarning(product) && (
                  <Badge
                    className="absolute bottom-2 left-2 bg-amber-950/40 text-amber-glow border border-amber-glow/40 flex items-center gap-1"
                    title={getBuyerAwareWarning(product).shortMessage}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Buyer Aware
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-4">
              <Link href={`/products/${product.slug}`}>
                <CardTitle className="font-display text-lg font-medium text-parchment mb-2 line-clamp-2 hover:text-amber-glow transition-colors cursor-pointer">
                  {product.name}
                </CardTitle>
              </Link>
              <p className="text-cream/70 text-sm mb-3 line-clamp-2">
                {stripHtml(product.description)}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-amber-glow">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="mt-auto text-sm text-cream/60">
                {(() => {
                  const currentCartQuantity = isClient
                    ? getCartItemQuantity(product.id)
                    : 0;
                  const availableStock = product.stock - currentCartQuantity;
                  const isAtMaxStock =
                    isClient && currentCartQuantity >= product.stock;

                  return (
                    <div className="flex justify-between items-center">
                      <div className="text-amber-glow">
                        In Cart: {currentCartQuantity}
                      </div>
                      <div className="text-right">
                        <span
                          className={
                            availableStock > 0
                              ? "text-green-300"
                              : "text-red-300"
                          }
                        >
                          Available: {availableStock}
                        </span>
                        {isAtMaxStock && (
                          <span className="text-red-300 ml-1 block">
                            {product.stock === 0 ? "Out of Stock" : "(Max reached)"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>

            <CardFooter className="mt-auto flex flex-col p-4 pt-0">
              {/* Quick View and Add to Cart buttons */}
              <div className="flex gap-2 w-full mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full border border-cream/30 bg-transparent text-cream/90 hover:border-cream/60 hover:bg-cream/5 hover:text-cream"
                  onClick={() => handleQuickView(product)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Quick View
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-full bg-amber-glow text-[#04121b] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                  onClick={() => handleAddToCart(product)}
                  disabled={!canAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {getAddToCartButtonText(product)}
                </Button>
              </div>

              <div className="w-full">
                <Link href={`/products/${product.slug}`}>
                  <Button
                    size="sm"
                    className="w-full rounded-full border border-cream/30 bg-transparent text-cream/90 shadow-none hover:border-cream/60 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={onAddToCart}
      />
    </>
  );
}
