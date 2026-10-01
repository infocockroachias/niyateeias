<div align="center">

# नियती — Niyatee IAS

**Best UPSC Coaching in Odisha — AI-Powered UPSC Preparation & Expert Mentorship**

A complete rebuild of [niyateeias.com](https://niyateeias.com) — the digital home of **Niyatee Civil Services Academy, Bhubaneswar** — as a modern, fast, professional Next.js application.

*नियती (Niyatee) means **Destiny** in Sanskrit. From Aspirations to Achievements.*

</div>

---

## About the project

Niyatee Civil Services Academy is Eastern India's emerging IAS academy and **Odisha's first AI-integrated UPSC coaching institute**. This repository rebuilds the academy's web platform with the same feature set as the original site — news, resources, AI tools, courses, plans and a student portal — redesigned from the ground up for correct functionality, clean UI/UX and a professional visual identity rooted in the brand (navy `#0A1B3D`, gold `#C9A24B`, silver-paper `#F4F5F7`). Results language is kept honest: the academy is new, so no selection claims are made anywhere.

## Features

| Area | What you get |
| --- | --- |
| **Home** | Brand hero, 4-step framework (Learn → Practice → Evaluate → Succeed), live stats, featured courses, today's news, AI tools showcase, rankers marquee, testimonials, FAQ, newsletter |
| **News / Current Affairs** | **Today's Brief** — a structured daily front page: 12+ exam-ready stories from today's editions, each with **Prelims Points, Mains Angles, Keywords and a Mains Practice Question** (one-click AI evaluation). Plus a **Live Wire** of fresh headlines fetched server-side from The Hindu RSS wires on every visit, interactive month calendar, full article reader with exam curation, and monthly digest downloads |
| **Resources** | **100% on-screen** — no downloads. A digital **Paper Reader** for UPSC CSE 2026 (Prelims GS1 & CSAT, Mains Essay/GS1–GS4) with verified 2026 questions (cross-checked against freely available solutions), practice items modelled on the 2026 pattern, answer-reveal + explanations, question palette with timer, and Mains model outlines. Plus 20+ years of PYQ archives, GS notes, booklists, answer keys, e-books with filters and bookmarks |
| **AI Tools** | ① **AI Mains Answer Evaluation** — UPSC-rubric scoring (content, structure, analysis, examples, presentation) with model outlines. ② **AI Doubt Agent** — 24×7 UPSC-aware mentor chat backed by a **curated 59-topic knowledge base (RAG-style)**: answers are grounded in stored exam-grade content and **never dead-end** — when the LLM network is unavailable (e.g. on serverless hosts) the agent composes structured answers offline from the knowledge base. ③ **AI MCQ Practice** — Prelims-style quizzes with instant explanations (seeded bank + AI generation). ④ **Interactive Geography Maps** — interactive 3D AI Geo Maps — a 3D world globe with 130+ UPSC-curated locations (places in news, rivers, ranges, straits, ports, dams, heritage, ecology), layers, search, fly-to and an AI map quiz |
| **AI Plans** | Explorer (free) / Aspirant / Achiever subscription tiers |
| **Courses** | 10 programmes across UPSC & OPSC — GS Foundation (offline / live online / recorded), Prelims Target, CSAT Bootcamp, Mains Answer Writing, Ethics & Essay, Interview Guidance, OPSC OCS, Sociology optional — with filters, detail pages and enquiry CTAs |
| **Books Shop** | Niyatee Press titles with ratings, discounts and a working cart |
| **Test Series** | Prelims / CSAT / Mains / OPSC series cards |
| **Rankers & Testimonials** | Results wall grouped by year (names masked as xxxx until officially published) + student voices |
| **Student Portal** | Register / login with secure sessions, dashboard with bookmarks and quiz analytics |
| **Contact** | Enquiry form (validated + captured in memory), counselling CTA, socials, newsletter |

## Tech stack

- **Framework** — Next.js 16 (App Router), React 19, TypeScript
- **Styling** — Tailwind CSS 4 + shadcn/ui (New York), custom navy/gold design tokens, **Cabinet Grotesk + Satoshi + Noto Sans Devanagari** (self-hosted via `next/font/local`, see `src/fonts/`)
- **Design system** — see [`DESIGN.md`](./DESIGN.md): typography roles, AA contrast rules, motion curve, anti-slop copy rules (zero em-dashes, no eyebrow labels, no invented claims)
- **Data layer** — in-memory content library (`src/data/content.ts`) + module-level runtime store (`src/lib/mem-store.ts`): zero database, zero external services, serverless-safe by design
- **State** — Zustand (SPA view routing via hash + cart + auth state), TanStack Query (server data)
- **AI** — `z-ai-web-dev-sdk` (server-side, optional) powering evaluation, chat and MCQ generation; every AI route has a deterministic offline fallback (curated knowledge base / rubric evaluator / local quiz) so nothing 503s when the AI service is absent
- **Motion** — Framer Motion page transitions and micro-interactions

## Fonts & licenses

Cabinet Grotesk and Satoshi are by the **Indian Type Foundry**, used under the ITF Free Font License via Fontshare (free for personal and commercial use). The woff2 files are self-hosted in `src/fonts/` so the site has no runtime font-CDN dependency.

## Getting started

```bash
# 1. Install dependencies
bun install        # or: npm install

# 2. Start the dev server — no env vars, no database setup needed
bun run dev        # http://localhost:3000
```

The entire content library (courses, news archive, resources, PYQ papers, book shop, plans, FAQs, MCQ bank) is frozen into `src/data/content.ts`. To edit content, change `scripts/seed.ts` and re-freeze:

```bash
bun run db:push && bun run scripts/seed.ts   # optional: rebuild the local SQLite source
bun run scripts/dump-content.ts              # re-freeze seed data into src/data/content.ts
```

Production build:

```bash
bun run build
bun run start
```

## Environment variables

None required. The app runs entirely on in-memory data with no database and no external API keys. AI features (mentor chat, answer evaluation, MCQ/map-quiz generation) call the AI SDK when available and fall back to their offline equivalents otherwise.

## Deploying to Vercel

The project is Vercel-ready and **zero-config**:

1. Push this repository to GitHub (already done — see below).
2. In Vercel, **Add New → Project** and import the repo (`infocockroachias/niyateeias`, branch `main`).
3. On the import screen you'll see the project settings (name, root directory `./`, framework preset **Next.js** auto-detected) — scroll down and click **Deploy** (Vercel labels this final button "Deploy"; in some UI versions it appears as "Create Project" — that click both creates the project and starts the first deployment).
4. Wait ~1–2 minutes for the build. That's it — no environment variables, no database, no setup.

### Why it just works on serverless

Vercel functions cannot host a SQLite file (read-only filesystem, ephemeral `/tmp`), so the platform was redesigned to be **stateless**:

- All read-only content (courses, news, briefs, resources, PYQs, books, plans, FAQs, stats, the MCQ bank) is served straight from the in-memory library in `src/data/content.ts` — no DB calls anywhere.
- Write features (enquiries, newsletter signups, student accounts, bookmarks, freshly generated MCQs) persist in the per-instance memory store `src/lib/mem-store.ts`; they reset on redeploy, which is expected for a demo deployment.
- AI routes import the AI SDK dynamically and degrade gracefully: the Doubt Agent answers from the curated knowledge base, the evaluator uses a deterministic GS-rubric scorer, the geo quiz serves a locally generated set.

> **Production persistence:** when real storage is needed, swap `src/lib/mem-store.ts` for a hosted store (Postgres / Upstash / Prisma Postgres). The API contracts stay identical — only that one module changes.

## Project structure

```
├─ scripts/seed.ts               # seed data source (edit here, then re-freeze)
├─ scripts/dump-content.ts       # freezes seed data into src/data/content.ts
├─ src/data/content.ts           # THE content library — served from memory
├─ src/lib/mem-store.ts          # runtime in-memory store (enquiries, auth, bookmarks)
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

`GET /api/courses` · `GET /api/news?month=&year=` · **`GET /api/news/today`** (structured brief + live RSS wire) · `GET /api/news/monthly` · **`GET /api/ai/chat?q=`** (offline knowledge-base answers) · `GET /api/resources` · `GET /api/rankers` · `GET /api/testimonials` · `GET /api/books` · `GET /api/test-series` · `GET /api/stats` · `GET /api/faq` · `GET /api/plans` · `POST /api/enquiry` · `POST /api/newsletter` · `POST /api/ai/evaluate` · `POST /api/ai/chat` · `POST /api/ai/mcq` · `POST /api/ai/geo-quiz` · `POST /api/auth/register|login|logout` · `GET /api/auth/me` · `GET|POST /api/user/bookmarks` · `POST /api/user/bookmarks/remove`

## Repository & deployment

- **GitHub:** [github.com/infocockroachias/niyateeias](https://github.com/infocockroachias/niyateeias)
- Deploys to Vercel with zero extra configuration (see *Deploying to Vercel* above).

---

© 2026 Niyatee Civil Services Academy, Inn Views, Off Infovalley, Bhubaneswar – 752054 · +91 97776 43159 · info@niyateeias.com
