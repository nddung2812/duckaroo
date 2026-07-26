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
      className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
