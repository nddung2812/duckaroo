"use client";

import Link from "next/link";
import { User } from "lucide-react";

import useCurrentUser, { accountLabel } from "./useCurrentUser";

/**
 * Sign in / account control for the shared Navbar.
 *
 * The homepage does not use this — it has its own header in HomeClient.jsx with
 * its own CSS modules, and renders an equivalent control there. Both go through
 * useCurrentUser() so the behaviour cannot drift.
 */
export default function AccountLink({ variant = "desktop" }) {
  const { user, signingOut, signOut: handleSignOut } = useCurrentUser();
  const label = accountLabel(user) || "Sign in";

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
