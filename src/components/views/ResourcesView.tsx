"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Download,
  Eye,
  FileText,
  Files,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiPost, pickArray, toErrorMessage, useApi, type Bookmark, type Resource, type ResourceCategory } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { CardsSkeleton, ErrorCard, FadeIn, SectionHeading } from "@/components/shared/blocks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_TABS: { key: "all" | ResourceCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pyq", label: "PYQs" },
  { key: "notes", label: "Notes" },
  { key: "booklist", label: "Booklist" },
  { key: "answer-key", label: "Answer Keys" },
  { key: "ebook", label: "E-Books" },
  { key: "current-affairs", label: "Current Affairs" },
];

const EXAMS = ["All", "UPSC", "OPSC", "CSAT", "Optional"] as const;

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  pyq: "PYQ",
  notes: "Notes",
  booklist: "Booklist",
  "answer-key": "Answer Key",
  ebook: "E-Book",
  "current-affairs": "Current Affairs",
};

function fileIcon(t: Resource["fileType"]) {
  if (t === "pdf") return FileText;
  if (t === "docx") return Files;
  return BookOpen;
}

export function ResourcesView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAppStore((s) => s.user);

  const [category, setCategory] = useState<"all" | ResourceCategory>("all");
  const [exam, setExam] = useState<(typeof EXAMS)[number]>("All");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, refetch } = useApi<{ resources: Resource[] }>("/api/resources");
  const bookmarksQuery = useApi<{ bookmarks: Bookmark[] }>(user ? "/api/user/bookmarks" : null);

  useEffect(() => {
    const list = pickArray<Bookmark>(bookmarksQuery.data, "bookmarks");
    setBookmarked(new Set(list.map((b) => String(b.resourceId))));
  }, [bookmarksQuery.data]);

  const resources = useMemo(() => pickArray<Resource>(data, "resources"), [data]);
  const filtered = useMemo(
    () =>
      resources.filter(
        (r) => (category === "all" || r.category === category) && (exam === "All" || r.exam === exam)
      ),
    [resources, category, exam]
  );

  const toggleBookmark = async (r: Resource) => {
    if (!user) {
      toast.info("Login to save bookmarks across devices.");
      navigate("login");
      return;
    }
    const isBookmarked = bookmarked.has(r.id);
    // optimistic
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(r.id);
      else next.add(r.id);
      return next;
    });
    try {
      if (isBookmarked) {
        await apiPost("/api/user/bookmarks/remove", { resourceId: r.id });
        toast.success("Bookmark removed.");
      } else {
        await apiPost("/api/user/bookmarks", { resourceId: r.id });
        toast.success("Saved to your bookmarks.");
      }
      void bookmarksQuery.refetch();
    } catch (err) {
      // rollback
      setBookmarked((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(r.id);
        else next.delete(r.id);
        return next;
      });
      toast.error(toErrorMessage(err));
    }
  };

  const openResource = async (r: Resource) => {
    if (r.fileType === "page") {
      toast.info(`Opening “${r.title}” — full reading view.`);
      return;
    }
    toast.success(`Preparing “${r.title}” (${r.fileType.toUpperCase()}) for download…`);
    if (user && !bookmarked.has(r.id)) {
      try {
        await apiPost("/api/user/bookmarks", { resourceId: r.id });
        setBookmarked((prev) => new Set(prev).add(r.id));
        toast("Added to your bookmarks too.", { icon: "🔖" });
      } catch {
        /* bookmarking is best-effort */
      }
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Free Resources"
          title="PYQs, Notes, Answer Keys & More"
          description="20+ years of prelims PYQs with solutions, mentor-approved booklists, GS notes and official answer keys — free for every aspirant."
        />

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Resource category">
            {CATEGORY_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={category === t.key}
                onClick={() => setCategory(t.key)}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  category === t.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Exam filter">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam:</span>
            {EXAMS.map((e) => (
              <button
                key={e}
                type="button"
                aria-pressed={exam === e}
                onClick={() => setExam(e)}
                className={cn(
                  "min-h-10 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                  exam === e
                    ? "border-secondary bg-secondary/15 text-[#7a5c2e]"
                    : "border-border text-muted-foreground hover:border-secondary hover:text-primary"
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <CardsSkeleton count={6} />
        ) : isError ? (
          <ErrorCard message="Could not load resources. The library may still be waking up." onRetry={() => void refetch()} />
        ) : filtered.length === 0 ? (
          <ErrorCard message="No resources match this filter yet — try another category or exam." />
        ) : (
          <div className="max-h-[42rem] overflow-y-auto pr-1 nice-scroll" aria-label="Resource list">
            <div className="grid gap-6 pb-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r, i) => {
                const Icon = fileIcon(r.fileType);
                const isBookmarked = bookmarked.has(r.id);
                return (
                  <FadeIn key={r.id} delay={(i % 3) * 0.06}>
                    <Card className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-lg">
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="mb-3 flex items-start justify-between">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5" aria-hidden>
                            <Icon className="h-5 w-5 text-primary" />
                          </span>
                          <button
                            type="button"
                            onClick={() => void toggleBookmark(r)}
                            aria-label={isBookmarked ? `Remove bookmark for ${r.title}` : `Bookmark ${r.title}`}
                            aria-pressed={isBookmarked}
                            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="h-5 w-5 text-secondary" aria-hidden />
                            ) : (
                              <Bookmark className="h-5 w-5" aria-hidden />
                            )}
                          </button>
                        </div>

                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{CATEGORY_LABELS[r.category] ?? r.category}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{r.exam}</Badge>
                          {r.year ? <Badge variant="outline" className="text-[10px]">{r.year}</Badge> : null}
                        </div>

                        <h3 className="font-display text-lg font-bold leading-snug text-primary">{r.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>

                        <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="uppercase">{r.fileType}</span>
                          {r.pages ? <span>· {r.pages} pages</span> : null}
                          <span className="flex items-center gap-1">
                            · <Eye className="h-3 w-3" aria-hidden /> {r.downloads.toLocaleString("en-IN")} downloads
                          </span>
                        </p>

                        <div className="mt-auto flex gap-2 pt-4">
                          <Button onClick={() => void openResource(r)} className="min-h-11 flex-1">
                            <Download className="mr-1.5 h-4 w-4" aria-hidden />
                            {r.fileType === "page" ? "Read" : "Download"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Globe2 className="h-4 w-4 text-secondary" aria-hidden />
          Every enrolled student gets the full archive with solutions — {" "}
          <button type="button" onClick={() => navigate("plans")} className="font-semibold text-secondary hover:underline">
            see plans
          </button>
        </p>
      </div>
    </div>
  );
}
