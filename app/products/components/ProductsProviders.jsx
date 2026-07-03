"use client";

import { CartProvider } from "@/app/context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Cart and toast notifications are only needed on the store pages,
// so they live here instead of the root layout to keep the rest of
// the site's JS bundle small.
export default function ProductsProviders({ children }) {
  return (
    <CartProvider>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </CartProvider>
  );
}
