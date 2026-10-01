"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileDown,
  Flame,
  KeyRound,
  ListChecks,
  Newspaper,
  PenLine,
  Radio,
  Search,
  Target,
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
  type MainsPracticeQuestion,
  type NewsArticle,
  type NewsResponse,
  type TodayNewsResponse,
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

function istTimeOf(iso: string): string {
  const d = new Date(iso);
  const ist = new Date(d.getTime() + 5.5 * 3600 * 1000);
  return `${String(ist.getUTCHours()).padStart(2, "0")}:${String(ist.getUTCMinutes()).padStart(2, "0")}`;
}

/* ------------------------- structured exam blocks -------------------------- */

function PrelimsBlock({ points }: { points: string[] }) {
  if (!points.length) return null;
  return (
    <div className="rounded-xl border border-gold-ink/25 bg-gold-soft/40 p-4" data-testid="prelims-points">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7a5c2e]">
        <Target className="h-4 w-4" aria-hidden /> Prelims Points: remember these one-liners
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

function MainsBlock({ points }: { points: string[] }) {
  if (!points.length) return null;
  return (
    <div className="rounded-xl border border-primary/25 bg-primary/5 p-4" data-testid="mains-points">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
        <PenLine className="h-4 w-4" aria-hidden /> Mains Angles: build your answers around these
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

function KeywordsBlock({ keywords }: { keywords: string[] }) {
  if (!keywords.length) return null;
  return (
    <div data-testid="keywords">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7a5c2e]">
        <KeyRound className="h-3.5 w-3.5" aria-hidden /> Keywords for revision
      </p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((k) => (
          <Badge key={k} variant="outline" className="border-secondary/50 bg-secondary/10 text-[#7a5c2e]">
            {k}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function MainsQuestionBlock({ q, title }: { q: MainsPracticeQuestion; title: string }) {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <div className="rounded-xl border border-primary/25 bg-navy p-4 text-ivory sm:p-5" data-testid="mains-question">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold">
        <ListChecks className="h-4 w-4" aria-hidden /> Mains Practice Question
      </p>
      <p className="text-[15px] font-medium leading-relaxed">{q.text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge className="border-gold/40 bg-gold/15 text-[11px] text-gold" variant="outline">
          {q.directive ?? "Answer"} · {q.marks} marks · {q.words} words
        </Badge>
        <Button
          size="sm"
          onClick={() => navigate("ai-evaluate")}
          className="min-h-9 bg-secondary font-semibold text-primary hover:bg-gold-bright"
        >
          <PenLine className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Write &amp; get it evaluated
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-ivory/60">Frame your answer on the Mains angles above, topic: {title.slice(0, 60)}…</p>
    </div>
  );
}

/* ------------------------------ Today's brief ------------------------------ */

function LiveWireStrip({
  live,
}: {
  live: { fetchedAt: string; items: TodayNewsResponse["live"] extends infer T ? (T extends { items: infer U } ? U : never) : never };
}) {
  return (
    <div className="mt-4 rounded-xl border border-ivory/15 bg-navy-800/50 p-4" data-testid="live-wire">
      <p className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
        <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden />
        Live Wire: today&apos;s headlines, fetched fresh
        <span className="ml-auto font-medium normal-case text-ivory/50">updated {istTimeOf(live.fetchedAt)} IST</span>
      </p>
      <ul className="max-h-44 space-y-2 overflow-y-auto pr-1 nice-scroll" aria-label="Live news headlines">
        {live.items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 shrink-0 rounded bg-ivory/10 px-1.5 py-0.5 font-mono text-[10px] text-ivory/70">
              {istTimeOf(it.publishedAt)}
            </span>
            <span className="flex-1 leading-snug text-ivory/85">{it.title}</span>
            <Badge variant="outline" className="shrink-0 border-ivory/25 text-[9px] text-ivory/70">
              {it.gsGuess}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TodayBrief({ onOpen }: { onOpen: (a: NewsArticle) => void }) {
  const { data, isLoading, isError, refetch } = useApi<TodayNewsResponse>("/api/news/today");
  const brief = useMemo(() => pickArray<NewsArticle>(data, "brief"), [data]);
  const live = data?.live ?? null;

  const date = data?.date;
  const dateLabel = useMemo(() => {
    if (!date) return "";
    const d = new Date(`${date}T12:00:00`);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }, [date]);

  if (isLoading) return <ListSkeleton rows={4} />;
  if (isError) return <ErrorCard message="Could not load today's brief." onRetry={() => void refetch()} />;
  if (!brief.length) return null;

  return (
    <section aria-label="Today's current affairs brief" className="mb-10" data-testid="todays-brief">
      <Card className="overflow-hidden border-0 bg-navy text-ivory shadow-xl">
        <CardContent className="p-0">
          {/* masthead */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory/10 bg-navy-800/60 px-5 py-4 sm:px-7">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                <Flame className="h-4 w-4" aria-hidden /> Today&apos;s Brief · Daily Current Affairs
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{dateLabel}</h2>
              <p className="mt-1 text-xs text-ivory/60">
                Structured from today&apos;s editions: {data?.sources.join(" · ")}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="border-gold/40 bg-gold/15 text-xs text-gold" variant="outline">
                {brief.length} exam-ready stories
              </Badge>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {live ? <LiveWireStrip live={live} /> : null}

            {/* brief cards */}
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {brief.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onOpen(a)}
                  aria-label={`Read brief: ${a.title}`}
                  className="group flex h-full flex-col rounded-xl border border-ivory/12 bg-navy-800/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-navy-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full border border-gold/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                      {a.source}
                    </span>
                    <span className="rounded-full bg-ivory/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ivory/80">
                      {a.gsTag}
                    </span>
                    <span className="text-[10px] text-ivory/50">{a.subject}</span>
                  </div>
                  <h3 className="font-display text-[15px] font-semibold leading-snug text-ivory group-hover:text-gold">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-ivory/65">{a.summary}</p>
                  <p className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-ivory/60">
                    {a.prelims?.length ? (
                      <span className="inline-flex items-center gap-1 rounded bg-gold/15 px-1.5 py-0.5 text-gold">
                        <Target className="h-3 w-3" aria-hidden /> {a.prelims.length} Prelims
                      </span>
                    ) : null}
                    {a.mains?.length ? (
                      <span className="inline-flex items-center gap-1 rounded bg-ivory/10 px-1.5 py-0.5">
                        <PenLine className="h-3 w-3" aria-hidden /> {a.mains.length} Mains
                      </span>
                    ) : null}
                    {a.keywords?.length ? (
                      <span className="inline-flex items-center gap-1 rounded bg-ivory/10 px-1.5 py-0.5">
                        <KeyRound className="h-3 w-3" aria-hidden /> {a.keywords.length}
                      </span>
                    ) : null}
                    {a.mainsQuestion ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">
                        <ListChecks className="h-3 w-3" aria-hidden /> Practice Q
                      </span>
                    ) : null}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
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
  const structured =
    (article.prelims?.length ?? 0) > 0 ||
    (article.mains?.length ?? 0) > 0 ||
    (article.keywords?.length ?? 0) > 0 ||
    !!article.mainsQuestion;

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

        {structured ? (
          <div className="mt-6 space-y-4 border-t border-dashed border-border pt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Exam Curation
            </p>
            <PrelimsBlock points={article.prelims ?? []} />
            <MainsBlock points={article.mains ?? []} />
            <KeywordsBlock keywords={article.keywords ?? []} />
            {article.mainsQuestion ? (
              <MainsQuestionBlock q={article.mainsQuestion} title={article.title} />
            ) : null}
          </div>
        ) : null}

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
      toast.info("PDF is being compiled, check back in a day.");
      return;
    }
    toast.success(`Downloading ${m.fileName}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <FileDown className="h-5 w-5 text-gold-ink" aria-hidden />
          Monthly Compilations {year}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          One PDF per month: every curated article, tagged by GS paper. Perfect for revision.
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
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-primary/20 px-3 text-sm font-semibold text-primary transition-colors hover:border-secondary hover:text-gold-ink"
                        aria-label={`Download ${m.fileName}`}
                      >
                        <FileDown className="h-4 w-4" aria-hidden /> PDF
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="min-h-11">
                        <FileDown className="mr-1.5 h-4 w-4" aria-hidden /> PDF
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
          title="Daily Current Affairs for UPSC & OPSC"
          description="Structured every morning from today's The Hindu, Indian Express, PIB and Yojana editions, with Prelims points, Mains angles, keywords and practice questions for every story."
        />

        {/* Today's Brief, structured front page */}
        <TodayBrief onOpen={(a) => setSelectedArticle(a)} />

        {/* Detail overlay panel when an article is selected */}
        {selectedArticle ? (
          <div className="mb-10 grid gap-6">
            <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
          </div>
        ) : null}

        <Separator className="mb-10" />

        {/* Archive */}
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Left: calendar + search + digest */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Archive
            </p>
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
                  Convert today&apos;s reading into Prelims marks: generate an AI quiz from the same topics.
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

          {/* Right: list */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                <CalendarDays className="h-5 w-5 text-gold-ink" aria-hidden />
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
              <ul className="max-h-[42rem] space-y-4 overflow-y-auto pr-1 nice-scroll" aria-label="Article list">
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
                        <p className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium text-primary/80">{a.subject}</span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3 w-3" aria-hidden /> {a.readMinutes} min
                          </span>
                          {a.prelims?.length ? (
                            <span className="inline-flex items-center gap-1 rounded bg-secondary/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#7a5c2e]">
                              <Target className="h-3 w-3" aria-hidden /> {a.prelims.length} Prelims pts
                            </span>
                          ) : null}
                          {a.mainsQuestion ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-600/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                              <ListChecks className="h-3 w-3" aria-hidden /> Practice Q
                            </span>
                          ) : null}
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}

            {!selectedArticle && !isLoading ? (
              <Card className="border-dashed">
                <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 p-8 text-center">
                  <Newspaper className="h-8 w-8 text-muted-foreground/50" aria-hidden />
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Open any article: today&apos;s briefs include Prelims points, Mains angles, keywords
                    and a Mains practice question with one-click AI evaluation.
                  </p>
                  <Button variant="ghost" onClick={() => navigate("resources")} className="min-h-11 text-gold-ink">
                    Looking for PYQs? Open Resources <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
