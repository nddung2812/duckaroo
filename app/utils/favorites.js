// Utility functions for managing favorites with cookies

// Cookie name for storing favorites
const FAVORITES_COOKIE_NAME = "aquatic_favorites";

// Set cookie expiration to 7 days
const COOKIE_EXPIRY_DAYS = 7;

// Get favorites from cookies
export const getFavorites = () => {
  if (typeof window === "undefined") return [];

  try {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${FAVORITES_COOKIE_NAME}=`));

    if (!cookieValue) return [];

    const value = cookieValue.split("=")[1];
    return JSON.parse(decodeURIComponent(value));
  } catch (error) {
    // Silently handle cookie parsing errors
    return [];
  }
};

// Save favorites to cookies
export const saveFavorites = (favorites) => {
  if (typeof window === "undefined") return;

  try {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + COOKIE_EXPIRY_DAYS);

    const cookieValue = encodeURIComponent(JSON.stringify(favorites));
    document.cookie = `${FAVORITES_COOKIE_NAME}=${cookieValue}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    // Silently handle cookie saving errors
  }
};

// Add product to favorites
export const addToFavorites = (product) => {
  const currentFavorites = getFavorites();
  const isAlreadyFavorite = currentFavorites.some(
    (fav) => fav.id === product.id
  );

  if (!isAlreadyFavorite) {
    const newFavorites = [
      ...currentFavorites,
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image:
          product.images?.[0] ||
          "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=center",
        addedAt: new Date().toISOString(),
      },
    ];
    saveFavorites(newFavorites);
    return true;
  }
  return false;
};

// Remove product from favorites
export const removeFromFavorites = (productId) => {
  const currentFavorites = getFavorites();
  const newFavorites = currentFavorites.filter((fav) => fav.id !== productId);
  saveFavorites(newFavorites);
  return true;
};

// Check if product is in favorites
export const isFavorite = (productId) => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === productId);
};

// Clear all favorites
export const clearFavorites = () => {
  if (typeof window === "undefined") return;
  document.cookie = `${FAVORITES_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Toggle favorite status
export const toggleFavorite = (product) => {
  if (isFavorite(product.id)) {
    removeFromFavorites(product.id);
    return false;
  } else {
    addToFavorites(product);
    return true;
  }
};
