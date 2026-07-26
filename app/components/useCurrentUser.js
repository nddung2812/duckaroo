"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Resolves the signed-in customer from the client.
 *
 * Shared by the two headers this site has — the shared Navbar and the
 * homepage's own header in HomeClient — so the fetch and the sign-out logic
 * exist once rather than being copy-pasted into both.
 *
 * Client-side rather than getCurrentUser() in a layout on purpose: the layouts
 * wrap statically generated pages, and reading cookies during their render
 * would force ~124 product pages and ~30 disease pages to become dynamic.
 *
 * @returns {{user: object|null|undefined, loading: boolean, signingOut: boolean, signOut: () => Promise<void>}}
 *          user is `undefined` while loading, `null` when signed out.
 */
export default function useCurrentUser() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null)); // aborted or offline — treat as signed out

    return () => controller.abort();
  }, []);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }, [router]);

  return { user, loading: user === undefined, signingOut, signOut };
}

/** What to show in a header link: their name, their email, or "Sign in". */
export function accountLabel(user) {
  if (user === undefined) return "";
  if (!user) return "Sign in";
  return user.firstName?.trim() || user.email;
}
