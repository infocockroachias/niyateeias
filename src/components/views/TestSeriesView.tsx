"use client";

import { useMemo } from "react";
import { ArrowRight, CheckCircle2, FileQuestion, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApi, pickArray, type TestSeries } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { CardsSkeleton, ErrorCard, FadeIn, SectionHeading } from "@/components/shared/blocks";

export function TestSeriesView() {
  const navigate = useAppStore((s) => s.navigate);
  const { data, isLoading, isError, refetch } = useApi<{ series: TestSeries[] }>("/api/test-series");
  const series = useMemo(() => pickArray<TestSeries>(data, "series"), [data]);

  const enroll = (s: TestSeries) => {
    navigate("contact", { course: s.title });
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Prelims & Mains Test Series"
          description="Exam-day simulation with All-Odisha ranking, detailed solutions and AI-assisted copy evaluation for Mains."
        />

        {isLoading ? (
          <CardsSkeleton count={3} />
        ) : isError ? (
          <ErrorCard message="Could not load test series." onRetry={() => void refetch()} />
        ) : series.length === 0 ? (
          <ErrorCard message="No test series published yet. The question bank team is at work." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {series.map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.08}>
                <Card className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/60 hover:shadow-xl">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-[11px] font-semibold">{s.exam}</Badge>
                      {s.freeTests > 0 ? (
                        <span className="flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-bold text-[#7a5c2e]">
                          <Gift className="h-3 w-3" aria-hidden /> {s.freeTests} free test{s.freeTests === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="font-display text-xl font-bold leading-snug text-primary">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>

                    <div className="mt-4 flex items-center gap-4 rounded-lg bg-muted/60 p-3 text-sm">
                      <span className="flex items-center gap-1.5 font-semibold text-primary">
                        <FileQuestion className="h-4 w-4 text-gold-ink" aria-hidden />
                        {s.totalTests} tests
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto border-t border-border pt-5">
                      <div className="flex items-baseline justify-between">
                        <p className="font-display text-3xl font-bold text-primary">{inr(s.priceInr)}</p>
                        <Button onClick={() => enroll(s)} className="min-h-11 bg-secondary font-semibold text-primary hover:bg-gold-bright">
                          Enroll <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Includes detailed solutions &amp; performance analytics.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
