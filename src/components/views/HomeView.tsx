 
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  GraduationCap,
  LineChart,
  ListChecks,
  MapPinned,
  MessagesSquare,
  Newspaper,
  PenLine,
  PlayCircle,
  Quote,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  useApi,
  pickArray,
  apiPost,
  toErrorMessage,
  type Course,
  type Faq,
  type NewsResponse,
  type Ranker,
  type Stat,
  type Testimonial,
} from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { inr, fmtDateShort } from "@/lib/format";
import { SITE, AI_TOOLS } from "@/lib/site";
import {
  CardsSkeleton,
  ErrorCard,
  FadeIn,
  GsTagBadge,
  ListSkeleton,
  ModeBadge,
  SectionHeading,
  SourceBadge,
  TagBadge,
} from "@/components/shared/blocks";
import { toast } from "sonner";

/* ---------------------------------- Hero ---------------------------------- */

function Hero() {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <section className="bg-hero-depth text-ivory" aria-label="Introduction">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Copy */}
        <div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-5 border border-gold/40 bg-gold/10 text-gold hover:bg-gold/10">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              {SITE.positioning}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-display text-4xl leading-[1.12] text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            Best UPSC Coaching in Odisha —{" "}
            <span className="text-gold">AI-Powered UPSC Preparation</span> &amp; Expert Mentorship
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg"
          >
            <span className="font-hindi font-bold text-gold" lang="hi">
              नियती
            </span>{" "}
            means <em>Destiny</em> in Sanskrit — and destiny is built, not wished for. A structured
            Learn → Practice → Evaluate → Succeed framework for Prelims, Mains and Interview, now
            supercharged with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate("register")}
              className="min-h-12 bg-secondary px-6 text-base font-semibold text-primary hover:bg-gold-bright"
            >
              Start Learning Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("courses")}
              className="min-h-12 border-ivory/30 bg-transparent px-6 text-base text-ivory hover:bg-white/10 hover:text-ivory"
            >
              Explore Our Courses
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ivory/60"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden /> Offline + Online + Recorded
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden /> Prelims to Interview
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden /> Free AI tools to start
            </span>
          </motion.div>
        </div>

        {/* Visual composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto hidden h-[460px] w-full max-w-md sm:block"
          aria-hidden
        >
          {/* Central logo card */}
          <div className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm">
            <Star className="mx-auto mb-3 h-6 w-6 fill-gold text-gold" />
            <img
              src="/brand/logo.png"
              alt=""
              className="mx-auto h-16 w-auto rounded-lg bg-white/5 p-1.5"
            />
            <p className="mt-4 font-hindi text-2xl font-bold text-gold" lang="hi">
              नियती
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-ivory/60">Destiny</p>
            <p className="mt-3 text-sm font-medium text-ivory/85">{SITE.tagline}</p>
          </div>

          {/* Floating stat cards */}
          <div className="animate-float-slow absolute -top-2 right-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-deep/90 p-4 shadow-xl backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
              <Trophy className="h-5 w-5 text-gold" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-ivory">100+</p>
              <p className="text-xs text-ivory/60">Successful selections</p>
            </div>
          </div>

          <div className="animate-float-slower absolute bottom-14 left-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-deep/90 p-4 shadow-xl backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
              <Users className="h-5 w-5 text-gold" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-ivory">3</p>
              <p className="text-xs text-ivory/60">Modes of coaching</p>
            </div>
          </div>

          <div className="animate-float-slowest absolute bottom-0 right-6 flex items-center gap-3 rounded-2xl border border-gold/30 bg-navy-deep/90 p-4 shadow-xl backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
              <BrainCircuit className="h-5 w-5 text-gold" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ivory">AI-Integrated</p>
              <p className="text-xs text-ivory/60">Ecosystem for UPSC</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------- Trust strip ------------------------------- */

function TrustStrip() {
  const sources = ["The Hindu", "Indian Express", "PIB", "Yojana", "Kurukshetra"];
  return (
    <section className="border-y border-border bg-card" aria-label="News sources">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Daily current affairs curated from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {sources.map((s) => (
            <span key={s} className="font-display text-lg font-semibold text-primary/80">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Framework -------------------------------- */

const FRAMEWORK = [
  {
    step: "01",
    icon: BookOpenCheck,
    title: "Learn",
    text: "Concept-first classes covering the entire GS syllabus with daily current affairs from The Hindu, PIB and Indian Express.",
  },
  {
    step: "02",
    icon: PenLine,
    title: "Practice",
    text: "Daily answer writing, weekly prelims tests and AI-generated MCQ drills tuned to your weak areas.",
  },
  {
    step: "03",
    icon: ClipboardCheck,
    title: "Evaluate",
    text: "AI Mains evaluation scores your answers like a UPSC examiner — content, structure, analysis, examples, presentation.",
  },
  {
    step: "04",
    icon: Target,
    title: "Succeed",
    text: "Personal mentorship, interview guidance boards and a rank-focused revision plan till your name is on the list.",
  },
];

function FrameworkSection() {
  return (
    <section className="py-20" aria-label="Our framework">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Niyatee Method"
          title="A 4-Step Framework That Turns Effort into Ranks"
          description="Most aspirants study hard. Our toppers study in the right sequence — and every stage is measured."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FRAMEWORK.map((f, i) => (
            <FadeIn key={f.step} delay={i * 0.08}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 transition-colors group-hover:bg-secondary/25">
                      <f.icon className="h-6 w-6 text-secondary" aria-hidden />
                    </span>
                    <span className="font-display text-4xl font-bold text-primary/10 transition-colors group-hover:text-secondary/30">
                      {f.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Why Niyatee ------------------------------- */

const WHY = [
  {
    icon: BrainCircuit,
    title: "AI-Integrated Ecosystem",
    text: "Odisha's first institute with AI answer evaluation, a 24×7 doubt agent, adaptive MCQ practice and interactive geography maps.",
  },
  {
    icon: Users,
    title: "Expert Faculty",
    text: "Mentors who have guided 100+ selections, teaching in small batches with personal attention in Bhubaneswar.",
  },
  {
    icon: Compass,
    title: "Prelims-to-Interview Support",
    text: "One roof for the entire journey — GS foundation, CSAT, optional guidance, test series and a mock interview board.",
  },
  {
    icon: LineChart,
    title: "Structured Framework",
    text: "A dated, week-by-week plan with measurable milestones. You always know what to study, revise and write today.",
  },
];

function WhySection() {
  return (
    <section className="bg-muted/50 py-20" aria-label="Why choose Niyatee">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Niyatee"
          title="Coaching That Adapts to You — Not the Other Way Round"
          description="Technology where it helps, mentors where it matters."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <FadeIn key={w.title} delay={i * 0.08}>
              <div className="group h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/50 hover:shadow-lg">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <w.icon className="h-6 w-6 text-gold" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-bold text-primary">{w.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Stats band -------------------------------- */

function StatsBand() {
  const { data, isLoading, isError, refetch } = useApi<{ stats: Stat[] }>("/api/stats");
  const stats = useMemo(() => pickArray<Stat>(data, "stats"), [data]);

  return (
    <section className="bg-navy py-16 text-ivory" aria-label="Academy statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4" aria-hidden>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="mx-auto h-10 w-24 animate-pulse rounded bg-white/10 lg:mx-0" />
                <div className="mx-auto h-4 w-32 animate-pulse rounded bg-white/10 lg:mx-0" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorCard
            message="Stats are temporarily unavailable."
            onRetry={() => void refetch()}
            className="mx-auto max-w-md"
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.07} className="text-center lg:text-left">
                <p className="font-display text-4xl font-bold text-gold sm:text-5xl">
                  {s.value}
                  <span className="text-gold-bright">{s.suffix}</span>
                </p>
                <p className="mt-2 text-sm text-ivory/70">{s.label}</p>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------- Featured courses ----------------------------- */

function FeaturedCourses() {
  const navigate = useAppStore((s) => s.navigate);
  const { data, isLoading, isError, refetch } = useApi<{ courses: Course[] }>("/api/courses");
  const featured = useMemo(() => {
    const all = pickArray<Course>(data, "courses");
    const f = all.filter((c) => c.featured);
    return (f.length > 0 ? f : all).slice(0, 6);
  }, [data]);

  return (
    <section className="py-20" aria-label="Featured courses">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Flagship Programmes"
          title="Courses Built Around the UPSC Calendar"
          description="Foundation, Prelims target, Mains answer writing, Interview guidance and OPSC batches — offline in Bhubaneswar, live online, or self-paced."
        />
        {isLoading ? (
          <CardsSkeleton />
        ) : isError ? (
          <ErrorCard message="Could not load courses." onRetry={() => void refetch()} />
        ) : featured.length === 0 ? (
          <ErrorCard message="No courses published yet — please check back soon." />
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-6">
              {featured.map((c) => (
                <CarouselItem key={c.id} className="pl-6 sm:basis-1/2 lg:basis-1/3">
                  <Card className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <ModeBadge mode={c.mode} />
                        <TagBadge tag={c.tag} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-primary">{c.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.tagline}</p>
                      <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                        {c.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-end justify-between pt-5">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {c.duration} · starts {fmtDateShort(c.startDate)}
                          </p>
                          <p className="mt-1 font-display text-2xl font-bold text-primary">
                            {inr(c.feeInr)}
                            {c.originalFeeInr ? (
                              <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                                {inr(c.originalFeeInr)}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="mt-4 min-h-11 w-full"
                        variant="outline"
                        onClick={() => navigate("course-detail", { id: c.slug })}
                      >
                        View Course <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 lg:-left-4" aria-label="Previous course" />
            <CarouselNext className="right-0 lg:-right-4" aria-label="Next course" />
          </Carousel>
        )}
        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => navigate("courses")} className="min-h-12">
            View All Courses <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ News preview ------------------------------- */

function NewsPreview() {
  const navigate = useAppStore((s) => s.navigate);
  const { data, isLoading, isError, refetch } = useApi<NewsResponse>("/api/news");
  const articles = useMemo(() => pickArray<NewsResponse["articles"][number]>(data, "articles").slice(0, 5), [data]);

  return (
    <section className="bg-muted/50 py-20" aria-label="Latest news">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Current Affairs"
          title="Today's News, UPSC-Ready"
          description="Every day our mentors read The Hindu, Indian Express and PIB so you don't have to — each article is tagged to a GS paper and subject."
        />
        {isLoading ? (
          <ListSkeleton rows={4} />
        ) : isError ? (
          <ErrorCard message="Could not load the latest news." onRetry={() => void refetch()} />
        ) : articles.length === 0 ? (
          <ErrorCard message="No articles published yet — the newsroom is warming up." />
        ) : (
          <div className="grid gap-4">
            {articles.map((a, i) => (
              <FadeIn key={a.id} delay={i * 0.05}>
                <Card
                  className="group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-lg"
                  onClick={() => navigate("news", { date: a.date })}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate("news", { date: a.date });
                  }}
                  aria-label={`Read: ${a.title}`}
                >
                  <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                    <span className="hidden h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-ivory sm:flex" aria-hidden>
                      <Newspaper className="h-5 w-5 text-gold" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <SourceBadge source={a.source} />
                        <GsTagBadge tag={a.gsTag} />
                        <span className="text-xs text-muted-foreground">
                          {fmtDateShort(a.date)} · {a.readMinutes} min read
                        </span>
                      </div>
                      <h3 className="font-medium leading-snug text-foreground group-hover:text-primary">
                        {a.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate("news")} className="min-h-11">
            Open News Room &amp; Calendar <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ AI tools band ------------------------------ */

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine,
  MessagesSquare,
  ListChecks,
  Map: MapPinned,
};

function AIToolsBand() {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <section className="bg-navy py-20 text-ivory" aria-label="AI tools">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="The AI Edge"
          title="Four AI Tools That Study With You"
          description="Free to try for every registered aspirant. Enrolled students get unlimited credits."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AI_TOOLS.map((t, i) => {
            const Icon = TOOL_ICONS[t.icon] ?? Sparkles;
            return (
              <FadeIn key={t.view} delay={i * 0.08}>
                <button
                  type="button"
                  onClick={() => navigate(t.view)}
                  className="group flex h-full min-h-44 w-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:bg-white/10"
                  aria-label={`Open ${t.title}`}
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 transition-colors group-hover:bg-gold/25">
                    <Icon className="h-6 w-6 text-gold" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold text-ivory">{t.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ivory/65">{t.blurb}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-gold">
                    Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </button>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Videos ---------------------------------- */

const VIDEOS = [
  { title: "How to start UPSC preparation from zero — 2026 roadmap", minutes: 18 },
  { title: "Daily current affairs drill: The Hindu in 20 minutes", minutes: 22 },
  { title: "Mains answer writing live: GS-2 Polity demo evaluation", minutes: 31 },
];

function VideosSection() {
  return (
    <section className="py-20" aria-label="Video classes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Watch & Learn"
          title="Free Classes on YouTube"
          description="Strategy sessions, current-affairs drills and live answer evaluations — free on the Niyatee IAS Academy channel."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.08}>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`Watch on YouTube: ${v.title}`}
              >
                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                  <div className="bg-navy relative flex h-44 items-center justify-center" aria-hidden>
                    <span className="absolute inset-0 bg-[radial-gradient(rgba(201,162,75,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
                    <PlayCircle className="h-14 w-14 text-gold transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-ivory">
                      {v.minutes} min
                    </span>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Niyatee IAS Academy</p>
                    <h3 className="mt-1.5 line-clamp-2 font-medium leading-snug text-foreground group-hover:text-primary">
                      {v.title}
                    </h3>
                  </CardContent>
                </Card>
              </a>
            </FadeIn>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild className="min-h-11">
            <a href={SITE.youtube} target="_blank" rel="noopener noreferrer">
              Visit Our YouTube Channel <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Rankers marquee ---------------------------- */

function RankersMarquee() {
  const { data, isLoading, isError } = useApi<{ rankers: Ranker[] }>("/api/rankers");
  const rankers = useMemo(() => pickArray<Ranker>(data, "rankers"), [data]);

  if (isLoading || isError || rankers.length === 0) return null;

  const doubled = [...rankers, ...rankers];
  return (
    <section className="border-y border-border bg-card py-10" aria-label="Our rankers">
      <div className="mx-auto mb-6 flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Trophy className="h-5 w-5 text-secondary" aria-hidden />
        <h2 className="font-display text-xl font-bold text-primary">Proud Niyatee Rankers</h2>
      </div>
      <div className="marquee-paused overflow-hidden" role="marquee" aria-label="Scrolling list of successful candidates">
        <div className="animate-marquee flex w-max gap-4 px-4">
          {doubled.map((r, i) => (
            <div
              key={`${r.id}-${i}`}
              className="flex min-w-64 items-center gap-3 rounded-xl border border-border bg-background p-4"
              aria-hidden={i >= rankers.length}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-[#7a5c2e]" aria-hidden>
                <Trophy className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary">xxxx</p>
                <p className="text-xs text-muted-foreground">
                  AIR xxxx · {r.service} · {r.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Testimonials ------------------------------ */

function TestimonialsSection() {
  const { data, isLoading, isError, refetch } = useApi<{ testimonials: Testimonial[] }>("/api/testimonials");
  const testimonials = useMemo(() => pickArray<Testimonial>(data, "testimonials"), [data]);

  return (
    <section className="bg-muted/50 py-20" aria-label="Student testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Voices of Aspirants"
          title="What Our Students Say"
        />
        {isLoading ? (
          <CardsSkeleton />
        ) : isError ? (
          <ErrorCard message="Could not load testimonials." onRetry={() => void refetch()} />
        ) : testimonials.length === 0 ? (
          <ErrorCard message="No testimonials yet." />
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-6">
              {testimonials.map((t) => (
                <CarouselItem key={t.id} className="pl-6 sm:basis-1/2 lg:basis-1/3">
                  <Card className="flex h-full flex-col">
                    <CardContent className="flex h-full flex-col p-6">
                      <Quote className="mb-4 h-7 w-7 text-secondary/60" aria-hidden />
                      <p className="flex-1 text-sm leading-relaxed text-foreground/85">&ldquo;{t.quote}&rdquo;</p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <p className="text-sm font-bold text-primary">Verified Student</p>
                          <p className="text-xs text-muted-foreground">
                            {t.role} · {t.batch}
                          </p>
                        </div>
                        <div className="flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < Math.round(t.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
                              aria-hidden
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 lg:-left-4" aria-label="Previous testimonial" />
            <CarouselNext className="right-0 lg:-right-4" aria-label="Next testimonial" />
          </Carousel>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */

function FaqSection() {
  const navigate = useAppStore((s) => s.navigate);
  const { data, isLoading, isError, refetch } = useApi<{ faqs: Faq[] }>("/api/faq");
  const faqs = useMemo(() => pickArray<Faq>(data, "faqs").slice(0, 6), [data]);

  return (
    <section className="py-20" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Questions?"
          title="Frequently Asked Questions"
          description="Everything aspirants ask us before joining — fees, modes, batches and the AI ecosystem."
        />
        {isLoading ? (
          <ListSkeleton rows={4} />
        ) : isError ? (
          <ErrorCard message="Could not load FAQs." onRetry={() => void refetch()} />
        ) : faqs.length === 0 ? (
          <ErrorCard message="No FAQs published yet." />
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left text-base font-medium hover:text-primary hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate("contact")} className="min-h-11 text-primary">
            Still curious? Talk to a mentor <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Newsletter + CTA banner -------------------------- */

function CtaBanner() {
  const navigate = useAppStore((s) => s.navigate);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await apiPost("/api/newsletter", { email });
      toast.success("You're in! Weekly current-affairs brief incoming.");
      setEmail("");
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-navy-deep py-20 text-ivory" aria-label="Get started">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <GraduationCap className="mx-auto mb-5 h-10 w-10 text-gold" aria-hidden />
        <h2 className="font-display text-3xl leading-tight text-balance sm:text-4xl">
          Your <span className="text-gold">नियती</span> — your destiny — starts with one decision.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-ivory/70">
          Register free to unlock the AI Doubt Agent, one free Mains evaluation, daily news and a
          mentor call-back within 24 hours.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate("register")}
            className="min-h-12 bg-secondary px-8 text-base font-semibold text-primary hover:bg-gold-bright"
          >
            Start Learning Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("contact")}
            className="min-h-12 border-ivory/30 px-8 text-base text-ivory hover:bg-white/10 hover:text-ivory"
          >
            Book Free Counselling
          </Button>
        </div>

        <form
          onSubmit={subscribe}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          aria-label="Subscribe to newsletter"
        >
          <label htmlFor="home-newsletter" className="sr-only">
            Email address
          </label>
          <Input
            id="home-newsletter"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Get the weekly current-affairs brief"
            className="min-h-12 border-white/20 bg-white/10 text-ivory placeholder:text-ivory/40"
          />
          <Button
            type="submit"
            disabled={busy}
            variant="outline"
            className="min-h-12 shrink-0 border-gold/50 text-gold hover:bg-gold/10 hover:text-gold"
          >
            {busy ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}

/* ---------------------------------- View ----------------------------------- */

export function HomeView() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FrameworkSection />
      <WhySection />
      <StatsBand />
      <FeaturedCourses />
      <NewsPreview />
      <AIToolsBand />
      <VideosSection />
      <RankersMarquee />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
