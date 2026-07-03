"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Star,
  Check,
  ArrowLeft,
  Share2,
  Heart,
  ChevronRight,
  Eye,
  Plus,
  Minus,
  AlertTriangle,
} from "lucide-react";
import Cart from "../components/Cart";
import { toggleFavorite, isFavorite } from "@/app/utils/favorites";
import { useCart } from "@/app/context/CartContext";
import { getBuyerAwareWarning } from "@/lib/buyerAware";
import { toast } from "react-toastify";

function Breadcrumb({ product }) {
  const categoryName =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-y-1 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-blue-600"
          >
            {categoryName}
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li aria-current="page" className="text-gray-900 font-medium">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}

const getImageSrc = (img) => (typeof img === "string" ? img : img?.url ?? "");

export default function ProductPageContent({ product, relatedProducts = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const router = useRouter();

  // Use global cart context
  const {
    cartItems: globalCartItems,
    isClient,
    addToCart: addToCartContext,
    removeFromCart: removeFromCartContext,
    updateCartQuantity: updateCartQuantityContext,
    getCartItemQuantity,
    getTotalItems: getTotalItemsContext,
    getTotalPrice: getTotalPriceContext,
  } = useCart();

  // Check if product is favorited on mount
  useEffect(() => {
    if (product) {
      setIsFav(isFavorite(product.id));
    }
  }, [product]);

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
        return "bg-green-100 text-green-800";
      case "probiotics":
        return "bg-blue-100 text-blue-800";
      case "accessories":
        return "bg-purple-100 text-purple-800";
      case "equipment":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get current cart quantity for this product (will update when cart changes)
  const currentCartQuantity = isClient ? getCartItemQuantity(product.id) : 0;
  const maxSelectableQuantity = product
    ? product.stock - currentCartQuantity
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleFavorite = () => {
    if (!product) return;
    const isNowFavorite = toggleFavorite(product);
    setIsFav(isNowFavorite);

    if (isNowFavorite) {
      toast.success("Added to favorites! ❤️");
    } else {
      toast.info("Removed from favorites");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          {/* Breadcrumb */}
          <Breadcrumb product={product} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                <Image
                  src={getImageSrc(product.images[selectedImageIndex])}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  width={600}
                  height={520}
                  className="w-full h-[520px] object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&crop=center`;
                  }}
                />
                <Badge
                  className={`absolute top-4 left-4 ${getCategoryBadgeColor(
                    product.category
                  )}`}
                >
                  {product.category}
                </Badge>
                {product.stock < 10 && (
                  <Badge className="absolute top-4 right-4 bg-red-100 text-red-800">
                    Low Stock
                  </Badge>
                )}
                {getBuyerAwareWarning(product) && (
                  <Badge className="absolute bottom-4 left-4 bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Buyer Aware
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-md border-2 transition-all duration-200 ${selectedImageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      width={200}
                      height={80}
                      className="w-full h-20 object-cover"
                      loading="lazy"
                      sizes="200px"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=150&fit=crop&crop=center`;
                      }}
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i <
                          Math.floor(parseFloat(product.reviews?.rating || "5"))
                          ? "fill-current text-yellow-500"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({product.reviews?.rating || "5.0"}) ·{" "}
                      {product.reviews?.count || "1"} reviews
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFavorite}
                      className={`${isFav
                        ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Buyer Aware notice */}
              {(() => {
                const warning = getBuyerAwareWarning(product);
                if (!warning) return null;
                return (
                  <div
                    role="alert"
                    className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900 mb-1">
                        {warning.title}
                      </p>
                      <p className="text-amber-900 leading-relaxed">
                        {warning.fullMessage}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Price */}
              <div className="text-4xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                ></div>
                <span
                  className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Product Description
                </h2>
                <div
                  className="text-gray-600 leading-relaxed text-lg product-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Key Features
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Information and Cart Controls */}
              <div className="space-y-4">
                {/* Stock Information */}
                <div className="text-sm text-gray-500">
                  <div className="flex justify-between items-center">
                    <div className="text-blue-600">
                      In Cart: {isClient ? currentCartQuantity : 0}
                    </div>
                    <div className="text-right">
                      <span
                        className={
                          product.stock - currentCartQuantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        Available: {product.stock - currentCartQuantity}
                      </span>
                      {isClient && currentCartQuantity >= product.stock && (
                        <span className="text-red-600 ml-1 block">
                          {product.stock === 0 ? "Out of Stock" : "(Max reached)"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">
                      Select Quantity:
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-blue-300 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-blue-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(maxSelectableQuantity, quantity + 1)
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-blue-300 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          quantity >= maxSelectableQuantity ||
                          maxSelectableQuantity <= 0
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    Select how many items to add, then click &quot;Add to
                    Cart&quot;
                  </div>
                </div>

                <Button
                  onClick={() => {
                    addToCartContext(product, quantity);
                    setQuantity(1); // Reset quantity to 1 after adding
                  }}
                  disabled={product.stock === 0 || maxSelectableQuantity <= 0}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0
                    ? "Out of Stock"
                    : maxSelectableQuantity <= 0
                      ? "Maximum Stock in Cart"
                      : `Add ${quantity} to Cart - ${formatPrice(
                        product.price * quantity
                      )}`}
                </Button>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl">Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-blue-500 pl-4">
                    <dt className="font-semibold text-gray-900 text-lg">
                      {key}
                    </dt>
                    <dd className="text-gray-600 mt-1">{value}</dd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Products Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              You May Also Like
              <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded-full">
                {product.category} category
              </span>
            </h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Link href={`/products/${relatedProduct.slug}`}>
                        <Image
                          src={getImageSrc(relatedProduct.images?.[0])}
                          alt={relatedProduct.name}
                          width={400}
                          height={280}
                          className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onError={(e) => {
                            e.target.src = `https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=center`;
                          }}
                        />
                      </Link>
                      <Badge
                        className={`absolute top-2 right-2 ${getCategoryBadgeColor(
                          relatedProduct.category
                        )}`}
                      >
                        {relatedProduct.category}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <Link href={`/products/${relatedProduct.slug}`}>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedProduct.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        Stock: {relatedProduct.stock} available
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-green-600 text-white hover:bg-green-700 border-none"
                      >
                        <Link href={`/products/${relatedProduct.slug}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No related products available in this category</p>
                <Link
                  href="/products"
                  className="text-blue-600 hover:underline"
                >
                  Browse all products →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Floating Cart Widget */}
      {product && <Cart />}
    </>
  );
}
