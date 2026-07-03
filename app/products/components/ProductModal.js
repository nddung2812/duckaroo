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
        return "bg-green-100 text-green-800";
      case "livestock":
        return "bg-teal-100 text-teal-800";
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

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const validImages = (product.images ?? []).map(getImageSrc).filter(Boolean);
  const productImages = validImages.length > 0 ? validImages : [
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&crop=center",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
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
                <Badge className="absolute top-4 right-4 bg-red-100 text-red-800">
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
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
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
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
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
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">(4.8)</span>
              </div>
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

            {/* Buyer Aware notice */}
            {(() => {
              const warning = getBuyerAwareWarning(product);
              if (!warning) return null;
              return (
                <div
                  role="alert"
                  className="rounded-lg border border-amber-300 bg-amber-50 p-3 flex gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-900 mb-0.5">
                      {warning.title}
                    </p>
                    <p className="text-amber-900 leading-relaxed">
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-800">
                      <strong>In cart:</strong> {currentCartQuantity}
                      {currentCartQuantity >= product.stock && (
                        <span className="text-red-600 ml-2">
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
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Description
              </h3>
              <div
                className="text-gray-600 leading-relaxed product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Specifications
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt className="font-medium text-gray-900">{key}:</dt>
                        <dd className="text-gray-600">{value}</dd>
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
                className="w-full py-3 text-lg"
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
