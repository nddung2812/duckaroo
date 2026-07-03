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
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "livestock":
        return "bg-teal-100 text-teal-800 hover:bg-teal-200";
      case "probiotics":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "accessories":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "equipment":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
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
        <div className="text-gray-500 text-lg">
          No products found matching your criteria
        </div>
        <p className="text-gray-400 mt-2">
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
            className="group flex h-full flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
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
                  <Badge className="absolute top-2 left-2 bg-red-100 text-red-800">
                    Low Stock
                  </Badge>
                )}
                {getBuyerAwareWarning(product) && (
                  <Badge
                    className="absolute bottom-2 left-2 bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1"
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
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                  {product.name}
                </CardTitle>
              </Link>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {stripHtml(product.description)}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="mt-auto text-sm text-gray-500">
                {(() => {
                  const currentCartQuantity = isClient
                    ? getCartItemQuantity(product.id)
                    : 0;
                  const availableStock = product.stock - currentCartQuantity;
                  const isAtMaxStock =
                    isClient && currentCartQuantity >= product.stock;

                  return (
                    <div className="flex justify-between items-center">
                      <div className="text-blue-600">
                        In Cart: {currentCartQuantity}
                      </div>
                      <div className="text-right">
                        <span
                          className={
                            availableStock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          Available: {availableStock}
                        </span>
                        {isAtMaxStock && (
                          <span className="text-red-600 ml-1 block">
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
                  className="flex-1 bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => handleQuickView(product)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Quick View
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
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
                    className="w-full bg-green-600 text-white hover:bg-green-700 border-none"
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
