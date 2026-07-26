"use client";

import Link from "next/link";
import { User } from "lucide-react";

import useCurrentUser, { accountLabel, accountInitial } from "./useCurrentUser";

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

  // Signed in, the header shows only an initial in a circle — the full name and
  // the sign-out button live on /account. The slot holds its size while
  // /api/auth/me is in flight so the Shop and Book buttons do not shift.
  return (
    <div className="flex items-center justify-end min-w-10 h-10">
      {user && (
        <Link
          href="/account"
          aria-label={`Your account — ${label}`}
          title={label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/35 bg-[#04121b]/35 text-cream text-[15px] font-semibold leading-none tracking-[0.06em] hover:border-amber-glow/80 hover:bg-amber-glow/15 hover:text-amber-glow transition-colors"
        >
          <span aria-hidden="true">{accountInitial(user)}</span>
        </Link>
      )}
      {user === null && (
        <Link
          href="/login"
          className="text-cream/85 hover:text-amber-glow text-[12px] uppercase tracking-[0.12em] whitespace-nowrap transition-colors"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
