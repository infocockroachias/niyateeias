<div align="center">

# नियती — Niyatee IAS

**Best UPSC Coaching in Odisha — AI-Powered UPSC Preparation & Expert Mentorship**

A complete rebuild of [niyateeias.com](https://niyateeias.com) — the digital home of **Niyatee Civil Services Academy, Bhubaneswar** — as a modern, fast, professional Next.js application.

*नियती (Niyatee) means **Destiny** in Sanskrit. From Aspirations to Achievements.*

</div>

---

## About the project

Niyatee Civil Services Academy is Eastern India's emerging IAS academy and **Odisha's first AI-integrated UPSC coaching institute**. This repository rebuilds the academy's web platform with the same feature set as the original site — news, resources, AI tools, courses, plans and a student portal — redesigned from the ground up for correct functionality, clean UI/UX and a professional visual identity rooted in the brand (navy `#0A1B3D`, gold `#C9A24B`, ivory `#FAF8F2`).

## Features

| Area | What you get |
| --- | --- |
| **Home** | Brand hero, 4-step framework (Learn → Practice → Evaluate → Succeed), live stats, featured courses, today's news, AI tools showcase, rankers marquee, testimonials, FAQ, newsletter |
| **News / Current Affairs** | Daily UPSC-oriented articles curated from The Hindu / Indian Express / PIB / Yojana, GS-paper tags, interactive month calendar, article reader, monthly digest downloads |
| **Resources** | 40+ free resources — 10 years of Prelims PYQs with solutions, Mains PYQ frameworks, CSAT papers, GS notes, mentor-approved booklists, UPSC & OPSC answer keys, e-books, monthly current-affairs compilations — with category/exam filters and bookmarks |
| **AI Tools** | ① **AI Mains Answer Evaluation** — UPSC-rubric scoring (content, structure, analysis, examples, presentation) with model outlines. ② **AI Doubt Agent** — 24×7 UPSC-aware mentor chat. ③ **AI MCQ Practice** — Prelims-style quizzes with instant explanations (seeded bank + AI generation). ④ **Interactive Geography Maps** — interactive 3D AI Geo Maps — a 3D world globe with 130+ UPSC-curated locations (places in news, rivers, ranges, straits, ports, dams, heritage, ecology), layers, search, fly-to and an AI map quiz |
| **AI Plans** | Explorer (free) / Aspirant / Achiever subscription tiers |
| **Courses** | 10 programmes across UPSC & OPSC — GS Foundation (offline / live online / recorded), Prelims Target, CSAT Bootcamp, Mains Answer Writing, Ethics & Essay, Interview Guidance, OPSC OCS, Sociology optional — with filters, detail pages and enquiry CTAs |
| **Books Shop** | Niyatee Press titles with ratings, discounts and a working cart |
| **Test Series** | Prelims / CSAT / Mains / OPSC series cards |
| **Rankers & Testimonials** | Hall of fame grouped by year + student voices |
| **Student Portal** | Register / login with secure sessions, dashboard with bookmarks and quiz analytics |
| **Contact** | Enquiry form (saved to DB), counselling CTA, socials, newsletter |

## Tech stack

- **Framework** — Next.js 16 (App Router), React 19, TypeScript
- **Styling** — Tailwind CSS 4 + shadcn/ui (New York), custom navy/gold design tokens, Playfair Display + Inter + Noto Sans Devanagari via `next/font`
- **Database** — Prisma ORM with SQLite (single `db/custom.db` file)
- **State** — Zustand (SPA view routing via hash + cart + auth state), TanStack Query (server data)
- **AI** — `z-ai-web-dev-sdk` (server-side only) powering evaluation, chat and MCQ generation
- **Motion** — Framer Motion page transitions and micro-interactions

## Getting started

```bash
# 1. Install dependencies
bun install        # or: npm install

# 2. Configure environment
cp .env.example .env

# 3. Create the database schema and seed it with rich demo content
bun run db:push
bun run scripts/seed.ts

# 4. Start the dev server
bun run dev        # http://localhost:3000
```

Production build:

```bash
bun run build
bun run start
```

## Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Prisma SQLite connection, e.g. `file:../db/custom.db` (resolved from `prisma/schema.prisma`) |

## Deploying to Vercel

The project is Vercel-ready and **zero-config**:

1. Push this repository to GitHub (already done — see below).
2. In Vercel, **Add New → Project** and import the repo (`infocockroachias/niyateeias`, branch `main`).
3. On the import screen you'll see the project settings (name, root directory `./`, framework preset **Next.js** auto-detected) — scroll down and click **Deploy** (Vercel labels this final button "Deploy"; in some UI versions it appears as "Create Project" — that click both creates the project and starts the first deployment).
4. Wait ~1–2 minutes for the build. That's it — no environment variables required.

### Why no env vars are needed

`src/lib/db.ts` auto-detects Vercel at cold start:

- `db/custom.db` (the seeded SQLite database) is bundled into the serverless functions via `outputFileTracingIncludes` (see `next.config.ts`).
- On cold start it is copied to `/tmp/custom.db` (the only writable location) and `DATABASE_URL` is pointed there automatically.
- Reads **and** writes therefore work out of the box. The caveat: data written per lambda instance is ephemeral and resets on redeploy/restart.
- You may still set `DATABASE_URL` explicitly in Vercel Project → Settings → Environment Variables to override the default.

> **SQLite on serverless:** for production-scale persistence, swap `src/lib/db.ts` (and `prisma/schema.prisma`) to a hosted provider (Postgres via Prisma Accelerate / Neon / Supabase). Only those two files change; every API route stays identical.

## Project structure

```
├─ prisma/schema.prisma          # 17 models — users, courses, news, resources, AI plans…
├─ scripts/seed.ts               # rich, domain-accurate seed data (60 news articles, 40 resources…)
├─ db/custom.db                  # SQLite database file
├─ public/brand/                 # Niyatee logo & icon set
└─ src/
   ├─ app/
   │  ├─ layout.tsx              # fonts, metadata, SEO
   │  ├─ page.tsx                # the single-route SPA shell
   │  └─ api/                    # 23 API routes (courses, news, AI, auth, …)
   ├─ components/
   │  ├─ app/                    # AppShell, Navbar, Footer, ChatWidget, CartSheet…
   │  ├─ views/                  # 19 SPA views (Home, News, AI Evaluate, Courses…)
   │  ├─ shared/                 # skeletons, badges, section headings
   │  └─ ui/                     # shadcn/ui primitives
   └─ lib/                       # db client, auth (scrypt+sessions), api client, store, format
```

## API overview

`GET /api/courses` · `GET /api/news?month=&year=` · `GET /api/news/monthly` · `GET /api/resources` · `GET /api/rankers` · `GET /api/testimonials` · `GET /api/books` · `GET /api/test-series` · `GET /api/stats` · `GET /api/faq` · `GET /api/plans` · `POST /api/enquiry` · `POST /api/newsletter` · `POST /api/ai/evaluate` · `POST /api/ai/chat` · `POST /api/ai/mcq` · `POST /api/ai/geo-quiz` · `POST /api/auth/register|login|logout` · `GET /api/auth/me` · `GET|POST /api/user/bookmarks` · `POST /api/user/bookmarks/remove`

## Repository & deployment

- **GitHub:** [github.com/infocockroachias/niyateeias](https://github.com/infocockroachias/niyateeias)
- Deploys to Vercel with zero extra configuration (see *Deploying to Vercel* above).

---

© 2026 Niyatee Civil Services Academy, Inn Views, Off Infovalley, Bhubaneswar – 752054 · +91 97776 43159 · info@niyateeias.com
