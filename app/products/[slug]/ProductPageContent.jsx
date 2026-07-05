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
import PageAmbience from "../../components/PageAmbience";
import { toggleFavorite, isFavorite } from "@/app/utils/favorites";
import { useCart } from "@/app/context/CartContext";
import { getBuyerAwareWarning } from "@/lib/buyerAware";
import { toast } from "react-toastify";

function Breadcrumb({ product }) {
  const categoryName =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-y-1 text-sm text-cream/60">
        <li>
          <Link href="/" className="hover:text-amber-glow">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <Link href="/products" className="hover:text-amber-glow">
            Products
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-amber-glow"
          >
            {categoryName}
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li aria-current="page" className="text-parchment font-medium">
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
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow";
      case "probiotics":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow";
      case "accessories":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow";
      case "equipment":
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow";
      default:
        return "bg-moss/60 border border-cream/20 text-cream/75";
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
      <PageAmbience />
      <div className="min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 flex items-center space-x-2 rounded-full border-cream/30 text-cream/90 bg-transparent hover:border-cream/60 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em]"
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
              <div className="relative overflow-hidden rounded-2xl bg-cream/5 border border-cream/15 shadow-lg">
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
                  <Badge className="absolute top-4 right-4 bg-red-950/30 border border-red-800/40 text-red-300">
                    Low Stock
                  </Badge>
                )}
                {getBuyerAwareWarning(product) && (
                  <Badge className="absolute bottom-4 left-4 bg-moss/60 text-amber-glow border border-amber-glow/40 flex items-center gap-1">
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
                      ? "border-amber-glow ring-2 ring-amber-glow/30"
                      : "border-cream/15 hover:border-cream/30"
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
                      <div className="absolute inset-0 bg-amber-glow/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-glow rounded-full"></div>
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
                <h1 className="font-display text-3xl font-medium text-parchment mb-2">
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
                          : "text-cream/25"
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-cream/60">
                      ({product.reviews?.rating || "5.0"}) ·{" "}
                      {product.reviews?.count || "1"} reviews
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="rounded-full border-cream/30 text-cream/90 bg-transparent hover:border-cream/60 hover:bg-cream/5 hover:text-cream"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFavorite}
                      className={`rounded-full bg-transparent ${isFav
                        ? "bg-red-950/30 border-red-800/40 text-red-300 hover:bg-red-950/50 hover:text-red-300"
                        : "border-cream/30 text-cream/90 hover:border-cream/60 hover:bg-cream/5 hover:text-cream"
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
                    className="rounded-2xl border border-amber-glow/40 bg-moss/40 p-4 flex gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-glow flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-glow mb-1">
                        {warning.title}
                      </p>
                      <p className="text-cream/80 leading-relaxed">
                        {warning.fullMessage}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Price */}
              <div className="text-4xl font-bold text-amber-glow">
                {formatPrice(product.price)}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                ></div>
                <span
                  className={`font-medium ${product.stock > 0 ? "text-green-300" : "text-red-300"
                    }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-xl font-medium mb-3 text-parchment">
                  Product Description
                </h2>
                <div
                  className="text-cream/70 leading-relaxed text-lg product-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Features */}
              <div>
                <h2 className="font-display text-xl font-medium mb-3 text-parchment">
                  Key Features
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-amber-glow flex-shrink-0" />
                      <span className="text-cream/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Information and Cart Controls */}
              <div className="space-y-4">
                {/* Stock Information */}
                <div className="text-sm text-cream/60">
                  <div className="flex justify-between items-center">
                    <div className="text-amber-glow">
                      In Cart: {isClient ? currentCartQuantity : 0}
                    </div>
                    <div className="text-right">
                      <span
                        className={
                          product.stock - currentCartQuantity > 0
                            ? "text-green-300"
                            : "text-red-300"
                        }
                      >
                        Available: {product.stock - currentCartQuantity}
                      </span>
                      {isClient && currentCartQuantity >= product.stock && (
                        <span className="text-red-300 ml-1 block">
                          {product.stock === 0 ? "Out of Stock" : "(Max reached)"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="bg-cream/5 border border-cream/15 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-parchment">
                      Select Quantity:
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-cream/30 text-cream/90 hover:border-cream/60 hover:bg-cream/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-parchment">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(maxSelectableQuantity, quantity + 1)
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-cream/30 text-cream/90 hover:border-cream/60 hover:bg-cream/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          quantity >= maxSelectableQuantity ||
                          maxSelectableQuantity <= 0
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-cream/60">
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
                  className="w-full py-4 h-auto bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
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
          <Card className="mt-12 bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
            <CardHeader>
              <CardTitle className="font-display text-2xl font-medium text-parchment">Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-amber-glow/60 pl-4">
                    <dt className="font-semibold text-parchment text-lg">
                      {key}
                    </dt>
                    <dd className="text-cream/70 mt-1">{value}</dd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Products Section */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-medium mb-6 text-parchment">
              You May Also Like
              <span className="text-sm font-normal text-cream/75 ml-2 bg-moss/60 border border-cream/20 px-2 py-1 rounded-full">
                {product.category} category
              </span>
            </h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="group bg-cream/5 border-cream/15 rounded-2xl text-cream hover:border-amber-glow/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
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
                        <h3 className="font-display font-medium text-lg mb-2 line-clamp-2 text-parchment hover:text-amber-glow transition-colors cursor-pointer">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <p className="text-cream/70 text-sm mb-3 line-clamp-2">
                        {relatedProduct.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-amber-glow">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-cream/60 mb-3">
                        Stock: {relatedProduct.stock} available
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] border-none"
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
              <div className="text-center py-8 text-cream/60">
                <p>No related products available in this category</p>
                <Link
                  href="/products"
                  className="text-amber-glow hover:underline"
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
