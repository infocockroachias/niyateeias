"use client";

import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  ListChecks,
  Phone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, useApi, toErrorMessage, type Course } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { fmtDate, inr } from "@/lib/format";
import { ErrorCard, ModeBadge, TagBadge } from "@/components/shared/blocks";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

export function CourseDetailView() {
  const params = useAppStore((s) => s.params);
  const navigate = useAppStore((s) => s.navigate);
  const slug = params.id ?? "";

  const path = useMemo(
    () => (slug ? `/api/courses?slug=${encodeURIComponent(slug)}` : null),
    [slug]
  );
  const { data, isLoading, isError, refetch } = useApi<{ course: Course }>(path, [slug]);

  const course = useMemo<Course | null>(() => {
    if (!data) return null;
    const c = (data as { course?: unknown }).course;
    return c && typeof c === "object" ? (c as Course) : null;
  }, [data]);

  if (!slug) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <ErrorCard message="No course selected. Pick a course from the catalogue." />
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate("courses")} className="min-h-11">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Back to Courses
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-14" aria-busy="true" aria-label="Loading course">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !course) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <ErrorCard message="We couldn't load this course. It may not exist yet." onRetry={() => void refetch()} />
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate("courses")} className="min-h-11">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Back to Courses
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const downloadBrochure = async () => {
    try {
      // Probing the catalogue keeps the demo honest if backend is offline
      await apiGet("/api/courses");
      toast.success(`Brochure for "${course.title}" will be emailed to you. (Demo)`);
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  const enquire = () => {
    navigate("contact", { course: course.title });
  };

  return (
    <section className="py-12" aria-label={`Course details: ${course.title}`}>
      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate("courses")} className="mb-6 min-h-11 -ml-2 text-primary">
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden /> All Courses
        </Button>

        {/* Header */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <ModeBadge mode={course.mode} />
          <TagBadge tag={course.tag} />
          {course.featured ? (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-bold text-primary">Featured</span>
          ) : null}
        </div>
        <h1 className="font-display text-3xl leading-tight text-balance text-primary sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{course.tagline}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-bold text-primary">About this course</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                  <ListChecks className="h-5 w-5 text-secondary" aria-hidden /> Syllabus highlights
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {course.syllabusHighlights.map((s) => (
                    <li key={s} className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-bold text-primary">What&apos;s included</h2>
                <ul className="mt-4 space-y-2.5">
                  {course.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Fee / batch panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-secondary/40 shadow-lg">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Course fee</p>
                <p className="mt-2 font-display text-4xl font-bold text-primary">
                  {inr(course.feeInr)}
                </p>
                {course.originalFeeInr ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="line-through">{inr(course.originalFeeInr)}</span>{" "}
                    <span className="font-semibold text-secondary">
                      save {inr(course.originalFeeInr - course.feeInr)}
                    </span>
                  </p>
                ) : null}

                <ul className="mt-5 space-y-3 border-t border-border pt-5 text-sm text-foreground/85">
                  <li className="flex items-center gap-2.5">
                    <CalendarDays className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    Batch starts {fmtDate(course.startDate)}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock3 className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    {course.duration} · {course.sessionsPerWeek} sessions/week
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    Batch size {course.batchSize}
                  </li>
                </ul>

                <Button onClick={enquire} className="mt-6 min-h-12 w-full bg-secondary font-semibold text-primary hover:bg-gold-bright">
                  Enquire Now <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                </Button>
                <Button onClick={downloadBrochure} variant="outline" className="mt-3 min-h-11 w-full">
                  <Download className="mr-1.5 h-4 w-4" aria-hidden /> Download Brochure
                </Button>
                <a
                  href={SITE.phoneHref}
                  className="mt-4 flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-primary hover:text-secondary"
                >
                  <Phone className="h-4 w-4" aria-hidden /> {SITE.phone}
                </a>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  AI tools included · EMI options available
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-2">
          <div>
            <p className="text-xs text-muted-foreground">{course.duration}</p>
            <p className="font-display text-lg font-bold text-primary">{inr(course.feeInr)}</p>
          </div>
          <Button onClick={enquire} className="min-h-11 flex-1 bg-secondary font-semibold text-primary hover:bg-gold-bright">
            Enquire Now
          </Button>
        </div>
      </div>
    </section>
  );
}
