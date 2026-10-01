"use client";

import { useMemo } from "react";
import { Quote, Star, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApi, pickArray, type Ranker, type Testimonial } from "@/lib/api";
import { CardsSkeleton, ErrorCard, FadeIn, SectionHeading } from "@/components/shared/blocks";

function RankerGroups() {
  const { data, isLoading, isError, refetch } = useApi<{ rankers: Ranker[] }>("/api/rankers");
  const rankers = useMemo(() => pickArray<Ranker>(data, "rankers"), [data]);
  const years = useMemo(() => {
    const set = Array.from(new Set(rankers.map((r) => r.year))).sort((a, b) => b - a);
    return set;
  }, [rankers]);

  return (
    <section className="py-16" aria-label="Rankers list">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Rankers"
          description="Results from Niyatee classrooms, across UPSC CSE and allied services, will be published here as our founding cohorts clear their cycles. Candidate names stay masked as xxxx until officially published."
        />

        {isLoading ? (
          <CardsSkeleton count={6} />
        ) : isError ? (
          <ErrorCard message="Could not load the rankers list." onRetry={() => void refetch()} />
        ) : rankers.length === 0 ? (
          <ErrorCard message="Rankers list is being updated, check back soon." />
        ) : (
          <div className="space-y-14">
            {years.map((year) => (
              <div key={year}>
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-gold" aria-hidden>
                    {year}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-primary">Batch of {year}</h3>
                  <div className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rankers
                    .filter((r) => r.year === year)
                    .sort((a, b) => a.rank - b.rank)
                    .map((r, i) => (
                      <FadeIn key={r.id} delay={(i % 3) * 0.06}>
                        <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-xl">
                          <CardContent className="flex h-full flex-col p-6">
                            <div className="flex items-start justify-between">
                              <Avatar className="h-14 w-14 border-2 border-secondary/40">
                                <AvatarFallback className="bg-primary font-display text-base font-bold text-gold" aria-hidden>
                                  <Trophy className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5">
                                <Trophy className="h-3.5 w-3.5 text-[#7a5c2e]" aria-hidden />
                                <span className="text-xs font-bold text-[#7a5c2e]">AIR xxxx</span>
                              </span>
                            </div>
                            <h4 className="mt-4 font-display text-xl font-bold text-primary">xxxx</h4>
                            <p className="mt-1 text-sm font-medium text-foreground/80">{r.service}</p>
                            <p className="text-xs text-muted-foreground">Optional: {r.optional}</p>
                            {r.quote ? (
                              <blockquote className="mt-4 border-l-2 border-secondary/50 pl-3 text-sm italic leading-relaxed text-muted-foreground">
                                &ldquo;{r.quote}&rdquo;
                              </blockquote>
                            ) : null}
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialsGrid() {
  const { data, isLoading, isError, refetch } = useApi<{ testimonials: Testimonial[] }>("/api/testimonials");
  const testimonials = useMemo(() => pickArray<Testimonial>(data, "testimonials"), [data]);

  return (
    <section className="bg-muted/50 py-16" aria-label="Testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Testimonials from the Classroom"
        />
        {isLoading ? (
          <CardsSkeleton count={6} />
        ) : isError ? (
          <ErrorCard message="Could not load testimonials." onRetry={() => void refetch()} />
        ) : testimonials.length === 0 ? (
          <ErrorCard message="No testimonials yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={t.id} delay={(i % 3) * 0.06}>
                <Card className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex h-full flex-col p-6">
                    <Quote className="mb-3 h-6 w-6 text-gold-ink/60" aria-hidden />
                    <p className="flex-1 text-sm leading-relaxed text-foreground/85">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-sm font-bold text-primary">Verified Student</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role} · {t.batch}
                        </p>
                      </div>
                      <div className="flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={si}
                            className={`h-3.5 w-3.5 ${si < Math.round(t.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
                            aria-hidden
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function RankersView() {
  return (
    <>
      <div className="bg-navy py-14 text-center text-ivory" aria-label="Rankers header">
        <div className="mx-auto max-w-3xl px-4">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-gold" aria-hidden />
          <h1 className="font-display text-4xl text-balance sm:text-5xl">From Our Classrooms to the Merit List</h1>
          <p className="mt-4 text-ivory/70">
            Rankers are not born. They are built by daily answer writing, honest evaluation and
            mentors who refuse to let you slack. Meet ours.
          </p>
        </div>
      </div>
      <RankerGroups />
      <TestimonialsGrid />
    </>
  );
}
