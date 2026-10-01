"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookMarked,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { pickArray, useApi, type Bookmark, type Resource } from "@/lib/api";
import { loadQuizAttempts, useAppStore } from "@/lib/store";
import { EmptyState, ErrorCard, FadeIn, ListSkeleton } from "@/components/shared/blocks";
import { toast } from "sonner";

export function DashboardView() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const navigate = useAppStore((s) => s.navigate);
  const cart = useAppStore((s) => s.cart);

  const bookmarksQuery = useApi<{ bookmarks: Bookmark[] }>(user ? "/api/user/bookmarks" : null);
  const resourcesQuery = useApi<{ resources: Resource[] }>(user ? "/api/resources" : null);

  const bookmarks = useMemo(() => pickArray<Bookmark>(bookmarksQuery.data, "bookmarks"), [bookmarksQuery.data]);
  const resources = useMemo(() => pickArray<Resource>(resourcesQuery.data, "resources"), [resourcesQuery.data]);

  const [bestScore, setBestScore] = useState<{ pct: number; label: string }>({ pct: 0, label: "—" });
  const [attemptsCount, setAttemptsCount] = useState(0);

  useEffect(() => {
    // Read localStorage asynchronously (post-paint) to avoid cascading renders
    const t = setTimeout(() => {
      const attempts = loadQuizAttempts();
      setAttemptsCount(attempts.length);
      if (attempts.length > 0) {
        const best = attempts.reduce((a, b) => (b.score / Math.max(1, b.total) > a.score / Math.max(1, a.total) ? b : a));
        setBestScore({
          pct: Math.round((best.score / Math.max(1, best.total)) * 100),
          label: `${best.subject} · ${best.score}/${best.total}`,
        });
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const resourceTitle = (id: string) => {
    const r = resources.find((x) => x.id === id || x.slug === id);
    return r ? { title: r.title, category: r.category } : null;
  };

  const logout = async () => {
    try {
      await toast.promise(fetch("/api/auth/logout", { method: "POST" }), {
        loading: "Logging out…",
        success: "Logged out.",
        error: "Logout failed on server — cleared locally.",
      });
    } catch {
      /* ignore */
    }
    setUser(null);
    navigate("home");
  };

  if (!user) {
    return (
      <div className="py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <EmptyState
            className="border-0 bg-transparent"
            icon={<GraduationCap className="h-6 w-6 text-secondary" />}
            title="Your dashboard is one login away"
            hint="Log in or create a free account to see bookmarks, quiz history and AI credits."
          />
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate("login")} className="min-h-11">
              <LogIn className="mr-2 h-4 w-4" aria-hidden /> Log In
            </Button>
            <Button variant="outline" onClick={() => navigate("register")} className="min-h-11">
              Register Free
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <FadeIn>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Student Dashboard</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-primary sm:text-4xl">
                Namaste, {user.name.split(" ")[0]} 🙏
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Consistency beats intensity — here&apos;s where you stand today.
              </p>
            </div>
            <Button variant="outline" onClick={() => void logout()} className="min-h-11">
              <LogOut className="mr-2 h-4 w-4" aria-hidden /> Log out
            </Button>
          </div>
        </FadeIn>

        {/* Stat cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookMarked,
              label: "Bookmarks",
              value: bookmarksQuery.isLoading ? "…" : String(bookmarks.length),
              sub: "saved resources",
            },
            {
              icon: ListChecks,
              label: "Best AI Quiz",
              value: attemptsCount ? `${bestScore.pct}%` : "—",
              sub: attemptsCount ? bestScore.label : "no attempts yet",
            },
            {
              icon: Award,
              label: "Quiz Attempts",
              value: String(attemptsCount),
              sub: "on this device",
            },
            {
              icon: BookOpen,
              label: "Cart Items",
              value: String(cart.reduce((n, c) => n + c.qty, 0)),
              sub: "in bookshop cart",
            },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.06}>
              <Card>
                <CardContent className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                    <s.icon className="h-5 w-5 text-gold" aria-hidden />
                  </span>
                  <p className="mt-4 font-display text-3xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm font-medium text-foreground/80">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Bookmarks */}
          <Card>
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                <BookMarked className="h-5 w-5 text-secondary" aria-hidden /> My Bookmarks
              </h2>
              <Separator className="my-4" />
              {bookmarksQuery.isLoading ? (
                <ListSkeleton rows={3} />
              ) : bookmarksQuery.isError ? (
                <ErrorCard
                  message="Could not load bookmarks."
                  onRetry={() => void bookmarksQuery.refetch()}
                />
              ) : bookmarks.length === 0 ? (
                <EmptyState
                  title="No bookmarks yet"
                  hint="Browse Resources and tap the bookmark icon to save PYQs, notes and answer keys here."
                  icon={<BookMarked className="h-5 w-5 text-muted-foreground" />}
                />
              ) : (
                <ul className="max-h-96 divide-y divide-border overflow-y-auto nice-scroll">
                  {bookmarks.map((b) => {
                    const meta = resourceTitle(String(b.resourceId));
                    return (
                      <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {meta?.title ?? `Resource #${String(b.resourceId).slice(0, 8)}`}
                          </p>
                          {meta ? <p className="text-xs capitalize text-muted-foreground">{meta.category}</p> : null}
                        </div>
                        <Button variant="outline" size="sm" className="min-h-9" onClick={() => navigate("resources")}>
                          Open library
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Right rail */}
          <div className="space-y-6">
            <Card className="bg-navy text-ivory">
              <CardContent className="p-6">
                <Sparkles className="h-7 w-7 text-gold" aria-hidden />
                <h2 className="mt-3 font-display text-xl font-bold">Today&apos;s Ritual</h2>
                <ul className="mt-3 space-y-2 text-sm text-ivory/75">
                  <li>1. Read the day&apos;s current affairs (15 min)</li>
                  <li>2. One AI MCQ quiz on your weakest subject</li>
                  <li>3. Write one Mains answer → evaluate it</li>
                </ul>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate("news")} className="min-h-11 border-white/25 px-2 text-ivory hover:bg-white/10 hover:text-ivory">
                    News
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("ai-mcq")} className="min-h-11 border-white/25 px-2 text-ivory hover:bg-white/10 hover:text-ivory">
                    Quiz
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("ai-evaluate")} className="min-h-11 border-white/25 px-2 text-ivory hover:bg-white/10 hover:text-ivory">
                    Evaluate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-bold text-primary">Account</h2>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{user.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="truncate font-medium">{user.email}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">AI credits</dt>
                    <dd>
                      <Badge className="bg-secondary/15 text-[#7a5c2e]">Active</Badge>
                    </dd>
                  </div>
                </dl>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Loading your enquiry — our mentors have your latest submission.");
                    navigate("contact");
                  }}
                  className="mt-5 min-h-11 w-full"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden /> My Enquiry & Counselling
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
