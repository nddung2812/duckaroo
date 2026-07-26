"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

/**
 * Sign in / account control for the navbar.
 *
 * Resolves the customer client-side rather than server-side on purpose. Layout
 * wraps every page, so calling getCurrentUser() there would read cookies during
 * render and force ~150 statically generated product and disease pages to
 * become dynamic. The cost of doing it this way is a brief "Sign in" before the
 * name appears for a signed-in customer; the space is reserved so nothing
 * shifts.
 */
export default function AccountLink({ variant = "desktop" }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null)); // aborted or offline — treat as signed out

    return () => controller.abort();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const label = user ? user.firstName?.trim() || user.email : "Sign in";

  if (variant === "mobile") {
    return (
      <div className="border-t border-cream/10 pt-6 space-y-4">
        <Link
          href={user ? "/account" : "/login"}
          className="flex items-center gap-2 text-cream text-lg"
        >
          <User className="h-5 w-5" aria-hidden="true" />
          {user === undefined ? "Account" : label}
        </Link>
        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-cream/60 text-sm hover:text-cream transition-colors disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        ) : (
          <Link href="/signup" className="block text-cream/60 text-sm hover:text-cream transition-colors">
            Create an account
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={user ? "/account" : "/login"}
        className="flex items-center gap-1.5 text-cream/80 hover:text-cream text-[12px] uppercase tracking-[0.12em] whitespace-nowrap transition-colors"
        // Reserve width so the label swapping in does not nudge the buttons.
        style={{ minWidth: "5.5rem" }}
      >
        <User className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate max-w-[9rem]">{user === undefined ? "" : label}</span>
      </Link>
      {user && (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-cream/50 hover:text-cream/80 text-[11px] uppercase tracking-[0.1em] transition-colors disabled:opacity-50"
        >
          {signingOut ? "…" : "Sign out"}
        </button>
      )}
    </div>
  );
}
