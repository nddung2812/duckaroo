# Vibe Coding 2.0: 18 Rules to Be the Top 1% Builder

> The mistake isn't the code — it's the decision made before the code.

---

## The Core Idea

Fast builders win by knowing **what NOT to build**. Every hour spent on auth, raw CSS, or custom APIs is an hour not spent on the feature that makes your product worth using.

---

## The DO's

| # | Rule | Tool(s) |
|---|------|---------|
| 1 | Use ready-made auth | Clerk, Supabase Auth |
| 2 | Use a UI system | Tailwind + shadcn/ui |
| 3 | Keep state simple | Zustand + Server Components |
| 4 | Skip custom REST APIs | tRPC + Server Actions |
| 5 | One-click deploy | Vercel |
| 6 | Use a typed ORM | Prisma + managed Postgres (Supabase, Neon, Railway) |
| 7 | Validate forms properly | Zod + React Hook Form |
| 8 | Never build payments | Stripe |
| 9 | Add error tracking early | Sentry |
| 10 | Set up analytics before launch | PostHog or Plausible |
| 11 | Store secrets safely | `.env` + Doppler/Vercel env manager |
| 12 | Use managed file uploads | UploadThing or Cloudinary |
| 13 | Enable preview deployments | Vercel (automatic per PR) |
| 14 | Use accessible UI primitives | Radix + shadcn/ui |
| 15 | Write a README on day 1 | — |
| 16 | Keep folders modular | `components/`, `hooks/`, `utils/`, `types/` |
| 17 | Add onboarding + empty states | — |
| 18 | Audit performance before launch | Lighthouse (target score 70+) |

---

## The DON'Ts

- **Don't** build auth from scratch — biggest time killer for first-timers
- **Don't** write raw CSS — Tailwind covers 99% of needs faster
- **Don't** over-engineer state — no Redux for 12 users
- **Don't** build custom REST APIs before validating — use tRPC/Server Actions first
- **Don't** deploy manually — automate from day one
- **Don't** write raw SQL everywhere — use Prisma unless you have a real reason
- **Don't** build your own payment system — PCI compliance alone is months of work
- **Don't** roll your own search — use Algolia, Typesense, or Meilisearch
- **Don't** skip logging/monitoring — you'll only hear about bugs from angry users
- **Don't** hardcode API keys — ever
- **Don't** DIY file uploads — breaks in production in unpredictable ways
- **Don't** push straight to main — use feature branches + preview URLs
- **Don't** build realtime systems alone — use Supabase Realtime, Pusher, or Partykit
- **Don't** ignore performance — slow apps lose users
- **Don't** assume users will figure it out — hold their hand for the first 5 minutes
- **Don't** postpone refactoring forever — clean up every 2–3 features
- **Don't** rely on memory for decisions — document the why, not just the what
- **Don't** chase perfect before shipping — shipped and imperfect beats polished and never launched

---

## The One Rule Behind All Rules

> Use the tools. Trust the ecosystem. Ship fast. Learn from real users.

The best builders aren't better coders — they're better at identifying where **not** to spend energy. The time you save goes into what actually matters: features, UX, and distribution.
