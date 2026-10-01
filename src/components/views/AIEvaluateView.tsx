"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  CircleAlert,
  FileText,
  Lightbulb,
  ListOrdered,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPost, toErrorMessage, type Evaluation } from "@/lib/api";
import { countWords } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE_QUESTION =
  "e-Governance is not only about utilizing the power of new technology but also about much more critical issues of a completely new system of governance. Elucidate. (UPSC GS-2, 250 words, 15 marks)";

const PAPERS = ["Essay", "GS1", "GS2", "GS3", "GS4"] as const;

/* ------------------------------ Score dial --------------------------------- */

function ScoreDial({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative h-36 w-36" role="img" aria-label={`Overall score ${score} out of 10`}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1ede3" strokeWidth="10" />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#c9a24b"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-primary">{score.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">/ 10</span>
      </div>
    </div>
  );
}

/* ---------------------------- Breakdown bars ------------------------------- */

const BREAKDOWN_LABELS: { key: keyof Evaluation["breakdown"]; label: string }[] = [
  { key: "content", label: "Content & Coverage" },
  { key: "structure", label: "Structure & Flow" },
  { key: "analysis", label: "Analysis & Depth" },
  { key: "examples", label: "Examples & Data" },
  { key: "presentation", label: "Presentation" },
];

function BreakdownBars({ breakdown }: { breakdown: Evaluation["breakdown"] }) {
  return (
    <div className="space-y-4">
      {BREAKDOWN_LABELS.map(({ key, label }) => {
        const v = Number(breakdown?.[key] ?? 0);
        const pct = Math.max(0, Math.min(100, v * 10));
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-foreground/85">{label}</span>
              <span className="font-semibold text-primary">{v.toFixed(1)}/10</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
              <motion.div
                className="h-full rounded-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Result panel ------------------------------- */

function ResultPanel({ evaluation }: { evaluation: Evaluation }) {
  const verdictGood = /good|strong|excellent|impressive/i.test(evaluation.verdict ?? "");
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-6">
      <Card className="border-secondary/50 shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center">
              <ScoreDial score={Number(evaluation.scoreInr0to10) || 0} />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overall Score</p>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-primary">Examiner&apos;s Verdict</h3>
              <p className="mt-2 flex gap-2 rounded-lg bg-muted/60 p-4 text-sm leading-relaxed text-foreground/85">
                {verdictGood ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                ) : (
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                )}
                {evaluation.verdict}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="mb-4 font-display text-lg font-bold text-primary">Parameter Breakdown</h3>
            <BreakdownBars breakdown={evaluation.breakdown} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-emerald-800">
              <CheckCircle2 className="h-5 w-5" aria-hidden /> Strengths
            </h3>
            <ul className="mt-3 space-y-2.5">
              {(evaluation.strengths ?? []).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden /> Improve Next Time
            </h3>
            <ul className="mt-3 space-y-2.5">
              {(evaluation.improvements ?? []).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-navy text-ivory">
        <CardContent className="p-6 sm:p-8">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold">
            <Lightbulb className="h-5 w-5 text-gold" aria-hidden /> Model Answer Outline
          </h3>
          <p className="mt-1.5 text-sm text-ivory/60">How a 9+ answer would be structured for this question.</p>
          <ol className="mt-5 space-y-3">
            {(evaluation.modelOutline ?? []).map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ivory/85">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-xs font-bold text-gold" aria-hidden>
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------------------------------- View ----------------------------------- */

export function AIEvaluateView() {
  const [question, setQuestion] = useState(SAMPLE_QUESTION);
  const [answer, setAnswer] = useState("");
  const [paper, setPaper] = useState<(typeof PAPERS)[number]>("GS2");
  const [result, setResult] = useState<Evaluation | null>(null);
  const [busy, setBusy] = useState(false);

  const words = countWords(answer);
  const nearLimit = words > 250;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Both the question and your answer are required.");
      return;
    }
    if (words < 40) {
      toast.error("That's too short for a Mains answer — write at least ~40 words so the evaluator has substance.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const data = await apiPost<{ evaluation: Evaluation }>("/api/ai/evaluate", {
        question: question.trim(),
        answer: answer.trim(),
        paperType: paper,
      });
      setResult(data.evaluation);
      toast.success("Evaluation ready — study the feedback before your next attempt.");
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">AI Tool 01</p>
          <h1 className="font-display text-4xl text-balance text-primary sm:text-5xl">AI Mains Answer Evaluation</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Paste a PYQ or classroom question, write your answer, and get a UPSC-examiner-style score
            with a parameter-wise breakdown in seconds.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input form */}
          <form onSubmit={submit} className="space-y-5" aria-label="Answer evaluation form">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="eval-question">Question</Label>
                <button
                  type="button"
                  onClick={() => setQuestion(SAMPLE_QUESTION)}
                  className="min-h-9 text-xs font-medium text-secondary hover:underline"
                >
                  Load sample PYQ
                </button>
              </div>
              <Textarea
                id="eval-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="bg-card"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label>Paper</Label>
              <Select value={paper} onValueChange={(v) => setPaper(v as (typeof PAPERS)[number])}>
                <SelectTrigger className="min-h-11 w-full bg-card" aria-label="Select paper">
                  <SelectValue placeholder="Select paper" />
                </SelectTrigger>
                <SelectContent>
                  {PAPERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p === "Essay" ? "Essay Paper" : `General Studies ${p.replace("GS", "")}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="eval-answer">Your answer</Label>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    nearLimit ? "text-destructive" : words >= 200 ? "text-emerald-700" : "text-muted-foreground"
                  )}
                  aria-live="polite"
                >
                  {words} / ~250 words
                </span>
              </div>
              <Textarea
                id="eval-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={12}
                placeholder="Write your Mains answer here — intro, body with arguments & examples, and a forward-looking conclusion…"
                className="bg-card leading-relaxed"
                aria-required="true"
              />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                UPSC guideline: ~250 words / 15 marks. Structure: Introduction → Arguments → Conclusion.
              </p>
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="min-h-12 w-full bg-secondary text-base font-semibold text-primary hover:bg-gold-bright"
            >
              {busy ? "Evaluating your answer…" : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden /> Evaluate My Answer
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <Sparkles className="mr-1 inline h-3.5 w-3.5 text-secondary" aria-hidden />
              Free users get limited evaluations — enrolled students have unlimited credits.
            </p>
          </form>

          {/* Result column */}
          <div aria-live="polite">
            {busy ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                      <Skeleton className="h-36 w-36 rounded-full" />
                      <div className="w-full flex-1 space-y-3">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                    <div className="mt-8 space-y-4 border-t border-border pt-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <p className="text-center text-sm text-muted-foreground">
                  <BookOpenCheck className="mr-1.5 inline h-4 w-4 text-secondary" aria-hidden />
                  The examiner AI is reading every line…
                </p>
              </div>
            ) : result ? (
              <ResultPanel evaluation={result} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex h-full min-h-80 flex-col items-center justify-center gap-4 p-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/15">
                    <PenLine className="h-8 w-8 text-secondary" aria-hidden />
                  </span>
                  <p className="font-display text-xl font-bold text-primary">Your evaluation appears here</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Score out of 10, five-parameter breakdown, strengths, improvements and a model
                    outline — the exact feedback loop our toppers use daily.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
