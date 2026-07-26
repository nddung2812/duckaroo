import Link from "next/link";

import Layout from "@/app/components/Layout";
import PageAmbience from "@/app/components/PageAmbience";

/**
 * Shared chrome for the auth pages — a single centred glass card sitting on the
 * site's "Living Art" backdrop, inside the usual Navbar/Footer. Signing in is
 * part of the site, not a detour out of it.
 */
export default function AuthShell({ title, intro, children, footer }) {
  return (
    <>
      <PageAmbience />

      <Layout>
        {/* pt clears the fixed h-20 Navbar, which the glass card would otherwise
            slide under — the site convention for pages inside Layout. */}
        <div className="relative z-10 min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-16">
          <div className="w-full max-w-md">
            <div className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl shadow-2xl p-8">
              <h1 className="font-display text-3xl md:text-4xl font-medium text-parchment [text-wrap:balance]">
                {title}
              </h1>
              {intro && (
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{intro}</p>
              )}
              <div className="mt-6">{children}</div>
            </div>
            {footer && (
              <div className="mt-6 text-center text-sm text-cream/60">{footer}</div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export function AuthLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-amber-glow font-medium hover:text-amber-glow/80 underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  );
}
