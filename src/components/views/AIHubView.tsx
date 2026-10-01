"use client";

import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  ListChecks,
  Map as MapIcon,
  MessagesSquare,
  PenLine,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore, type ViewName } from "@/lib/store";
import { AI_TOOLS } from "@/lib/site";
import { FadeIn, SectionHeading } from "@/components/shared/blocks";

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine,
  MessagesSquare,
  ListChecks,
  Map: MapIcon,
};

export function AIHubView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="pb-4">
      {/* Hero band */}
      <section className="bg-navy py-16 text-ivory" aria-label="AI tools introduction">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-gold-ink" aria-hidden />
          <h1 className="font-display text-4xl text-balance sm:text-5xl">
            The <span className="text-gold-ink">Niyatee AI</span> Toolkit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ivory/70">
            Four purpose-built tools (trained on the UPSC pattern, tuned by our mentors) that give
            you examiner-grade feedback and answers around the clock.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-ivory/75">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-gold-ink" aria-hidden /> Free for enrolled students
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-gold-ink" aria-hidden /> No card required to try
            </span>
          </div>
        </div>
      </section>

      {/* Tool cards */}
      <section className="py-16" aria-label="AI tools list">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {AI_TOOLS.map((t, i) => {
              const Icon = TOOL_ICONS[t.icon] ?? Sparkles;
              return (
                <FadeIn key={t.view} delay={i * 0.07}>
                  <Card
                    className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/60 hover:shadow-xl"
                    onClick={() => navigate(t.view as ViewName)}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open ${t.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(t.view as ViewName);
                    }}
                  >
                    <CardContent className="flex h-full gap-5 p-6 sm:p-7">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-7 w-7 text-gold-ink" aria-hidden />
                      </span>
                      <div className="flex-1">
                        <h2 className="font-display text-xl font-bold text-primary">{t.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink">
                          Open tool
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          {/* Plans CTA */}
          <FadeIn delay={0.1}>
            <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-navy p-8 text-ivory sm:flex-row sm:p-10">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold">
                  Need more evaluations &amp; quizzes?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                  Plans scale your AI credits, or get unlimited access included with any classroom
                  course. Registered users start with free credits every month.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("plans")}
                  className="min-h-12 bg-secondary px-6 font-semibold text-primary hover:bg-gold-bright"
                >
                  View AI Plans
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("courses")}
                  className="min-h-12 border-ivory/50 bg-transparent px-6 font-semibold text-ivory hover:bg-ivory/10 hover:text-ivory"
                >
                  Enroll &amp; Get It Free
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
