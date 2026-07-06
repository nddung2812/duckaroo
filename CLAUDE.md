# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (webpack mode — do NOT use turbopack, it breaks CSS)
npm run build      # Production build
npm run lint       # ESLint via next lint
```

> There are no tests in this project.

## Architecture Overview

**Business**: Duckaroo — fish tank cleaning service in Brisbane & Gold Coast, Australia.  
**Domain**: `duckaroo.com.au` (canonical/primary site — used for all metadataBase, canonicals, OG, sitemap, robots, and JSON-LD URLs). The old `aquaticswandesign.com.au` domain is being retired; 301 redirects from the former Shopify store's URLs live in `next.config.mjs`.

### Stack

- **Next.js App Router** (React 19, JS not TS)
- **Tailwind CSS + shadcn/ui** (Radix primitives)
- **Neon PostgreSQL** via `@neondatabase/serverless` — all DB access goes through `lib/neon.js`
- **Cloudinary** for all images — custom loader at `app/utils/cloudinaryLoader.js`, image search via `lib/cloudinary.js`
- **EmailJS** for contact/service forms
- **Stripe** for product checkout

### Database tables

| Table | Purpose |
|---|---|
| `products` | Product catalogue (images, features, specs stored as JSON columns) |
| `leads` | Service enquiries captured from `UnifiedServiceForm` |
| `orders` | Stripe orders |
| `aquarium_diseases` | Disease guide content (slug, disease_name, symptoms, treatment, etc.) |

All DB helper functions live in `lib/` — `stock.js`, `leads.js`, `orders.js`, `diseases.js`. Always use these rather than writing raw SQL in route handlers.

### Key pages & data flow

- **`/products`** — paginated product listing, fetches from `/api/stock` (Neon). Product data is DB-only; `app/products/data/products.js` just exports categories. `products_backup.js` is historical reference, not used.
- **`/products/[slug]`** — individual product with Product + Offer + BreadcrumbList JSON-LD
- **`/common-aquarium-diseases`** — disease listing from Neon `aquarium_diseases` table
- **`/common-aquarium-diseases/[slug]`** — disease detail with images fetched from Cloudinary folder `AquaticSwan/Aquarium Diseases/{disease_name}`. Results are cached 1 hour via `unstable_cache`.
- **`/dashboard`** — password-protected admin (cookie auth via `DASHBOARD_USERNAME` + `DASHBOARD_SECRET`). Tabs: Products, Leads, Orders. Trigger Vercel deploy via `/api/deploy` (requires `VERCEL_DEPLOY_HOOK_URL`).
- **`/service`** — service booking page with `UnifiedServiceForm` that posts to EmailJS then saves to `leads` table

### Metadata / SEO pattern

Every route segment has a `layout.js` that exports `metadata` (title, description, OG, Twitter, canonical, JSON-LD). Page-level files only add page-specific JSON-LD when needed. Do not put metadata in both `layout.js` and `page.js` for the same segment — it causes duplication.

JSON-LD schemas in use: `LocalBusiness`, `Organization`, `WebSite` (root), `Product`+`Offer` (product pages), `Article`+`BreadcrumbList` (disease pages), `FAQPage` (service), `HowTo`+`Article` (how-to-setup), `CollectionPage`+`ItemList` (customer stories).

### Cloudinary conventions

- All disease images live under `AquaticSwan/Aquarium Diseases/{disease_name}` — folder name must match `disease_name` column exactly (not the slug).
- Product images are uploaded via the dashboard and stored as URL arrays in the `products.images` JSON column.
- The Cloudinary Search API has a **500 ops/hour** rate limit. Avoid scripts that loop over many resources at once.

### Required environment variables

```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
DATABASE_URL               # pooled Neon connection
DATABASE_URL_UNPOOLED      # direct Neon connection (use for scripts/migrations)
DASHBOARD_USERNAME
DASHBOARD_SECRET
VERCEL_DEPLOY_HOOK_URL
NEXT_PUBLIC_EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```
