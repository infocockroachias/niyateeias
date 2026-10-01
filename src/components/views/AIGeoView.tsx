"use client";

/**
 * AI Geo Maps — Interactive 3D World Atlas.
 *
 * Left: a globe.gl 3D world globe (GlobeMap) with category layers, search and
 * fly-to. Right: an explorer panel (list + location detail) or the AI Map Quiz.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Flame,
  Info,
  ListChecks,
  MapPin,
  MousePointerClick,
  Pause,
  Play,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading, TagBadge } from "@/components/shared/blocks";
import { GlobeMap } from "@/components/geo/GlobeMap";
import {
  GEO_CATEGORIES,
  GEO_ITEMS,
  getCategory,
  haversineKm,
  pointItems,
  searchGeoItems,
  type GeoCategoryKey,
  type GeoItem,
} from "@/lib/geo-data";
import { cn } from "@/lib/utils";

/* ------------------------------- quiz types -------------------------------- */

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  locationId?: string;
  /** client-fallback questions are answered purely by clicking an option */
  mcqOnly?: boolean;
}

type QuizResult =
  | { kind: "bullseye"; distanceKm: number; clickedNear?: string }
  | { kind: "close"; distanceKm: number; clickedNear?: string }
  | { kind: "wrong"; distanceKm?: number; clickedNear?: string }
  | { kind: "correct" }
  | { kind: "wrong-option" };

const QUIZ_COUNT = 6;
const BULLSEYE_KM = 1200;
const CLOSE_KM = 3000;

const CATEGORY_COUNTS: Record<string, number> = Object.fromEntries(
  GEO_CATEGORIES.map((c) => [c.key, GEO_ITEMS.filter((i) => i.category === c.key).length])
);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtKm(km: number): string {
  return `${Math.round(km).toLocaleString("en-IN")} km`;
}

/* Client-side fallback quiz — a simple multiple-choice round. */
function buildFallbackQuiz(active: Set<GeoCategoryKey>): QuizQuestion[] {
  const inScope = GEO_ITEMS.filter((i) => active.has(i.category));
  const poolPoints = inScope.filter((i) => i.kind === "point");
  const source = poolPoints.length >= QUIZ_COUNT ? poolPoints : pointItems();

  const allRegions = Array.from(
    new Set(pointItems().map((i) => i.region).filter((r): r is string => Boolean(r)))
  );

  return shuffle(source)
    .slice(0, QUIZ_COUNT)
    .map((item) => {
      if (item.region && allRegions.length >= 4) {
        const distractors = shuffle(allRegions.filter((r) => r !== item.region)).slice(0, 3);
        const options = shuffle([item.region, ...distractors]);
        return {
          id: `fb-${item.id}`,
          question: `Where on the map is "${item.name}"?`,
          options,
          correctIndex: options.indexOf(item.region),
          explanation: `${item.name}, ${item.facts[0] ?? "Key UPSC map location."}`,
          locationId: item.id,
          mcqOnly: true,
        };
      }
      /* category fallback for items without a region */
      const cat = getCategory(item.category);
      const otherCats = shuffle(GEO_CATEGORIES.filter((c) => c.key !== item.category)).slice(0, 3);
      const options = shuffle([cat.label, ...otherCats.map((c) => c.label)]);
      return {
        id: `fb-${item.id}-c`,
        question: `"${item.name}" belongs to which AI Geo Maps layer?`,
        options,
        correctIndex: options.indexOf(cat.label),
        explanation: `${item.name} is filed under ${cat.label}. ${item.facts[0] ?? ""}`,
        locationId: item.id,
        mcqOnly: true,
      };
    });
}

/* ---------------------------------- view ----------------------------------- */

/* Normalize a name for fuzzy matching ("Bab el-Mandeb" → "babelmandeb"). */
const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Resolve a question's target location. API "local" questions carry real
 * dataset ids; AI questions may carry free-text names ("Bab el-Mandeb"), so
 * fall back to normalized name matching against the dataset.
 */
function resolveQuizTarget(q: QuizQuestion | undefined): GeoItem | null {
  if (!q?.locationId) return null;
  const byId = GEO_ITEMS.find((i) => i.id === q.locationId);
  if (byId) return byId;
  const lid = normName(q.locationId);
  if (lid.length < 4) return null;
  let best: GeoItem | null = null;
  let bestLen = -1;
  for (const it of GEO_ITEMS) {
    const n = normName(it.name);
    if (n === lid || n.includes(lid) || lid.includes(n)) {
      const len = Math.min(n.length, lid.length);
      if (len > bestLen) {
        best = it;
        bestLen = len;
      }
    }
  }
  return best;
}

export function AIGeoView() {
  /* ------------------------------ toolbar state ----------------------------- */
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Set<GeoCategoryKey>>(
    () => new Set(GEO_CATEGORIES.map((c) => c.key))
  );
  const [spinning, setSpinning] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);

  /* ------------------------------ explore state ----------------------------- */
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* -------------------------------- quiz state ------------------------------ */
  const [quizMode, setQuizMode] = useState(false);
  const [quizPhase, setQuizPhase] = useState<"idle" | "loading" | "active" | "done">("idle");
  const [quizSource, setQuizSource] = useState<"ai" | "local">("local");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [tally, setTally] = useState({ correct: 0, close: 0, wrong: 0 });

  /* --------------------------------- derived -------------------------------- */

  const filtered = useMemo(
    () => searchGeoItems(query, GEO_ITEMS.filter((i) => activeCats.has(i.category))),
    [query, activeCats]
  );

  const selectedItem = useMemo(
    () => (selectedId ? (GEO_ITEMS.find((i) => i.id === selectedId) ?? null) : null),
    [selectedId]
  );

  const selectedIdxInFiltered = useMemo(
    () => (selectedItem ? filtered.findIndex((i) => i.id === selectedItem.id) : -1),
    [filtered, selectedItem]
  );

  const currentQuestion = quizPhase === "active" ? questions[qIndex] : undefined;
  const currentTarget = useMemo(() => resolveQuizTarget(currentQuestion), [currentQuestion]);
  /* Locate-mode (globe click) vs multiple-choice mode, decided per question. */
  const locateMode = Boolean(currentTarget && !currentQuestion?.mcqOnly);

  /* ------------------------------ interactions ------------------------------ */

  const toggleCategory = useCallback((key: GeoCategoryKey) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const selectItem = useCallback((id: string) => setSelectedId(id), []);

  const stepSelection = useCallback(
    (dir: 1 | -1) => {
      if (filtered.length === 0) return;
      const base = selectedIdxInFiltered >= 0 ? selectedIdxInFiltered : 0;
      const next = (base + dir + filtered.length) % filtered.length;
      setSelectedId(filtered[next].id);
    },
    [filtered, selectedIdxInFiltered]
  );

  const resetView = useCallback(() => {
    setSelectedId(null);
    setResetSignal((s) => s + 1);
  }, []);

  /* ------------------------------ quiz mechanics ----------------------------- */

  const startQuiz = useCallback(async () => {
    setQuizMode(true);
    setSelectedId(null);
    setQuizPhase("loading");
    setQIndex(0);
    setResult(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTally({ correct: 0, close: 0, wrong: 0 });
    setQuestions([]);

    try {
      const res = await fetch("/api/ai/geo-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: QUIZ_COUNT, categories: Array.from(activeCats) }),
      });
      if (!res.ok) throw new Error(`geo-quiz ${res.status}`);
      const data = (await res.json()) as { questions?: QuizQuestion[]; source?: "ai" | "local" };
      const qs = (data.questions ?? [])
        .filter((q) => q && Array.isArray(q.options) && q.options.length === 4)
        .map((q) => ({
          id: String(q.id ?? Math.random().toString(36).slice(2)),
          question: String(q.question ?? ""),
          options: q.options.map(String),
          correctIndex: Math.min(Math.max(Number(q.correctIndex) || 0, 0), 3),
          explanation: String(q.explanation ?? ""),
          locationId: q.locationId ? String(q.locationId) : undefined,
        }))
        .filter((q) => q.question.length > 0);
      if (qs.length === 0) throw new Error("empty quiz");
      setQuestions(qs);
      setQuizSource(data.source === "ai" ? "ai" : "local");
      setQuizPhase("active");
    } catch {
      /* API unavailable → client-side practice round */
      setQuestions(buildFallbackQuiz(activeCats));
      setQuizSource("local");
      setQuizPhase("active");
      toast.info("AI quiz unavailable right now, serving the practice bank instead.");
    }
  }, [activeCats]);

  const exitQuiz = useCallback(() => {
    setQuizMode(false);
    setQuizPhase("idle");
    setQuestions([]);
    setResult(null);
  }, []);

  /** Score a locate answer given the clicked coordinates (or snapped item). */
  const answerLocate = useCallback(
    (clicked: { lat: number; lng: number }, clickedNear?: string) => {
      const q = questions[qIndex];
      const target = resolveQuizTarget(q);
      if (!q || !target || result) return;

      const dist = haversineKm([clicked.lat, clicked.lng], target.coords);
      if (dist <= BULLSEYE_KM) {
        setResult({ kind: "bullseye", distanceKm: dist, clickedNear });
        setScore((s) => s + 1);
        setStreak((s) => {
          const n = s + 1;
          setBestStreak((b) => Math.max(b, n));
          return n;
        });
        setTally((t) => ({ ...t, correct: t.correct + 1 }));
        toast.success(`Bullseye! ${target.name} pinned within ${fmtKm(dist)}.`);
      } else if (dist <= CLOSE_KM) {
        setResult({ kind: "close", distanceKm: dist, clickedNear });
        setScore((s) => s + 0.5);
        setStreak(0);
        setTally((t) => ({ ...t, close: t.close + 1 }));
        toast.info(`Close! ${fmtKm(dist)} away, half credit.`);
      } else {
        setResult({ kind: "wrong", distanceKm: dist, clickedNear });
        setStreak(0);
        setTally((t) => ({ ...t, wrong: t.wrong + 1 }));
        toast.error(`Off target by ${fmtKm(dist)}.`);
      }
    },
    [questions, qIndex, result]
  );

  /** Score an MCQ answer (API questions without a location, fallback round). */
  const answerOption = useCallback(
    (optionIdx: number) => {
      const q = questions[qIndex];
      if (!q || result) return;
      if (optionIdx === q.correctIndex) {
        setResult({ kind: "correct" });
        setScore((s) => s + 1);
        setStreak((s) => {
          const n = s + 1;
          setBestStreak((b) => Math.max(b, n));
          return n;
        });
        setTally((t) => ({ ...t, correct: t.correct + 1 }));
        toast.success("Correct!");
      } else {
        setResult({ kind: "wrong-option" });
        setStreak(0);
        setTally((t) => ({ ...t, wrong: t.wrong + 1 }));
        toast.error("Not quite.");
      }
    },
    [questions, qIndex, result]
  );

  /** Globe clicks: nearest point-item snap + distance scoring (locate mode). */
  const handleGlobeClick = useCallback(
    (lat: number, lng: number) => {
      if (!quizMode || quizPhase !== "active" || !locateMode || result) return;

      /* nearest point item among active categories (fallback: all points) */
      let pool = pointItems().filter((i) => activeCats.has(i.category));
      if (pool.length === 0) pool = pointItems();
      let nearest: GeoItem | null = null;
      let nearestDist = Infinity;
      for (const it of pool) {
        const d = haversineKm([lat, lng], it.coords);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = it;
        }
      }
      answerLocate({ lat, lng }, nearest ? nearest.name : undefined);
    },
    [quizMode, quizPhase, locateMode, result, activeCats, answerLocate]
  );

  /** In quiz mode, clicking a pin/path = guessing that location. */
  const handleMarkerSelect = useCallback(
    (id: string) => {
      if (quizMode) {
        if (!locateMode || result) return;
        const item = GEO_ITEMS.find((i) => i.id === id);
        if (!item) return;
        answerLocate({ lat: item.coords[0], lng: item.coords[1] }, item.name);
      } else {
        setSelectedId(id);
      }
    },
    [quizMode, locateMode, result, answerLocate]
  );

  const nextQuestion = useCallback(() => {
    setResult(null);
    if (qIndex + 1 >= questions.length) {
      setQuizPhase("done");
    } else {
      setQIndex((i) => i + 1);
    }
  }, [qIndex, questions.length]);

  /* Reset quiz if category scope changes mid-round (keeps pool consistent) */
  const catsKey = Array.from(activeCats).sort().join(",");
  const prevCatsKey = useRef(catsKey);
  useEffect(() => {
    if (prevCatsKey.current !== catsKey) {
      prevCatsKey.current = catsKey;
      if (quizMode) void startQuiz();
    }
  }, [catsKey]);

  /* --------------------------------- render ---------------------------------- */

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="AI Geo Maps: Interactive 3D World Atlas"
          description="Spin a 3D globe of 130+ UPSC-curated locations, places in news, rivers, mountain ranges, straits & chokepoints, ports, dams, UNESCO heritage and ecology hotspots. Toggle layers, search, fly to any location, then test yourself with the AI map quiz."
        />

        {/* ------------------------------- Toolbar ------------------------------ */}
        <div className="mb-6 space-y-3" role="group" aria-label="Map controls">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 168+ locations, regions, facts…"
                aria-label="Search locations"
                className="min-h-11 pl-9"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="min-h-11 w-11 shrink-0"
              onClick={() => setSpinning((s) => !s)}
              aria-label={spinning ? "Pause globe rotation" : "Resume globe rotation"}
              aria-pressed={spinning}
              title={spinning ? "Pause rotation" : "Resume rotation"}
            >
              {spinning ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="min-h-11 shrink-0"
              onClick={resetView}
              aria-label="Reset view"
              title="Reset view"
            >
              <Compass className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Reset view</span>
            </Button>

            <Button
              type="button"
              onClick={() => (quizMode ? exitQuiz() : void startQuiz())}
              className={cn(
                "min-h-11 shrink-0 bg-secondary font-semibold text-primary hover:bg-gold-bright",
                quizMode && "ring-2 ring-secondary ring-offset-2"
              )}
              aria-pressed={quizMode}
            >
              <Trophy className="h-4 w-4" aria-hidden />
              {quizMode ? "Exit Quiz" : "Map Quiz"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5" aria-label="Category layers">
            {GEO_CATEGORIES.map((c) => {
              const active = activeCats.has(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={active}
                  title={c.blurb}
                  onClick={() => toggleCategory(c.key)}
                  className={cn(
                    "flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    active
                      ? "border-secondary bg-secondary/15 text-primary ring-1 ring-secondary"
                      : "border-border bg-card text-muted-foreground hover:border-secondary/50 hover:text-primary"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                    aria-hidden
                  />
                  {c.short}
                  <span className="rounded-full bg-primary/5 px-1.5 text-[10px] font-bold text-primary/70">
                    {CATEGORY_COUNTS[c.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* -------------------------------- Grid -------------------------------- */}
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* ------------------------------ Globe card ----------------------------- */}
          <Card className="overflow-hidden border-primary/15 p-0">
            <div
              className="relative h-[62vh] min-h-[440px] bg-navy lg:h-[72vh] lg:min-h-[520px]"
            >
              <GlobeMap
                items={filtered}
                activeCategories={Array.from(activeCats)}
                selectedId={selectedId}
                onSelect={handleMarkerSelect}
                spinning={spinning}
                onGlobeClick={handleGlobeClick}
                resetSignal={resetSignal}
              />

              {/* Legend overlay */}
              <div
                className="absolute bottom-3 left-3 z-10 hidden min-[420px]:flex max-w-[75%] flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-navy-deep/85 px-3 py-2 backdrop-blur-sm"
                aria-hidden
              >
                {GEO_CATEGORIES.map((c) => (
                  <span key={c.key} className="flex items-center gap-1.5 text-[10px] font-semibold text-ivory/85">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.short}
                  </span>
                ))}
              </div>

              {/* Hint overlay */}
              {quizMode && quizPhase === "active" && locateMode && !result ? (
                <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
                  <span className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold text-primary shadow-lg">
                    <MousePointerClick className="h-4 w-4" aria-hidden />
                    Click the location on the globe
                  </span>
                </div>
              ) : null}
            </div>
            <p className="flex items-start gap-2 border-t border-primary/10 bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-ink" aria-hidden />
              Coordinates are indicative learning aids, not authoritative boundaries. For definitive
              maps always refer to the Survey of India / NCERT Atlas.
            </p>
          </Card>

          {/* ----------------------------- Right panel ----------------------------- */}
          <div>
            {quizMode ? (
              /* ============================== QUIZ ============================== */
              <Card className="border-secondary/50">
                <CardContent className="p-5 sm:p-6">
                  {quizPhase === "loading" ? (
                    <div className="space-y-4" role="status" aria-label="Loading quiz">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-4/5" />
                      <Skeleton className="h-6 w-3/5" />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Skeleton className="h-11" />
                        <Skeleton className="h-11" />
                        <Skeleton className="h-11" />
                        <Skeleton className="h-11" />
                      </div>
                    </div>
                  ) : quizPhase === "done" ? (
                    /* ------------------------------ Summary ------------------------------ */
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20" aria-hidden>
                        <Trophy className="h-7 w-7 text-[#7a5c2e]" />
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-bold text-primary">Quiz complete!</h3>
                      <p className="mt-1 text-4xl font-bold text-primary">
                        {score.toLocaleString("en-IN")}
                        <span className="text-lg font-semibold text-muted-foreground"> / {questions.length}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        (Close calls earn half a mark)
                      </p>

                      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl bg-muted/60 p-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Bullseye</dt>
                          <dd className="mt-0.5 text-xl font-bold text-primary">{tally.correct}</dd>
                        </div>
                        <div className="rounded-xl bg-muted/60 p-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Close</dt>
                          <dd className="mt-0.5 text-xl font-bold text-primary">{tally.close}</dd>
                        </div>
                        <div className="rounded-xl bg-muted/60 p-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Missed</dt>
                          <dd className="mt-0.5 text-xl font-bold text-primary">{tally.wrong}</dd>
                        </div>
                      </dl>

                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4 text-gold-ink" aria-hidden />
                        Best streak: <strong className="text-primary">{bestStreak}</strong>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                        {tally.correct >= questions.length * 0.7
                          ? "Atlas-level accuracy, the map is your friend. Keep it up for Prelims!"
                          : tally.correct + tally.close >= questions.length * 0.5
                            ? "Solid map-work. Revisit the missed layers on the globe and go again."
                            : "Map-work pays the freest marks in Prelims, explore the layers, then retry."}
                      </p>

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button
                          onClick={() => void startQuiz()}
                          className="min-h-11 bg-secondary font-semibold text-primary hover:bg-gold-bright"
                        >
                          <Trophy className="mr-1 h-4 w-4" aria-hidden /> Play again
                        </Button>
                        <Button variant="outline" onClick={exitQuiz} className="min-h-11">
                          Back to explorer
                        </Button>
                      </div>
                    </motion.div>
                  ) : currentQuestion ? (
                    /* ------------------------------ Question ----------------------------- */
                    <motion.div key={currentQuestion.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="outline" className="gap-1 border-secondary/60 bg-secondary/10 text-[#7a5c2e]">
                          {quizSource === "ai" ? (
                            <Sparkles className="h-3 w-3" aria-hidden />
                          ) : (
                            <ListChecks className="h-3 w-3" aria-hidden />
                          )}
                          {quizSource === "ai" ? "AI-generated" : "Practice bank"}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <span>
                            Question {qIndex + 1}/{questions.length}
                          </span>
                          <span className="flex items-center gap-1 text-primary">
                            <Crosshair className="h-3.5 w-3.5 text-gold-ink" aria-hidden />
                            Score {score.toLocaleString("en-IN")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5 text-gold-ink" aria-hidden />
                            {streak}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" role="presentation">
                        <div
                          className="h-full rounded-full bg-secondary transition-all duration-500"
                          style={{ width: `${((qIndex + (result ? 1 : 0)) / questions.length) * 100}%` }}
                        />
                      </div>

                      <h3 className="mt-4 font-display text-xl font-bold leading-snug text-primary">
                        {currentQuestion.question}
                      </h3>

                      {!result && locateMode ? (
                        <p className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-secondary/50 bg-secondary/5 p-3 text-sm font-medium text-foreground/80">
                          <MousePointerClick className="h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
                          Click the location on the globe, a pin or its coastline, within {fmtKm(BULLSEYE_KM)} is a bullseye.
                        </p>
                      ) : null}

                      {!result && !locateMode ? (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {currentQuestion.options.map((opt, i) => (
                            <button
                              key={`${currentQuestion.id}-${i}`}
                              type="button"
                              onClick={() => answerOption(i)}
                              className="min-h-11 rounded-xl border border-border bg-background p-3 text-left text-sm font-medium text-foreground/85 transition-all hover:border-secondary hover:bg-secondary/10 hover:text-primary"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {result ? (
                        /* ------------------------------ Reveal ----------------------------- */
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                          <div
                            className={cn(
                              "rounded-xl border p-4",
                              result.kind === "bullseye" || result.kind === "correct"
                                ? "border-secondary bg-secondary/15"
                                : result.kind === "close"
                                  ? "border-secondary/50 bg-secondary/5"
                                  : "border-destructive/40 bg-destructive/5"
                            )}
                          >
                            <p className="font-bold text-primary">
                              {result.kind === "bullseye" && "🎯 Bullseye!"}
                              {result.kind === "correct" && "✅ Correct!"}
                              {result.kind === "close" && "🧭 Close, half credit!"}
                              {result.kind === "wrong" && "❌ Not quite."}
                              {result.kind === "wrong-option" && "❌ Not quite."}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                              {result.kind === "bullseye" && `You pinned it within ${fmtKm(result.distanceKm)}.`}
                              {result.kind === "close" &&
                                `${fmtKm(result.distanceKm)} off, that still earns half a mark (streak resets).`}
                              {result.kind === "wrong" && `You were ${fmtKm(result.distanceKm ?? 0)} away.`}
                              {result.kind === "correct" && "Option locked in, one more mark on the board."}
                              {result.kind === "wrong-option" && "The correct option is highlighted below."}
                              {"clickedNear" in result && result.clickedNear ? (
                                <span className="block text-xs text-muted-foreground">
                                  Nearest pin clicked: {result.clickedNear}
                                </span>
                              ) : null}
                            </p>
                          </div>

                          {/* Correct answer card */}
                          {currentTarget ? (
                            <div className="rounded-xl border border-border bg-background p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold"
                                    style={{
                                      backgroundColor: `${getCategory(currentTarget.category).color}22`,
                                      color: getCategory(currentTarget.category).color,
                                    }}
                                  >
                                    {getCategory(currentTarget.category).label}
                                  </span>
                                  <p className="mt-1.5 font-display text-lg font-bold text-primary">
                                    {currentTarget.name}
                                  </p>
                                  {currentTarget.region ? (
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <MapPin className="h-3 w-3" aria-hidden /> {currentTarget.region}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                                {currentQuestion.explanation || currentTarget.facts[0]}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 min-h-9 border-secondary/60 text-primary hover:bg-secondary/10"
                                onClick={() => setSelectedId(currentTarget.id)}
                              >
                                <Compass className="mr-1.5 h-3.5 w-3.5 text-gold-ink" aria-hidden />
                                Show on map
                              </Button>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-border bg-background p-4">
                              <p className="font-semibold text-primary">
                                Correct answer: {currentQuestion.options[currentQuestion.correctIndex]}
                              </p>
                              <p className="mt-1 text-sm text-foreground/80">{currentQuestion.explanation}</p>
                            </div>
                          )}

                          <Button
                            onClick={nextQuestion}
                            className="min-h-11 w-full bg-primary font-semibold text-primary-foreground hover:bg-navy-800"
                          >
                            {qIndex + 1 >= questions.length ? "See results" : "Next question"}
                            <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                          </Button>
                        </motion.div>
                      ) : null}
                    </motion.div>
                  ) : null}
                </CardContent>
              </Card>
            ) : selectedItem ? (
              /* ========================== EXPLORE DETAIL ========================== */
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-secondary/40">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          backgroundColor: `${getCategory(selectedItem.category).color}22`,
                          color: getCategory(selectedItem.category).color,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: getCategory(selectedItem.category).color }}
                          aria-hidden
                        />
                        {getCategory(selectedItem.category).label}
                      </span>
                      {filtered.length > 1 ? (
                        <div className="flex items-center gap-1">
                          <span className="mr-1 text-[11px] font-medium text-muted-foreground">
                            {selectedIdxInFiltered >= 0 ? selectedIdxInFiltered + 1 : "–"} of {filtered.length}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => stepSelection(-1)}
                            aria-label="Previous location"
                          >
                            <ChevronLeft className="h-4 w-4" aria-hidden />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => stepSelection(1)}
                            aria-label="Next location"
                          >
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-bold text-primary">{selectedItem.name}</h3>
                    {selectedItem.region ? (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-gold-ink" aria-hidden /> {selectedItem.region}
                      </p>
                    ) : null}

                    {selectedItem.whyNews ? (
                      <div className="mt-4 rounded-xl border border-secondary/60 bg-secondary/10 p-4">
                        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7a5c2e]">
                          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Why in the news
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{selectedItem.whyNews}</p>
                      </div>
                    ) : null}

                    <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Exam facts
                    </p>
                    <ul className="mt-2 space-y-2">
                      {selectedItem.facts.map((f, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {selectedItem.tags.map((t) => (
                        <TagBadge key={t} tag={t} />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-5 min-h-9 text-muted-foreground hover:text-primary"
                      onClick={() => setSelectedId(null)}
                    >
                      <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden /> Back to all locations
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              /* =========================== EXPLORE LIST =========================== */
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-3 flex items-baseline justify-between gap-2 px-1">
                    <h3 className="font-display text-lg font-bold text-primary">Explore locations</h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {filtered.length} location{filtered.length === 1 ? "" : "s"}
                      {query ? ` matching "${query.trim()}"` : ""}
                    </span>
                  </div>
                  {filtered.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
                      <p className="font-medium text-foreground">No locations found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try a different search term or enable more category layers.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="nice-scroll max-h-[560px] space-y-1 overflow-y-auto pr-1"
                      role="list"
                      aria-label="Filtered locations"
                    >
                      {filtered.map((item) => {
                        const cat = getCategory(item.category);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="listitem"
                            onClick={() => setSelectedId(item.id)}
                            className="flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-all hover:border-secondary/40 hover:bg-secondary/5"
                            aria-label={`${item.name}, ${cat.label}${item.region ? `, ${item.region}` : ""}`}
                          >
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: cat.color }}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-primary">{item.name}</span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {cat.short}
                                {item.region ? ` · ${item.region}` : ""}
                              </span>
                            </span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
