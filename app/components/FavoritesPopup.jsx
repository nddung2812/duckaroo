"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Heart, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getFavorites, clearFavorites } from "@/app/utils/favorites";

const FavoritesPopup = ({ isOpen, onClose }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const userFavorites = getFavorites();
      setFavorites(userFavorites);
    }
  }, [isOpen]);

  const formatPrice = (price) => {
    return (
      new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(price) + " AUD"
    );
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setFavorites([]);
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Popup Content */}
        <Card
          className="bg-white max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 fill-current" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Your Favorite Products
                  </CardTitle>
                  <p className="text-purple-100 text-sm">
                    Items you&apos;ve saved for later
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
                saved
              </Badge>
              {favorites.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFavorites}
                  className="text-white hover:bg-white/20 hover:text-white text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start browsing our products and save your favorites for later!
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/products">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {favorites.map((item) => (
                    <Card
                      key={item.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={128}
                          className="w-full h-32 object-cover md:group-hover:scale-105 md:transition-transform md:duration-300"
                          loading="lazy"
                          quality={80}
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white text-xs">
                            <Heart className="w-3 h-3 mr-1 fill-current" />
                            Favorite
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(item.price)}
                          </span>
                          <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Saved on {formatDate(item.addedAt)}
                        </p>
                        <Button
                          asChild
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Link href={`/products/${item.slug}`}>
                            View Product
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center border-t pt-6">
                  <p className="text-gray-600 mb-4">
                    Want to see more products like these?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      asChild
                      variant="outline"
                      className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900 flex-1 sm:flex-none"
                    >
                      <Link href="/products">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        All Products
                      </Link>
                    </Button>
                    <Button
                      onClick={onClose}
                      className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-none"
                    >
                      Continue Browsing
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FavoritesPopup;
