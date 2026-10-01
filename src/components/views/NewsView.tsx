"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileDown,
  ListChecks,
  Newspaper,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Markdown from "react-markdown";
import {
  pickArray,
  useApi,
  type MonthlyDigest,
  type NewsArticle,
  type NewsResponse,
} from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { fmtDate, fmtDateShort, MONTH_NAMES } from "@/lib/format";
import { ErrorCard, GsTagBadge, ListSkeleton, SectionHeading, SourceBadge } from "@/components/shared/blocks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function buildWeeks(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: startDay }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/* -------------------------------- Calendar -------------------------------- */

function NewsCalendar({
  year,
  month,
  counts,
  selectedDate,
  onSelect,
  onPrev,
  onNext,
  loading,
}: {
  year: number;
  month: number;
  counts: Map<string, number>;
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
  onPrev: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  const weeks = useMemo(() => buildWeeks(year, month), [year, month]);
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onPrev} aria-label="Previous month" className="min-h-10 min-w-10">
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <p className="font-display text-lg font-bold text-primary" aria-live="polite">
            {MONTH_NAMES[month]} {year}
          </p>
          <Button variant="ghost" size="icon" onClick={onNext} aria-label="Next month" className="min-h-10 min-w-10">
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground" aria-hidden>
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1">{d}</span>
          ))}
        </div>

        <div className={cn("mt-1 grid grid-cols-7 gap-1", loading && "opacity-50")} role="grid" aria-label={`${MONTH_NAMES[month]} ${year} news calendar`}>
          {weeks.flat().map((day, idx) => {
            if (day === null) return <span key={`empty-${idx}`} aria-hidden />;
            const iso = isoDate(year, month, day);
            const count = counts.get(iso) ?? 0;
            const isSelected = selectedDate === iso;
            const isToday = iso === todayIso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelect(isSelected ? null : iso)}
                disabled={loading}
                aria-label={`${day} ${MONTH_NAMES[month]} ${year}${count ? `, ${count} article${count === 1 ? "" : "s"}` : ", no articles"}`}
                aria-pressed={isSelected}
                className={cn(
                  "relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors sm:h-11",
                  isSelected
                    ? "bg-primary font-bold text-primary-foreground"
                    : count > 0
                      ? "bg-secondary/15 font-semibold text-primary hover:bg-secondary/30"
                      : "text-muted-foreground hover:bg-muted"
                )}
              >
                {day}
                {count > 0 && !isSelected ? (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-secondary" aria-hidden />
                ) : null}
                {isToday && !isSelected ? (
                  <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gold/60" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-secondary" aria-hidden />
          Days with a gold dot have curated articles · click to filter
        </p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------- Article detail ----------------------------- */

function ArticleDetail({
  article,
  onClose,
}: {
  article: NewsArticle;
  onClose: () => void;
}) {
  return (
    <Card className="border-secondary/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <SourceBadge source={article.source} />
            <GsTagBadge tag={article.gsTag} />
            <Badge variant="outline" className="text-[11px]">{article.subject}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close article" className="min-h-9 min-w-9 shrink-0">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <h2 className="font-display text-2xl leading-snug text-primary">{article.title}</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {fmtDate(article.date)} · {article.readMinutes} min read
        </p>
        <Separator className="my-4" />
        <p className="text-sm font-medium italic leading-relaxed text-foreground/80">{article.summary}</p>
        <div className="prose-content mt-4 max-w-none text-sm text-foreground/85">
          <Markdown>{article.content ?? ""}</Markdown>
        </div>
        {article.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-4">
            {article.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-[11px]">
                #{t}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

/* ------------------------------ Monthly digest ------------------------------ */

function MonthlyDigestSection({ year }: { year: number }) {
  const { data, isLoading, isError, refetch } = useApi<{ months: MonthlyDigest[] }>(
    `/api/news/monthly?year=${year}`,
    [year]
  );
  const months = useMemo(() => pickArray<MonthlyDigest>(data, "months"), [data]);

  const handleDownload = (m: MonthlyDigest) => {
    if (m.status && m.status.toLowerCase() !== "ready" && m.status.toLowerCase() !== "published") {
      toast.info(`The ${MONTH_NAMES[m.month - 1]} digest is ${m.status}. We'll notify subscribers when it's live.`);
      return;
    }
    if (!m.fileUrl || m.fileUrl === "#") {
      toast.info("PDF is being compiled — check back in a day.");
      return;
    }
    toast.success(`Downloading ${m.fileName}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <FileDown className="h-5 w-5 text-secondary" aria-hidden />
          Monthly Compilations {year}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          One PDF per month — every curated article, tagged by GS paper. Perfect for revision.
        </p>
        {isLoading ? (
          <ListSkeleton rows={3} className="mt-4" />
        ) : isError ? (
          <ErrorCard message="Could not load monthly digests." onRetry={() => void refetch()} className="mt-4" />
        ) : months.length === 0 ? (
          <ErrorCard message={`No compilations published for ${year} yet.`} className="mt-4" />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {months.map((m) => {
              const ready = m.fileUrl && m.fileUrl !== "#";
              return (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {MONTH_NAMES[m.month - 1] ?? `Month ${m.month}`} {m.year}
                    </p>
                    <p className="text-xs text-muted-foreground">{m.fileName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase tracking-wide",
                        m.status?.toLowerCase() === "ready" || m.status?.toLowerCase() === "published"
                          ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {m.status}
                    </Badge>
                    {ready ? (
                      <a
                        href={m.fileUrl}
                        download={m.fileName}
                        onClick={() => handleDownload(m)}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-primary/20 px-3 text-sm font-semibold text-primary transition-colors hover:border-secondary hover:text-secondary"
                        aria-label={`Download ${m.fileName}`}
                      >
                        <Download className="h-4 w-4" aria-hidden /> PDF
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="min-h-11">
                        <Download className="mr-1.5 h-4 w-4" aria-hidden /> PDF
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- View ----------------------------------- */

export function NewsView() {
  const params = useAppStore((s) => s.params);
  const navigate = useAppStore((s) => s.navigate);

  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [search, setSearch] = useState("");

  // Preselect date when arriving via #/news?date=YYYY-MM-DD —
  // adjusted during render (React-endorsed pattern for reacting to prop/store changes).
  const [prevDateParam, setPrevDateParam] = useState<string | undefined>(params.date);
  if (params.date !== prevDateParam) {
    setPrevDateParam(params.date);
    if (params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
      const d = new Date(`${params.date}T00:00:00`);
      if (!Number.isNaN(d.getTime())) {
        setYear(d.getFullYear());
        setMonth(d.getMonth());
        setSelectedDate(params.date);
      }
    }
  }

  const { data, isLoading, isError, refetch, isFetching } = useApi<NewsResponse>(
    `/api/news?month=${month + 1}&year=${year}`,
    [month, year]
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of pickArray<NewsResponse["days"][number]>(data, "days")) {
      map.set(d.date, d.count);
    }
    return map;
  }, [data]);

  const articles = useMemo(() => pickArray<NewsArticle>(data, "articles"), [data]);

  const visible = useMemo(() => {
    let list = articles;
    if (selectedDate) list = list.filter((a) => a.date === selectedDate);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [articles, selectedDate, search]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
    setSelectedArticle(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
    setSelectedArticle(null);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="News Room"
          title="Daily Current Affairs for UPSC & OPSC"
          description="Curated from The Hindu, Indian Express, PIB and Yojana — summarised, GS-tagged and exam-ready every single day."
        />

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Left: calendar + search + digest */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <NewsCalendar
              year={year}
              month={month}
              counts={counts}
              selectedDate={selectedDate}
              onSelect={(d) => {
                setSelectedDate(d);
                setSelectedArticle(null);
              }}
              onPrev={prevMonth}
              onNext={nextMonth}
              loading={isFetching}
            />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, subjects, tags…"
                aria-label="Search articles"
                className="min-h-11 pl-9"
              />
            </div>

            <MonthlyDigestSection year={year} />

            <Card className="bg-navy text-ivory">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Read it. Now test it.</h3>
                <p className="mt-2 text-sm text-ivory/70">
                  Convert today&apos;s reading into Prelims marks — generate an AI quiz from the same topics.
                </p>
                <Button
                  onClick={() => navigate("ai-mcq")}
                  className="mt-4 min-h-11 w-full bg-secondary font-semibold text-primary hover:bg-gold-bright"
                >
                  <ListChecks className="mr-1.5 h-4 w-4" aria-hidden /> Practice News Quiz
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: list + detail */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                <CalendarDays className="h-5 w-5 text-secondary" aria-hidden />
                {selectedDate ? fmtDate(selectedDate) : `All of ${MONTH_NAMES[month]} ${year}`}
              </h2>
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {isLoading ? "Loading…" : `${visible.length} article${visible.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {isError ? (
              <ErrorCard message="The newsroom API didn't respond. Retry in a moment." onRetry={() => void refetch()} />
            ) : isLoading ? (
              <ListSkeleton rows={5} />
            ) : visible.length === 0 ? (
              <ErrorCard
                message={
                  search || selectedDate
                    ? "No articles match this filter. Try another day or clear the search."
                    : "No articles published for this month yet."
                }
              />
            ) : (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <ul className="max-h-[36rem] space-y-4 overflow-y-auto pr-1 nice-scroll" aria-label="Article list">
                  {visible.map((a) => (
                    <li key={a.id}>
                      <Card
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-lg",
                          selectedArticle?.id === a.id && "border-secondary ring-1 ring-secondary/50"
                        )}
                        onClick={() => setSelectedArticle(a)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Read article: ${a.title}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setSelectedArticle(a);
                        }}
                      >
                        <CardContent className="p-4 sm:p-5">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <SourceBadge source={a.source} />
                            <GsTagBadge tag={a.gsTag} />
                            <span className="text-xs text-muted-foreground">{fmtDateShort(a.date)}</span>
                          </div>
                          <h3 className="font-medium leading-snug text-foreground">{a.title}</h3>
                          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                          <p className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-medium text-primary/80">{a.subject}</span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3 w-3" aria-hidden /> {a.readMinutes} min
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>

                <div className="xl:sticky xl:top-24 xl:self-start">
                  {selectedArticle ? (
                    <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex h-full min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
                        <Newspaper className="h-8 w-8 text-muted-foreground/50" aria-hidden />
                        <p className="font-medium text-foreground">Select an article to read</p>
                        <p className="max-w-xs text-sm text-muted-foreground">
                          The full analysis opens here — with GS-paper linkage and keywords for revision.
                        </p>
                        <Button variant="ghost" onClick={() => navigate("resources")} className="min-h-11 text-secondary">
                          Looking for PDFs? Open Resources <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
