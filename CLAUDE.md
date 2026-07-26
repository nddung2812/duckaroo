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
| `users` | Customer accounts. `password_hash` is **nullable** — see Customer auth below |
| `auth_tokens` | Single-use set-password / reset-password tokens (SHA-256 only) |
| `sessions` | Customer sessions (SHA-256 of an opaque cookie token) |
| `rate_limits` | Fixed-window counters for login and email-sending endpoints |

All DB helper functions live in `lib/` — `stock.js`, `leads.js`, `orders.js`, `diseases.js`, `users.js`, `authTokens.js`, `session.js`, `rateLimit.js`. Always use these rather than writing raw SQL in route handlers.

There is no migration tool. Schema lives in idempotent scripts: `scripts/seed-products.mjs` (products) and `scripts/migrate-auth.mjs` (the four auth tables). Both use `DATABASE_URL_UNPOOLED`.

### Customer auth

Two *separate* auth systems live in this repo — do not conflate them:

- **Admin** — `lib/auth.js`, one shared `DASHBOARD_SECRET` in a `dashboard_session` cookie. Guards `/dashboard` only.
- **Customer** — `lib/session.js`, per-user rows in `sessions`, `duckaroo_session` cookie. Read the current customer with `getCurrentUser()` from `lib/session.js`; it works in RSC, route handlers and server actions.

Customers migrated from Shopify were imported with `password_hash = NULL`, because Shopify does not export passwords. That NULL is load-bearing: it means "this account exists but has never been claimed on this site". On login, `decideLoginOutcome()` in `lib/auth/policy.mjs` sees it and emails that one person a set-password link instead of authenticating them — this is the lazy migration, which spreads email volume over weeks rather than blasting the whole list at launch.

Pure auth decision logic lives in `lib/auth/policy.mjs` (no DB, no I/O) so it can be unit tested. `npm test` runs `node:test` against `test/*.test.mjs`.

Passwords are argon2id via `@node-rs/argon2`. Auth tokens and session tokens are 32 random bytes; only their SHA-256 is ever stored.

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
RESEND_API_KEY             # transactional auth email (Vercel Marketplace integration)
```

Optional, with sensible defaults:

```
EMAIL_FROM                 # default "Duckaroo <accounts@duckaroo.com.au>"
EMAIL_PROVIDER             # "resend" | "console". Defaults to resend if RESEND_API_KEY
                           # is set, otherwise console (dev only — it prints emails
                           # instead of sending, and throws in production)
```

**`APP_URL` is required in production** and has no fallback there — auth email
links are built from it. Since the DNS cutover (July 2026) the app is live at
`https://duckaroo.com.au`, so that is the correct production value. Set it to
wherever this app is actually reachable. Locally it defaults to
`http://localhost:3000`.

```
APP_URL                    # required in production: https://duckaroo.com.au
```
