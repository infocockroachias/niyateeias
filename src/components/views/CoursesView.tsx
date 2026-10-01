"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useApi,
  pickArray,
  type Course,
} from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { fmtDateShort, inr } from "@/lib/format";
import { CardsSkeleton, ErrorCard, FadeIn, ModeBadge, SectionHeading, TagBadge } from "@/components/shared/blocks";
import { cn } from "@/lib/utils";

const TAG_FILTERS = [
  { key: "all", label: "All Courses" },
  { key: "foundation", label: "Foundation" },
  { key: "prelims", label: "Prelims" },
  { key: "mains", label: "Mains" },
  { key: "csat", label: "CSAT" },
  { key: "interview", label: "Interview" },
  { key: "opsc", label: "OPSC" },
] as const;

export function CoursesView() {
  const navigate = useAppStore((s) => s.navigate);
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading, isError, refetch } = useApi<{ courses: Course[] }>("/api/courses");

  const courses = useMemo(() => pickArray<Course>(data, "courses"), [data]);
  const filtered = useMemo(
    () => (filter === "all" ? courses : courses.filter((c) => c.tag === filter)),
    [courses, filter]
  );

  return (
    <section className="py-14" aria-label="Courses">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="UPSC & OPSC Courses for Every Stage"
          description="Offline classroom in Bhubaneswar, live online batches and self-paced recorded programmes, all with AI tools included."
        />

        {/* Filter chips */}
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter courses by tag">
          {TAG_FILTERS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "min-h-11 rounded-full border px-5 py-2 text-sm font-medium transition-all",
                filter === t.key
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <CardsSkeleton count={6} />
        ) : isError ? (
          <ErrorCard message="Could not load courses. The backend may still be waking up." onRetry={() => void refetch()} />
        ) : filtered.length === 0 ? (
          <ErrorCard message="No courses in this category yet, try another filter." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <FadeIn key={c.id} delay={(i % 3) * 0.07}>
                <Card
                  className="group flex h-full cursor-pointer flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/60 hover:shadow-xl"
                  onClick={() => navigate("course-detail", { id: c.slug })}
                  role="link"
                  tabIndex={0}
                  aria-label={`Open course: ${c.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate("course-detail", { id: c.slug });
                  }}
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <ModeBadge mode={c.mode} />
                      <TagBadge tag={c.tag} />
                      {c.featured ? (
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-bold text-primary">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <h2 className="font-display text-xl font-bold leading-snug text-primary">{c.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.tagline}</p>

                    <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                      {c.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5 text-gold-ink" aria-hidden /> {c.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gold-ink" aria-hidden /> {c.batchSize}
                      </span>
                      <span className="col-span-2 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-gold-ink" aria-hidden /> Batch starts {fmtDateShort(c.startDate)} · {c.sessionsPerWeek} sessions/week
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
                      <p className="mt-4 font-display text-2xl font-bold text-primary">
                        {inr(c.feeInr)}
                        {c.originalFeeInr ? (
                          <span className="ml-2 align-middle text-sm font-normal text-muted-foreground line-through">
                            {inr(c.originalFeeInr)}
                          </span>
                        ) : null}
                      </p>
                      <span className="flex items-center gap-1 pt-4 text-sm font-semibold text-gold-ink">
                        Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          Not sure which course fits you?{" "}
          <button
            type="button"
            onClick={() => navigate("contact")}
            className="font-semibold text-gold-ink underline-offset-4 hover:underline"
          >
            Book a free counselling call
          </button>{" "}
         , mentors will map a plan to your attempt year.
        </motion.p>
      </div>
    </section>
  );
}
