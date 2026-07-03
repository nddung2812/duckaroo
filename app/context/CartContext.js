"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsClient(true);

    // Only access localStorage if we're on the client
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("shopping-cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          // Silently handle parsing errors and reset cart
          setCartItems([]);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change (only after initial load)
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      localStorage.setItem("shopping-cart", JSON.stringify(cartItems));

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cartItems },
        })
      );
    }
  }, [cartItems, isClient]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });

    // Show success toast
    toast.success(
      `Added ${quantity} ${product.name}${quantity > 1 ? "s" : ""} to cart!`
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const value = {
    cartItems,
    isClient,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartItemQuantity,
    getTotalItems: getTotalItems(),
    getTotalPrice: getTotalPrice(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
