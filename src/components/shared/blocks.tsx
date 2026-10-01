"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ------------------------------ Section heading ---------------------------- */

export function SectionHeading({
  title,
  description,
  dark = false,
  align = "center",
  className,
}: {
  title: string;
  description?: string;
  dark?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "mb-10 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <h2
        className={cn(
          "font-display text-3xl leading-tight text-balance sm:text-4xl",
          dark ? "text-ivory" : "text-primary"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed", dark ? "text-ivory/70" : "text-muted-foreground")}>
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}

/* -------------------------------- Error card ------------------------------- */

export function ErrorCard({
  message = "We couldn't load this content.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn("border-dashed border-destructive/40 bg-destructive/5", className)}>
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10" aria-hidden>
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </span>
        <div>
          <p className="font-medium text-foreground">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-1 min-h-11">
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden /> Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

/* ------------------------------- Empty state ------------------------------- */

export function EmptyState({
  title = "Nothing here yet",
  hint,
  icon,
  className,
}: {
  title?: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center",
        className
      )}
      role="status"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted" aria-hidden>
        {icon ?? <Inbox className="h-5 w-5 text-muted-foreground" />}
      </span>
      <p className="font-medium text-foreground">{title}</p>
      {hint ? <p className="max-w-sm text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* -------------------------------- Skeletons -------------------------------- */

export function CardsSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-hidden
      data-testid="cards-skeleton"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------ Badge helpers ------------------------------ */

const SOURCE_STYLES: Record<string, string> = {
  "The Hindu": "bg-primary text-primary-foreground",
  "Indian Express": "bg-secondary text-secondary-foreground",
  PIB: "bg-[#4a5d3a] text-white",
  Yojana: "bg-[#7a5c2e] text-white",
};

export function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        SOURCE_STYLES[source] ?? "bg-muted text-foreground"
      )}
    >
      {source}
    </span>
  );
}

const GSTAG_STYLES: Record<string, string> = {
  GS1: "border-primary/30 bg-primary/5 text-primary",
  GS2: "border-secondary/50 bg-secondary/10 text-[#7a5c2e]",
  GS3: "border-primary/30 bg-primary/10 text-primary",
  GS4: "border-secondary/50 bg-secondary/15 text-[#7a5c2e]",
  Prelims: "bg-primary text-primary-foreground",
  Essay: "bg-[#5d3a2e] text-white",
};

export function GsTagBadge({ tag }: { tag: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        GSTAG_STYLES[tag] ?? "border-border bg-muted text-foreground"
      )}
    >
      {tag}
    </span>
  );
}

const MODE_LABELS: Record<string, string> = {
  offline: "Offline · Bhubaneswar",
  "online-live": "Online Live",
  recorded: "Self-paced Recorded",
  hybrid: "Hybrid",
};

export function ModeBadge({ mode }: { mode: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {MODE_LABELS[mode] ?? mode}
    </span>
  );
}

export function TagBadge({ tag }: { tag: string }) {
  const label = tag.charAt(0).toUpperCase() + tag.slice(1);
  return (
    <span className="inline-flex items-center rounded-md border border-secondary/50 bg-secondary/10 px-2 py-0.5 text-[11px] font-semibold text-[#7a5c2e]">
      {label}
    </span>
  );
}

/* ------------------------------ Fade-in helper ----------------------------- */

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
