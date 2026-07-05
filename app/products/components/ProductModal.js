import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Check, AlertTriangle } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { getBuyerAwareWarning } from "@/lib/buyerAware";
import { toast } from "react-toastify";

const getImageSrc = (img) => (typeof img === "string" ? img : img?.url ?? "");

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use global cart context
  const { getCartItemQuantity, addToCart: addToCartContext } = useCart();

  // Reset selected image when modal opens with a new product
  useEffect(() => {
    if (isOpen && product) {
      setSelectedImageIndex(0);
    }
  }, [isOpen, product]);

  if (!product) return null;

  // Handle add to cart with stock validation
  const handleAddToCart = () => {
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

    // Use global cart context to add to cart and close modal
    addToCartContext(product, 1);
    onClose();
  };

  // Check if product can be added to cart
  const canAddToCart = () => {
    if (product.stock === 0) return false;
    const currentCartQuantity = getCartItemQuantity(product.id);
    return currentCartQuantity < product.stock;
  };

  // Get button text based on stock status
  const getAddToCartButtonText = () => {
    if (product.stock === 0) return "Out of Stock";
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
        return "bg-moss/60 border border-amber-glow/40 text-amber-glow";
      case "livestock":
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

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const validImages = (product.images ?? []).map(getImageSrc).filter(Boolean);
  const productImages = validImages.length > 0 ? validImages : [
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&crop=center",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-ink/95 backdrop-blur-md border border-cream/15 text-cream">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium text-parchment">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={productImages[selectedImageIndex]}
                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                width={600}
                height={320}
                className="w-full h-80 object-cover"
                loading="lazy"
                quality={85}
                sizes="(max-width: 768px) 100vw, 600px"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&crop=center";
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
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`relative overflow-hidden rounded-md border-2 transition-all duration-200 ${selectedImageIndex === index
                        ? "border-amber-glow ring-2 ring-amber-glow/40"
                        : "border-cream/20 hover:border-cream/40"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      width={200}
                      height={80}
                      className="w-full h-20 object-cover"
                      loading="lazy"
                      quality={70}
                      sizes="200px"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=80&fit=crop&crop=center";
                      }}
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-amber-glow/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-amber-glow rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Price and Rating */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-glow">
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="ml-2 text-cream/70">(4.8)</span>
              </div>
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

            {/* Buyer Aware notice */}
            {(() => {
              const warning = getBuyerAwareWarning(product);
              if (!warning) return null;
              return (
                <div
                  role="alert"
                  className="rounded-2xl border border-amber-glow/40 bg-amber-950/40 p-3 flex gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-glow flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-glow mb-0.5">
                      {warning.title}
                    </p>
                    <p className="text-cream/80 leading-relaxed">
                      {warning.fullMessage}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Cart Status */}
            {(() => {
              const currentCartQuantity = getCartItemQuantity(product.id);
              if (currentCartQuantity > 0) {
                return (
                  <div className="bg-moss/40 border border-cream/15 rounded-2xl p-3">
                    <div className="text-sm text-cream/80">
                      <strong>In cart:</strong> {currentCartQuantity}
                      {currentCartQuantity >= product.stock && (
                        <span className="text-red-300 ml-2">
                          (Maximum stock reached)
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Description */}
            <div>
              <h3 className="font-display text-lg font-medium mb-2 text-parchment">
                Description
              </h3>
              <div
                className="text-cream/70 leading-relaxed product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Features */}
            <div>
              <h3 className="font-display text-lg font-medium mb-3 text-parchment">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-300" />
                    <span className="text-cream/70">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="font-display text-lg font-medium mb-3 text-parchment">
                Specifications
              </h3>
              <div className="bg-cream/5 border border-cream/10 rounded-2xl p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt className="font-medium text-cream/90">{key}:</dt>
                        <dd className="text-cream/60">{value}</dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="w-full py-3 rounded-full bg-amber-glow text-[#04121b] text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {getAddToCartButtonText()}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
