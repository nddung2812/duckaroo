"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="w-full bg-transparent border border-cream/30 text-cream/90 rounded-full px-4 py-3 text-[13px] uppercase tracking-[0.14em] font-medium hover:border-cream/60 hover:bg-cream/5 hover:text-cream disabled:opacity-50 transition-colors"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
