const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Currently sent as Content-Security-Policy-Report-Only: browsers evaluate it
 * and report what *would* have been blocked without actually blocking anything.
 * Violations are logged by /api/csp-report (see `report-uri` below) and also
 * appear in the DevTools console. Once the report stream is quiet for real
 * traffic — checkout and the service form are the two paths most likely to
 * surface a missing host — flip CSP_HEADER_NAME to the enforcing name.
 *
 * Note on 'unsafe-inline' in script-src: the strict alternative is a per-request
 * nonce, which requires generating the header in middleware and makes every page
 * dynamic — that would cost us static prerendering across the whole site. So
 * inline scripts stay allowed and this CSP is a defence-in-depth layer (it stops
 * an injected script from *loading* or *exfiltrating to* an unlisted origin)
 * rather than a complete XSS block.
 */
const CSP_HEADER_NAME = "Content-Security-Policy-Report-Only";

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://js.stripe.com", // Stripe Elements (checkout)
    "https://www.googletagmanager.com", // GA via @next/third-parties
    // next dev compiles with eval; harmless in production where it is absent
    ...(isDev ? ["'unsafe-eval'"] : []),
  ],
  // Tailwind ships a stylesheet, but React inline style attributes and
  // next/font's injected <style> need 'unsafe-inline'.
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    // must stay in sync with images.remotePatterns below
    "https://res.cloudinary.com",
    "https://upcdn.io",
    "https://firebasestorage.googleapis.com",
    "https://images.unsplash.com",
    "https://cdn.shopify.com",
    "https://upload.wikimedia.org",
    // GA collect-via-pixel fallback
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
  ],
  // next/font self-hosts the Google fonts at build time, so no gstatic host.
  "font-src": ["'self'", "data:"],
  "connect-src": [
    "'self'",
    "https://api.stripe.com",
    "https://m.stripe.com",
    "https://api.emailjs.com", // UnifiedServiceForm + contact form
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    ...(isDev ? ["ws:", "wss:"] : []), // HMR socket
  ],
  // Stripe Elements renders its card fields in iframes from these hosts.
  "frame-src": ["'self'", "https://js.stripe.com", "https://hooks.stripe.com", "https://m.stripe.network"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"], // mirrors X-Frame-Options: SAMEORIGIN
  "upgrade-insecure-requests": [],
  "report-uri": ["/api/csp-report"],
};

const cspValue = Object.entries(cspDirectives)
  .map(([directive, values]) => (values.length ? `${directive} ${values.join(" ")}` : directive))
  .join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  images: {
    loader: 'custom',
    loaderFile: './app/utils/cloudinaryLoader.js',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upcdn.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80],
  },
  // Security headers for trust signals and SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: CSP_HEADER_NAME,
            value: cspValue,
          },
        ],
      },
      {
        // API responses are JSON, so they can't carry a <meta name="robots">.
        // robots.txt already disallows /api/, but a Disallow only stops the
        // fetch — it does not stop a URL-only listing for an endpoint someone
        // links to, and it is ignored outright by crawlers that don't honour
        // it. This header covers both cases.
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },

  // Add redirects configuration
  async redirects() {
    return [
      {
        source: "/pages/about-us",
        destination: "/about-us",
        permanent: true, // 301 redirect for SEO
      },
      {
        source: "/pages/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/real-aquarium-project",
        destination: "/customer-stories",
        permanent: true, // 301 redirect for SEO
      },
      {
        source: "/$",
        destination: "/",
        permanent: true,
      },
      {
        source: "/&",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products/buce-kegadang",
        destination: "/products/bucephalandra-kegadang",
        permanent: true,
      },
      {
        source: "/products/anubias-nana",
        destination: "/products/anubias-nana-petite",
        permanent: true,
      },
      {
        source: "/products/anubias-panda",
        destination: "/products/anubias-panda-very-rare-limited-stock",
        permanent: true,
      },

      // ── Migration from the old Shopify store (duckaroo.com.au) ──
      // Product URLs (/products/{slug}) are intentionally omitted: every slug in
      // the Shopify sitemap already exists in our DB with an identical slug, so
      // /products/{slug} resolves natively — no redirect required.

      // Shopify collections → our single product listing.
      // NOTE: /products cannot pre-filter by ?category= yet (it hardcodes "all"),
      // so every collection lands on the full listing. Covers best-sellers,
      // monthly-special, new-arrivals, aquarium-plants, aquarium-shrimp,
      // aquarium-probiotics, aquarium-designs, accessories, bucephalandra-anubias.
      {
        source: "/collections/:slug*",
        destination: "/products",
        permanent: true,
      },

      // Shopify content pages → our equivalents
      {
        source: "/pages/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/pages/our-services",
        destination: "/service",
        permanent: true,
      },
      // FLAG: /pages/peter-ford is a person/bio page with no direct equivalent.
      // Best-effort target is /about-us — confirm the intended destination.
      {
        source: "/pages/peter-ford",
        destination: "/about-us",
        permanent: true,
      },

      // Shopify blog articles → our blog. Shopify uses /blogs/news/{slug};
      // our articles live at /blogs/{slug} (no /news/ segment, so no collision).
      // Best-effort topical match for the buce article; the algae article and
      // the news index/tag pages fall through to the blog listing.
      {
        source:
          "/blogs/news/5-popular-bucephalandra-varieties-in-australia-a-closer-look-at-duckaroo-store",
        destination: "/blogs/bucephalandra-care-guide-beginners",
        permanent: true,
      },
      // FLAG: /blogs/news/dealing-with-algae-in-your-aquarium-a-beginners-guide
      // has no equivalent article — it falls through to /blogs via the catch-all.
      {
        source: "/blogs/news/:path*",
        destination: "/blogs",
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizeCss: false,
  },
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    // Force CSS files to be processed as standard CSS, not SCSS
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.test.toString().includes("css")) {
        if (rule.use) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes("postcss-loader")) {
              use.options = use.options || {};
              use.options.postcssOptions = use.options.postcssOptions || {};
              use.options.postcssOptions.parser = "postcss";
              use.options.postcssOptions.syntax = "postcss";
            }
          });
        }
      }
    });

    return config;
  },
};

export default nextConfig;
