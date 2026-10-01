"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ListChecks,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPost, toErrorMessage, type McqQuestion } from "@/lib/api";
import { saveQuizAttempt, loadQuizAttempts } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SUBJECTS = ["Polity", "Economy", "History", "Geography", "Environment", "Science & Tech"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

type Phase = "setup" | "quiz" | "summary";

function SetupForm({
  onGenerated,
}: {
  onGenerated: (questions: McqQuestion[], subject: string, difficulty: Difficulty) => void;
}) {
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("Polity");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const data = await apiPost<{ questions: McqQuestion[] }>("/api/ai/mcq", {
        subject,
        difficulty,
        count: 5,
      });
      const qs = Array.isArray(data.questions) ? data.questions : [];
      if (qs.length === 0) throw new Error("The AI returned no questions — try again.");
      onGenerated(qs, subject, difficulty);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const attempts = loadQuizAttempts().slice(-3).reverse();

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={(v) => setSubject(v as (typeof SUBJECTS)[number])}>
              <SelectTrigger className="min-h-12 w-full bg-card" aria-label="Select subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Difficulty">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={difficulty === d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "min-h-12 rounded-lg border text-sm font-semibold transition-all",
                    difficulty === d
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/70 hover:border-secondary"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-primary">
              <ListChecks className="h-4 w-4 text-secondary" aria-hidden /> 5 questions · instant feedback · explanations
            </p>
            <p className="mt-1">Prelims-style MCQs generated fresh by AI — negative marking is not applied here. Focus on learning.</p>
          </div>

          <Button
            onClick={() => void generate()}
            disabled={busy}
            className="min-h-12 w-full bg-secondary text-base font-semibold text-primary hover:bg-gold-bright"
          >
            {busy ? "Generating questions…" : "Generate Quiz"}
          </Button>

          {attempts.length > 0 ? (
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent attempts</p>
              <ul className="space-y-1.5 text-sm">
                {attempts.map((a, i) => (
                  <li key={i} className="flex items-center justify-between text-muted-foreground">
                    <span>{a.subject} · {a.difficulty}</span>
                    <span className="font-semibold text-primary">{a.score}/{a.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function QuizRunner({
  questions,
  subject,
  difficulty,
  onFinish,
}: {
  questions: McqQuestion[];
  subject: string;
  difficulty: Difficulty;
  onFinish: (score: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const answered = picked !== null;
  const isLast = index === questions.length - 1;

  if (!q) {
    onFinish(score, questions.length);
    return null;
  }

  const pick = (i: number) => {
    if (answered) return;
    setPicked(i);
    if (i === q.correctIndex) {
      setScore((s) => s + 1);
      toast.success("Correct!");
    } else {
      toast.error("Not quite — read the explanation.");
    }
  };

  const next = () => {
    if (isLast) {
      const finalScore = score;
      saveQuizAttempt({
        subject,
        difficulty,
        score: finalScore,
        total: questions.length,
        at: new Date().toISOString(),
      });
      onFinish(finalScore, questions.length);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">Question {index + 1} of {questions.length}</span>
          <span className="text-muted-foreground">Score: {score}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={questions.length}>
          <motion.div
            className="h-full bg-secondary"
            initial={false}
            animate={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary">{q.subject}</span>
                <span className="rounded-md bg-secondary/15 px-2 py-0.5 text-[11px] font-semibold text-[#7a5c2e]">{difficulty}</span>
              </div>
              <h2 className="font-medium leading-relaxed text-foreground">{q.question}</h2>

              <div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer options">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correctIndex;
                  const isPicked = i === picked;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={isPicked}
                      disabled={answered}
                      onClick={() => pick(i)}
                      className={cn(
                        "flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                        !answered && "border-border bg-card hover:border-secondary hover:bg-secondary/5",
                        answered && isCorrect && "border-emerald-600 bg-emerald-600/10 font-semibold text-emerald-900",
                        answered && isPicked && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                        answered && !isCorrect && !isPicked && "border-border bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                          answered && isCorrect ? "border-emerald-600 bg-emerald-600 text-white" : "border-border"
                        )}
                        aria-hidden
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {answered && isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden /> : null}
                      {answered && isPicked && !isCorrect ? <XCircle className="h-5 w-5 shrink-0" aria-hidden /> : null}
                    </button>
                  );
                })}
              </div>

              {answered ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl bg-muted/60 p-4"
                >
                  <p className="text-sm font-semibold text-primary">Explanation</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{q.explanation}</p>
                  <Button onClick={next} className="mt-4 min-h-11 w-full sm:w-auto">
                    {isLast ? "See Results" : "Next Question"} <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Button>
                </motion.div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Summary({
  score,
  total,
  subject,
  onRetry,
}: {
  score: number;
  total: number;
  subject: string;
  onRetry: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const best = Math.max(score, ...loadQuizAttempts().filter((a) => a.subject === subject).map((a) => a.score), 0);

  const message =
    pct >= 80 ? "Outstanding — you're in selection form!" : pct >= 60 ? "Solid. Review the misses and go again." : pct >= 40 ? "Getting there — revisit the concepts behind each question." : "Treat this as your starting line — read the topic, then re-attempt.";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md">
      <Card className="border-secondary/50 shadow-xl">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/15">
            <Award className="h-10 w-10 text-[#7a5c2e]" aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-primary">
            {score} / {total}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{subject} · {pct}% accuracy</p>
          <p className="mt-4 rounded-lg bg-muted/60 p-4 text-sm leading-relaxed text-foreground/85">{message}</p>
          <p className="mt-3 text-xs text-muted-foreground">Best on this subject: {best}/{total}</p>
          <Button onClick={onRetry} className="mt-6 min-h-12 w-full bg-secondary font-semibold text-primary hover:bg-gold-bright">
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden /> Re-attempt with New Questions
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AIMcqView() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [meta, setMeta] = useState<{ subject: string; difficulty: Difficulty }>({ subject: "Polity", difficulty: "Medium" });
  const [result, setResult] = useState<{ score: number; total: number }>({ score: 0, total: 5 });

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">AI Tool 03</p>
          <h1 className="font-display text-4xl text-balance text-primary sm:text-5xl">AI MCQ Practice</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Fresh Prelims-style questions, generated on demand. Immediate feedback with explanations
            keeps wrong answers from becoming habits.
          </p>
        </div>

        {phase === "setup" ? (
          <SetupForm
            onGenerated={(qs, subject, difficulty) => {
              setQuestions(qs);
              setMeta({ subject, difficulty });
              setPhase("quiz");
            }}
          />
        ) : phase === "quiz" ? (
          <QuizRunner
            questions={questions}
            subject={meta.subject}
            difficulty={meta.difficulty}
            onFinish={(score, total) => {
              setResult({ score, total });
              setPhase("summary");
            }}
          />
        ) : (
          <Summary
            score={result.score}
            total={result.total}
            subject={meta.subject}
            onRetry={() => setPhase("setup")}
          />
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-secondary" aria-hidden />
          Questions are AI-generated for practice. Attempt history is stored on this device.
        </p>
      </div>
    </div>
  );
}

