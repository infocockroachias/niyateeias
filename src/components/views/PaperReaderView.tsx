"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Info,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPaper, mapResourceSlug, PYQ_PAPERS, type MainsItem, type Paper, type PrelimsItem } from "@/data/pyq/papers";
import { fmtDate } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { SectionHeading } from "@/components/shared/blocks";
import { cn } from "@/lib/utils";

/* ------------------------------- helpers ---------------------------------- */

const LETTERS = ["A", "B", "C", "D"] as const;

function fmtElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------ paper header ------------------------------ */

function PaperHeader({
  paper,
  legacyYear,
}: {
  paper: Paper;
  legacyYear?: number;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <Card className="border-secondary/40 bg-navy text-ivory">
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold">
          <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1">{paper.exam}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ivory/20 px-2.5 py-1 text-ivory/80">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {fmtDate(paper.heldOn)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ivory/20 px-2.5 py-1 text-ivory/80">
            <Clock3 className="h-3.5 w-3.5" aria-hidden /> {paper.duration}
          </span>
        </div>
        <h1 className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{paper.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ivory/75">
          <span>Max marks: <strong className="text-ivory">{paper.marks}</strong></span>
          <span>Full paper: <strong className="text-ivory">{paper.questionsTotal} questions</strong></span>
          <span>In this reader: <strong className="text-gold">{paper.items.length} questions</strong></span>
          {paper.kind === "prelims" ? <span>Negative marking: {paper.negative}</span> : null}
        </div>
        {legacyYear && legacyYear !== 2026 ? (
          <p className="mt-3 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-ivory/85">
            You opened a <strong>{legacyYear}</strong> archive item — the on-screen reader currently
            carries the <strong>2026</strong> paper series. Use the sources below to reach that year&apos;s
            official paper.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          aria-expanded={showInfo}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-ivory"
        >
          <Info className="h-4 w-4" aria-hidden />
          Instructions & cross-check sources
          <ChevronDown className={cn("h-4 w-4 transition-transform", showInfo && "rotate-180")} aria-hidden />
        </button>
        {showInfo ? (
          <div className="mt-3 space-y-3 rounded-xl border border-ivory/15 bg-navy-800/60 p-4 text-sm">
            <ul className="list-disc space-y-1.5 pl-5 text-ivory/85" aria-label="Instructions">
              {paper.instructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
            <Separator className="bg-ivory/15" />
            <p className="text-xs leading-relaxed text-ivory/65">{paper.note}</p>
            <ul className="flex flex-wrap gap-2" aria-label="Cross-check sources">
              {paper.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ivory/25 px-3 py-1.5 text-xs font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
                  >
                    {s.label} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

/* ------------------------------ prelims mode ------------------------------ */

type PaletteState = "unanswered" | "answered" | "marked";

function PrelimsReader({ items }: { items: PrelimsItem[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const q = items[current];
  const isRevealed = revealed.has(current);
  const chosen = answers[current];

  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    for (const [nStr, opt] of Object.entries(answers)) {
      const item = items[Number(nStr)];
      if (!item) continue;
      if (item.answerIndex === opt) correct++;
      else wrong++;
    }
    return { correct, wrong, answered: Object.keys(answers).length };
  }, [answers, items]);

  const stateOf = (i: number): PaletteState =>
    marked.has(i) ? "marked" : answers[i] !== undefined ? "answered" : "unanswered";

  const select = (optIdx: number) => {
    if (isRevealed) return;
    setAnswers((prev) => ({ ...prev, [current]: optIdx }));
  };

  const reveal = () => {
    setRevealed((prev) => new Set(prev).add(current));
    setRunning(false);
  };

  const reset = () => {
    setAnswers({});
    setRevealed(new Set());
    setMarked(new Set());
    setCurrent(0);
    setElapsed(0);
    setRunning(true);
  };

  const paletteBtn = (item: PrelimsItem, i: number) => {
    const st = stateOf(i);
    const isCurrent = i === current;
    const revealedItem = revealed.has(i);
    const correct = revealedItem && answers[i] === item.answerIndex;
    const wrong = revealedItem && answers[i] !== undefined && answers[i] !== item.answerIndex;
    return (
      <button
        key={item.n}
        type="button"
        onClick={() => setCurrent(i)}
        aria-label={`Question ${item.n}${st !== "unanswered" ? ` (${st})` : ""}`}
        aria-pressed={isCurrent}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all sm:h-10 sm:w-10",
          isCurrent && "ring-2 ring-secondary ring-offset-1 ring-offset-background",
          revealedItem
            ? correct
              ? "bg-emerald-600 text-white"
              : wrong
                ? "bg-red-600 text-white"
                : "bg-muted text-muted-foreground"
            : st === "answered"
              ? "bg-primary text-primary-foreground"
              : st === "marked"
                ? "border-2 border-amber-500 bg-amber-50 text-amber-800"
                : "border border-border bg-card text-foreground/70 hover:border-secondary"
        )}
      >
        {item.n}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* status bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-2 p-4">
          <span className="text-sm font-semibold text-primary">
            Score: {stats.correct} <span className="text-muted-foreground">correct</span> · {stats.wrong}{" "}
            <span className="text-muted-foreground">wrong</span>
          </span>
          <span className="text-sm text-muted-foreground">
            {stats.answered}/{items.length} answered
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary" aria-label={`Time elapsed ${fmtElapsed(elapsed)}`}>
            <Clock3 className="h-4 w-4 text-secondary" aria-hidden /> {fmtElapsed(elapsed)}
          </span>
          <Button variant="outline" size="sm" onClick={reset} className="min-h-10">
            <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden /> Reset
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
        {/* palette */}
        <Card className="lg:sticky lg:top-24 lg:self-start">
          <CardContent className="p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Question palette
            </p>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
              {items.map((item, i) => paletteBtn(item, i))}
            </div>
            <ul className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary" aria-hidden /> Answered</li>
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-amber-500" aria-hidden /> Marked for review</li>
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-600" aria-hidden /> Correct</li>
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-600" aria-hidden /> Wrong</li>
            </ul>
          </CardContent>
        </Card>

        {/* question card */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">Q {q.n}</Badge>
              <Badge variant="outline" className="text-[11px]">{q.topic}</Badge>
              {q.verified2026 ? (
                <Badge className="bg-secondary/15 text-[11px] text-[#7a5c2e]" variant="secondary">
                  ✓ Verified 2026 question{q.sourceRef ? ` · ${q.sourceRef}` : ""}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[11px]">2026-pattern practice</Badge>
              )}
            </div>

            <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground">{q.text}</p>

            <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={`Options for question ${q.n}`}>
              {q.options.map((opt, i) => {
                const isChosen = chosen === i;
                const isCorrect = q.answerIndex === i;
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={isChosen}
                    disabled={isRevealed}
                    onClick={() => select(i)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      isRevealed && isCorrect
                        ? "border-emerald-600 bg-emerald-50"
                        : isRevealed && isChosen && !isCorrect
                          ? "border-red-500 bg-red-50"
                          : isChosen
                            ? "border-secondary bg-secondary/10"
                            : "border-border bg-card hover:border-secondary/60 hover:bg-secondary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        isRevealed && isCorrect
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isRevealed && isChosen && !isCorrect
                            ? "border-red-500 bg-red-500 text-white"
                            : isChosen
                              ? "border-secondary bg-secondary text-primary"
                              : "border-border text-muted-foreground"
                      )}
                      aria-hidden
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1 text-foreground">{opt}</span>
                    {isRevealed && isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden /> : null}
                    {isRevealed && isChosen && !isCorrect ? <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>

            {isRevealed ? (
              <div className="mt-5 rounded-xl border-l-4 border-secondary bg-secondary/5 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#7a5c2e]">
                  Correct answer: {LETTERS[q.answerIndex]}
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">{q.explanation}</p>
              </div>
            ) : null}

            <Separator className="my-5" />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="min-h-11"
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden /> Prev
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setMarked((prev) => {
                    const next = new Set(prev);
                    if (next.has(current)) next.delete(current);
                    else next.add(current);
                    return next;
                  })
                }
                className={cn("min-h-11", marked.has(current) && "border-amber-500 text-amber-700")}
              >
                <Flag className="mr-1.5 h-4 w-4" aria-hidden />
                {marked.has(current) ? "Marked" : "Mark for review"}
              </Button>
              <Button onClick={reveal} disabled={isRevealed} className="min-h-11 bg-primary text-gold hover:bg-navy-800">
                <Eye className="mr-1.5 h-4 w-4" aria-hidden /> Reveal answer
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrent((c) => Math.min(items.length - 1, c + 1))}
                disabled={current === items.length - 1}
                className="ml-auto min-h-11"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------- mains mode ------------------------------ */

function MainsReader({ items }: { items: MainsItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const navigate = useAppStore((s) => s.navigate);

  const toggle = (n: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  return (
    <div className="space-y-4">
      {items.map((q) => (
        <Card key={q.n}>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">Q {q.n}</Badge>
              <Badge className="bg-secondary/15 text-[11px] text-[#7a5c2e]" variant="secondary">
                {q.directive} · {q.marks} marks · {q.wordLimit} words
              </Badge>
              <Badge variant="outline" className="text-[11px]">{q.syllabusTag}</Badge>
              {q.verified2026 ? (
                <Badge variant="secondary" className="text-[11px]">
                  ✓ Verified 2026{q.sourceRef ? ` · ${q.sourceRef}` : ""}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[11px]">2026-pattern practice</Badge>
              )}
            </div>
            <p className="text-[15px] leading-relaxed text-foreground">{q.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => toggle(q.n)}
                aria-expanded={open.has(q.n)}
                className="min-h-11"
              >
                <ChevronDown className={cn("mr-1.5 h-4 w-4 transition-transform", open.has(q.n) && "rotate-180")} aria-hidden />
                Model outline
              </Button>
              <Button
                onClick={() => navigate("ai-evaluate")}
                className="min-h-11 bg-primary text-gold hover:bg-navy-800"
              >
                <FileText className="mr-1.5 h-4 w-4" aria-hidden /> Evaluate my answer
              </Button>
            </div>
            {open.has(q.n) ? (
              <div className="mt-4 rounded-xl border-l-4 border-secondary bg-secondary/5 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#7a5c2e]">Model outline</p>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
                  {q.modelOutline.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------ paper picker ------------------------------ */

function PaperPicker() {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <div>
      <SectionHeading
        align="left"
        eyebrow="PYQ Library · On-Screen"
        title="UPSC CSE 2026 — Digital Question Papers"
        description="Read Prelims and Mains 2026 papers right here — practice MCQs with instant reveal & explanations, mains questions with model outlines. No downloads."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PYQ_PAPERS.map((p) => (
          <Card
            key={p.slug}
            className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-lg"
          >
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-3 flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5" aria-hidden>
                  <BookOpenText className="h-5 w-5 text-primary" />
                </span>
                <Badge variant={p.kind === "prelims" ? "default" : "secondary"} className="text-[10px] uppercase">
                  {p.kind === "prelims" ? "Prelims · MCQ" : `Mains · ${"paperTag" in p ? p.paperTag : ""}`}
                </Badge>
              </div>
              <h3 className="font-display text-lg font-bold leading-snug text-primary">{p.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                {fmtDate(p.heldOn)} · {p.duration} · {p.marks} marks · {p.items.length} questions in reader
              </p>
              <Button
                onClick={() => navigate("pyq-reader", { slug: p.slug })}
                className="mt-4 min-h-11 w-full"
              >
                <BookOpenText className="mr-1.5 h-4 w-4" aria-hidden /> Read on screen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- view ---------------------------------- */

export function PaperReaderView() {
  const params = useAppStore((s) => s.params);
  const navigate = useAppStore((s) => s.navigate);

  const { paper, legacyYear } = useMemo(() => {
    if (!params.slug) return { paper: undefined as Paper | undefined, legacyYear: undefined as number | undefined };
    const mapped = mapResourceSlug(params.slug, params.year ? Number(params.year) : null);
    return { paper: getPaper(mapped.paper), legacyYear: mapped.legacyYear };
  }, [params.slug, params.year]);

  if (!paper) return <PaperPicker />;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("pyq-reader")}
          className="mb-4 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> All 2026 papers
        </button>

        <PaperHeader paper={paper} legacyYear={legacyYear} />

        <div className="mt-6">
          {paper.kind === "prelims" ? <PrelimsReader items={paper.items} /> : <MainsReader items={paper.items} />}
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <BookOpenText className="h-4 w-4 text-secondary" aria-hidden />
          Cross-check with the free official &amp; coaching sources above · papers also listed in{" "}
          <button type="button" onClick={() => navigate("resources")} className="font-semibold text-secondary hover:underline">
            Resources
          </button>
        </p>
      </div>
    </div>
  );
}
