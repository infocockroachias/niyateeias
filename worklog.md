# Project Worklog — Niyatee IAS Website Rebuild

Project: Full rebuild of https://niyateeias.com/ (Niyatee Civil Services Academy, Bhubaneswar) as a professional, modern Next.js 16 application.
Repo: https://github.com/infocockroachias/niyateeias.git

---

Task ID: 1
Agent: Orchestrator (Z.ai Code)
Task: Investigate niyateeias.com, collect brand identity, research UPSC domain

Work Log:
- Fetched and analyzed https://niyateeias.com/ (home, about-us, courses, news, resources, ai-tools, ai-plans, rankers-list, contact Us)
- Found the current site is a React CRA SPA whose pages /resources, /ai-tools, /ai-plans, /rankers-list render 404/"Whoops" errors without full data — confirms user complaint about broken UX
- Extracted JS bundle routes: /login /register /dashboard /courses /shop /onlinebooks /shopcart /news /resources /ai-tools /ai-plans /test-series /testimonials /practice /upsc-ai-mcq-practice /niyateeaigeomaps /prelimsKey /prelimsDiscussion /about-us /contactform /policies
- Probed their public APIs (api.niyateeias.com) — mostly empty (plans: [], news months with "failed" status). We will seed our own realistic data.
- Downloaded brand assets: LogoN.png (silver "NIYATEE" + gold "IAS" + gold star rising above the "i"), N.png (icon)
- Analyzed CSS: brand colors are Navy #0A1B3D (rgb 10,27,61), darker navy #060F26, Gold #C9A24B (rgb 201,162,75), #D4AA2A, silver/white
- Web-searched UPSC CSE pattern facts and verified structure

Stage Summary — RESEARCH FINDINGS (all agents read this):

## BRAND IDENTITY
- Name: Niyatee Civil Services Academy ("Niyatee IAS")
- नियती (Niyatee) = "Destiny" in Sanskrit. Tagline: "From Aspirations to Achievements"
- Positioning: AI-powered UPSC coaching in Bhubaneswar, Odisha (Eastern India). "Odisha's first AI-integrated IAS coaching institute"
- Colors: NAVY #0A1B3D (primary dark), #060F26 (deepest), GOLD #C9A24B (accent), #D4AA2A (bright gold), ivory/silver backgrounds, white
- Logo files already in /public/brand/: logo.png, favicon.png, icon-192.png, icon-512.png, icon-512.jpg
- Contact: Inn Views, Off Infovalley, Bhubaneswar – 752054 | +91 97776 43159 | info@niyateeias.com | admissions@niyateeias.com | support@niyateeias.com
- Hours: Mon–Sat 9AM–7PM, Sun 10AM–2PM
- Socials: instagram.com/niyateeiasacademy | youtube.com/@NiyateeIASAcademy | x.com/niyateeias | t.me/niyateeias | facebook
- 4-step framework: Learn → Practice → Evaluate → Succeed
- Core values: Excellence, Accessibility, Innovation, Mentorship, Integrity, Service
- Stats: 100+ successful selections, 3 modes of coaching (offline classroom Bhubaneswar, online live, self-paced recorded)

## SITE FEATURES TO REPLICATE (improved)
1. Home — hero, why-us, framework, stats, courses preview, news preview, videos, FAQ, newsletter
2. News / Current Affairs — daily news cards (from The Hindu, Indian Express, PIB), GS-paper tags, calendar month view, monthly PDF downloads, news quiz
3. Resources — 20+ years PYQs with solutions, mentor-approved booklist, GS notes/e-books, UPSC & OPSC answer keys, downloadable
4. AI Tools — AI Mains Answer Evaluation (scored feedback), AI Doubt Agent (chat), AI MCQ Practice (generated quizzes), AI Geography Maps (interactive)
5. AI Plans — subscription pricing (Free / Aspirant / Achiever tiers)
6. Courses — UPSC Foundation (GS Prelims+Mains 12mo), Prelims Target, Mains Answer Writing, Interview Guidance, OPSC; modes offline/online/recorded; batch details, syllabus, fees
7. Rankers List + Testimonials
8. Test Series — Prelims/Mains tests
9. Books Shop — UPSC books
10. Student Portal — login/register/dashboard (my courses, saved notes, quiz history)
11. About Us — story, mission, vision, values, founder message, reasons
12. Contact — enquiry form, counselling booking, FAQ, socials, map

## UPSC DOMAIN FACTS (verified)
- UPSC CSE: 3 stages — Prelims (May/June), Mains (Sept), Personality Test/Interview (Jan–Apr)
- Prelims: GS Paper I (100 Q / 200 marks, negative 1/3rd) + CSAT Paper II (80 Q / 200 marks, qualifying 33%)
- Mains: 9 papers — Essay (250), GS-I~IV (250×4), Optional I&II (250×2) = 1750; qualifying English + Indian Language (300 each, not counted)
- Interview: 275 marks. Grand total 2025
- Eligibility: graduate; age 21–32 general (relaxations OBC 3y, SC/ST 5y); 6 attempts general
- GS syllabus pillars: History (Ancient/Medieval/Modern/World), Geography, Indian Polity & Governance, Economy, Environment & Ecology, Science & Tech, International Relations, Social Issues, Ethics/Integrity (GS-IV), Internal Security, Disaster Mgmt
- Optionals: 48 subjects (Pub Ad, Sociology, Geography, History, Anthro...)
- Services: IAS, IPS, IFS, IRS, IAAS, etc. (~24 Group A services)
- Current affairs sources: The Hindu, Indian Express, PIB, Yojana, Kurukshetra
- OPSC = Odisha Public Service Commission (state CSE equivalent) — relevant since academy is in Odisha

## API CONTRACT (backend agent builds this EXACTLY, frontend consumes this EXACTLY)
Base: /api/*. All JSON. Errors: { error: string } with proper status codes.

- GET  /api/courses → { courses: Course[] }  Course: {id, title, slug, tagline, description, mode("offline"|"online-live"|"recorded"|"hybrid"), duration, feeInr, originalFeeInr|null, features: string[], syllabusHighlights: string[], batchSize, tag("foundation"|"prelims"|"mains"|"interview"|"opsc"|"csat"), featured:boolean, startDate, sessionsPerWeek}
- GET  /api/courses?slug=... → { course } single
- GET  /api/news?month=9&year=2025 → { days: [{date:"2025-09-30", count}], articles: NewsArticle[] }
  NewsArticle: {id, title, summary, content, source("The Hindu"|"Indian Express"|"PIB"|"Yojana"), gsTag("GS1"|"GS2"|"GS3"|"GS4"|"Prelims"|"Essay"), subject, date "YYYY-MM-DD", readMinutes, tags: string[]}
- GET  /api/news/[date] handled via /api/news?date=YYYY-MM-DD → { articles: [...] }
- GET  /api/news/monthly?year=2025 → { months: [{id, month, year, fileName, fileUrl, status}] }
- GET  /api/resources → { resources: Resource[] } grouped by {id, title, category("pyq"|"notes"|"booklist"|"answer-key"|"ebook"|"current-affairs"), exam("UPSC"|"OPSC"|"CSAT"|"Optional"), description, year|null, fileType("pdf"|"docx"|"page"), pages|null, downloads, slug, contentSummary}
- GET  /api/rankers → { rankers: [{id, name, year, rank, service, optional, quote, avatarSeed}] }
- GET  /api/testimonials → { testimonials: [{id, name, batch, role, quote, rating}] }
- GET  /api/books → { books: [{id, title, author, priceInr, mrpInr, category, description, rating, coverColor, slug}] }
- GET  /api/test-series → { series: [{id, title, exam, totalTests, freeTests, priceInr, features: string[], description, slug}] }
- GET  /api/stats → { stats: [{label, value, suffix}] }
- GET  /api/faq → { faqs: [{id, question, answer, category}] }
- POST /api/enquiry {name, email, phone, city?, courseInterest?, mode?, stage?, message} → {ok:true, id}
- POST /api/newsletter {email} → {ok:true}
- GET  /api/plans → { plans: [{id, name, priceInr, period("month"|"year"), tagline, features: string[], highlight:boolean, aiCredits}] }
- AI — POST /api/ai/evaluate {question, answer, paperType?} → {evaluation: {scoreInr0to10, breakdown:{content,structure,analysis,examples,presentation}, strengths:[], improvements:[], modelOutline:[], verdict}}
- AI — POST /api/ai/chat {messages:[{role,content}], context?} → {reply}
- AI — POST /api/ai/mcq {subject, difficulty, count<=5} → {questions:[{id, question, options:[4], correctIndex, explanation, subject}]}
- Auth — POST /api/auth/register {name,email,password} → {user:{id,name,email}} | 409 if exists
- Auth — POST /api/auth/login {email,password} → {user:{id,name,email}} | 401
- Auth — POST /api/auth/logout → {ok:true}
- Auth — GET  /api/auth/me → {user} | {user:null}
- User data — GET /api/user/bookmarks, POST /api/user/bookmarks {resourceId}, DELETE via POST /api/user/bookmarks/remove {resourceId}

## DB SCHEMA (Prisma/SQLite) — backend agent creates
User(passwordHash via node:crypto scrypt), Session(token), Enquiry, NewsletterSubscriber, Course, NewsArticle, MonthlyNewsDigest, Resource, Ranker, Testimonial, Book, TestSeries, Plan, Faq, McqQuestion(stored AI-generated + seeded), QuizAttempt, Bookmark

## DESIGN SYSTEM (frontend agent implements)
- Fonts: Playfair Display (display/serif headings) + Inter (body) via next/font/google
- Light theme premium look: ivory background #FAF7F0-ish via tokens, white cards, navy #0A1B3D headings, gold #C9A24B accents. Dark navy hero sections.
- shadcn/ui components styled via CSS vars in globals.css: --primary: navy, --accent/--secondary: gold
- Sticky footer (min-h-screen flex flex-col + mt-auto), responsive, no blue/indigo defaults, no gradients per modern flat aesthetic (subtle textures ok)
- Custom nav: sticky top, logo (brand/logo.png), links Home/News/Resources/AI Tools dropdown/Courses/Books/Test Series/Rankers/About/Contact, Login button + "Start Learning Free" CTA. Mobile sheet menu.
- Floating WhatsApp/Call/Email buttons bottom-right
- View routing: single-route SPA — a top-level `view` state in Zustand with hash sync (e.g. #/news, #/courses/xyz, #/ai/evaluate). All views rendered by src/app/page.tsx client shell. Views: home, about, news, news-archive, resources, ai-hub, ai-evaluate, ai-chat, ai-mcq, ai-geo, plans, courses, course-detail, rankers, testimonials, books, test-series, contact, login, register, dashboard. Use framer-motion transitions.
- All fetches via TanStack Query or simple useEffect; loading skeletons; toasts via sonner; error states.

---

---
Task ID: 2-a
Agent: Orchestrator (completed backend after subagent partial run)
Task: Backend — Prisma schema, seed data, all API routes, AI endpoints

Work Log:
- Reviewed schema.prisma (complete, per contract) and lib helpers (auth.ts, api-utils.ts, db.ts) from partial agent run
- Wrote scripts/seed.ts with rich domain-accurate data: 10 courses, 60 news articles (45-day window, relative dates), 4 monthly digests, 40 resources, 12 rankers, 12 testimonials, 8 books, 4 test series, 3 plans, 10 FAQs, 42 UPSC-style MCQs
- Fixed apostrophe parsing issues and Prisma spread-key conflicts in seed; seeded successfully
- Created 23 API route files implementing the full contract: courses, news (+monthly +digest placeholder), resources, rankers, testimonials, books, test-series, stats, faq, plans, enquiry, newsletter, ai/evaluate, ai/chat, ai/mcq (z-ai-web-dev-sdk backend-only), auth register/login/logout/me, user bookmarks (+remove)
- Fixed frontend lint errors (ListChecks import, setState-in-effect in NewsView + DashboardView)
- Lint: 0 errors

Stage Summary:
- All APIs verified via curl (200s). DB seeded. AI endpoints return 503 with friendly message when SDK busy.
- Next: browser verification, README/Vercel config, final push.

---
Task ID: 3
Agent: Orchestrator (Z.ai Code)
Task: Browser verification, fixes, deployment readiness

Work Log:
- Fixed stale Turbopack CSS cache (custom brand utilities missing) by restarting dev server — bg-navy/bg-hero-depth/text-ivory/text-gold now compile
- Verified via Agent Browser (desktop 1366px + mobile 390px): Home, News (calendar+article reader), AI Evaluate (real submission scored 3.5-6.0/10 with breakdown bars), AI MCQ (bank questions + instant feedback), AI Chat widget (structured mentor answer), Register → Dashboard (welcome toast, greeting, stats), Contact enquiry (201 + toast), Books cart (qty controls, subtotal ₹974, checkout), Course detail (batch info), Test Series, Plans, Resources filters, Rankers, About, Geography Maps (interactive India SVG)
- Fixed NewsView setState-in-effect (render-adjust pattern) and DashboardView localStorage read (post-paint), patched Sheet aria-describedby
- Lint: 0 errors across src
- Converted .env to portable relative DATABASE_URL, re-pushed schema + seed
- next.config.ts: standalone output only outside Vercel; README with full docs; .env.example

Stage Summary:
- All core flows browser-verified working end-to-end. 3 commits pushed to github.com/infocockroachias/niyateeias (main).
- Known dev-only warnings: Radix aria-controls SSR id mismatch + dialog description warning — cosmetic, no user impact.
