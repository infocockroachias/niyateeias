"use client";

import { motion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Compass,
  HeartHandshake,
  Lightbulb,
  Mail,
  MapPin,
  Medal,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, SectionHeading } from "@/components/shared/blocks";
import { useAppStore } from "@/lib/store";
import { SITE } from "@/lib/site";

/* ---------------------------------- Story ---------------------------------- */

function Story() {
  return (
    <section className="py-20" aria-label="Our story">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <FadeIn>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Our Story</p>
          <h1 className="font-display text-4xl leading-tight text-balance text-primary sm:text-5xl">
            नियती — <span className="text-secondary">Destiny</span>, Built One Answer at a Time
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              In Sanskrit, <span className="font-hindi font-bold text-primary" lang="hi">नियती</span> means
              <em> destiny</em>. We founded Niyatee Civil Services Academy in Bhubaneswar on a simple
              conviction: a career in civil services should not depend on the pin code you were born
              with. Eastern India&apos;s brightest minds deserved a coaching institute that matched —
              and beat — what Delhi offered.
            </p>
            <p>
              What began as a small classroom of determined aspirants has grown into{" "}
              {SITE.positioning} — with 100+ selections, three modes of learning (offline classroom,
              online live, and self-paced recorded), and an AI-integrated ecosystem that evaluates
              answers, resolves doubts at 2 AM and generates personalised MCQ drills.
            </p>
            <p>
              From aspirations to achievements — every batch, every test, every mentorship call moves
              our students one answer closer to their destiny.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button onClick={() => useAppStore.getState().navigate("courses")} className="min-h-11">
              Explore Courses <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Button>
            <Button variant="outline" onClick={() => useAppStore.getState().navigate("contact")} className="min-h-11">
              Visit Our Campus
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="relative rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="absolute -top-5 left-8 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Founder&apos;s Message
            </div>
            <Quote className="mt-2 h-8 w-8 text-secondary/50" aria-hidden />
            <blockquote className="mt-4 space-y-4 font-display text-lg leading-relaxed text-foreground/90">
              <p>
                &ldquo;I have sat across hundreds of aspirants who had the talent of a topper and the
                confidence of a beginner. The difference was never intelligence — it was structure,
                feedback and belief. Niyatee exists to give you all three.&rdquo;
              </p>
              <p className="text-base text-muted-foreground">
                We built our AI tools for one reason: you should get examiner-grade feedback on every
                single answer you write, not just the few a human mentor can read each week. Pair that
                with mentors who know your name, and the distance between you and the merit list
                becomes a matter of time — not luck.
              </p>
            </blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-gold" aria-hidden>
                N
              </span>
              <div>
                <p className="font-semibold text-primary">Team Niyatee</p>
                <p className="text-xs text-muted-foreground">Founder &amp; Mentor Group, Bhubaneswar</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------ Mission/Vision ------------------------------ */

function MissionVision() {
  return (
    <section className="bg-navy py-20 text-ivory" aria-label="Mission and vision">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8"
        >
          <Compass className="h-9 w-9 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-2xl font-bold">Our Mission</h2>
          <p className="mt-3 leading-relaxed text-ivory/75">
            To make civil-services preparation structured, measurable and affordable for every
            aspirant of Eastern India — combining rigorous classroom mentorship with AI tools that
            give examiner-grade feedback on every attempt.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-gold/30 bg-gold/10 p-8"
        >
          <Star className="h-9 w-9 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-2xl font-bold">Our Vision</h2>
          <p className="mt-3 leading-relaxed text-ivory/75">
            A generation of officers from Odisha and beyond who serve with integrity — and a coaching
            institute trusted as the first choice for UPSC and OPSC preparation in the region.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- Core values ------------------------------- */

const VALUES = [
  { icon: Medal, title: "Excellence", text: "Every class, test and evaluation is benchmarked to the UPSC standard — never diluted." },
  { icon: Accessibility, title: "Accessibility", text: "Affordable fees, scholarships and three learning modes so no aspirant is left behind." },
  { icon: Lightbulb, title: "Innovation", text: "Eastern India's first AI-integrated ecosystem — we build tools, not excuses." },
  { icon: HeartHandshake, title: "Mentorship", text: "Small batches, named mentors and honest feedback — you are a person, not a roll number." },
  { icon: ShieldCheck, title: "Integrity", text: "No fake results, no inflated promises. Our rankers' list is verifiable, always." },
  { icon: Users, title: "Service", text: "We exist to build officers who serve the nation — and citizens who understand it." },
];

function CoreValues() {
  return (
    <section className="py-20" aria-label="Core values">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Stand For"
          title="Six Core Values, Zero Compromises"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.06}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-lg">
                <CardContent className="flex h-full gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                    <v.icon className="h-6 w-6 text-secondary" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- 5 reasons -------------------------------- */

const REASONS = [
  {
    title: "Expert Faculty Who Know Your Name",
    text: "Small batches mean every mentor tracks your progress sheet — your weak topics become next week's revision plan.",
  },
  {
    title: "Structured Learning, Dated to the Exam",
    text: "Our syllabus is reverse-engineered from the UPSC calendar: Prelims in May, Mains in September — every week has a milestone.",
  },
  {
    title: "AI-Powered Tools, Free for Students",
    text: "Mains answer evaluation, 24×7 doubt agent, adaptive MCQs and interactive geography maps — included with enrolment.",
  },
  {
    title: "Personal Mentorship Till Interview",
    text: "One-on-one mentor calls, DAF-based interview panels and psychological preparation for the Personality Test.",
  },
  {
    title: "Affordable & Local",
    text: "Delhi-level coaching at Bhubaneswar costs — no relocation, no hostel burden, family close by, fees within reach.",
  },
];

function Reasons() {
  return (
    <section className="bg-muted/50 py-20" aria-label="Why aspirants choose Niyatee">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Honest Pitch"
          title="5 Reasons Aspirants Choose Niyatee"
        />
        <ol className="space-y-4">
          {REASONS.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.06}>
              <li className="flex gap-5 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-gold" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-primary">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------- Address card ------------------------------- */

function VisitCard() {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <section className="py-20" aria-label="Visit us">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="bg-navy p-8 text-ivory lg:p-10">
              <Award className="h-8 w-8 text-gold" aria-hidden />
              <h2 className="mt-4 font-display text-2xl font-bold">Visit the Campus</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                Walk in for a free counselling session, sit through a demo class and meet your future
                mentors. No appointment needed — though a call helps us keep tea ready.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ivory/85">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {SITE.address}
                </li>
                <li>
                  <a href={SITE.phoneHref} className="flex min-h-9 items-center gap-3 hover:text-gold">
                    <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden /> {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={SITE.emailHref} className="flex min-h-9 items-center gap-3 hover:text-gold">
                    <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden /> {SITE.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {SITE.hours}
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 bg-muted/40 p-8 lg:p-10">
              <BookOpen className="h-10 w-10 text-secondary" aria-hidden />
              <p className="text-center font-display text-xl font-bold text-primary">
                The best time to start was last year. The second-best time is today.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => navigate("contact")} className="min-h-11">
                  Book Free Counselling
                </Button>
                <Button variant="outline" onClick={() => navigate("rankers")} className="min-h-11">
                  Meet Our Rankers
                </Button>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden /> Free AI tools included with every registration
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function AboutView() {
  return (
    <>
      <Story />
      <MissionVision />
      <CoreValues />
      <Reasons />
      <VisitCard />
    </>
  );
}
