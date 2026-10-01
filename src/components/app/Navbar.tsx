"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessagesSquare,
  Newspaper,
  ListChecks,
  PenLine,
  ShoppingCart,
  Sparkles,
  UserRound,
  BookMarked,
  FileQuestion,
  Award,
  Phone,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppStore, type ViewName } from "@/lib/store";
import { apiPost, toErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/** No-op store subscription — used only for the hydration-safe mounted flag. */
const subscribeNoop = () => () => {};

const MAIN_LINKS: { view: ViewName; label: string }[] = [
  { view: "home", label: "Home" },
  { view: "news", label: "News" },
  { view: "resources", label: "Resources" },
];

const AI_LINKS: { view: ViewName; label: string; icon: React.ReactNode }[] = [
  { view: "ai-hub", label: "AI Tools Hub", icon: <Sparkles className="h-4 w-4" aria-hidden /> },
  { view: "ai-evaluate", label: "Answer Evaluation", icon: <PenLine className="h-4 w-4" aria-hidden /> },
  { view: "ai-chat", label: "Doubt Agent", icon: <MessagesSquare className="h-4 w-4" aria-hidden /> },
  { view: "ai-mcq", label: "MCQ Practice", icon: <ListChecks className="h-4 w-4" aria-hidden /> },
  { view: "ai-geo", label: "AI Geo Maps", icon: <Map className="h-4 w-4" aria-hidden /> },
];

const MORE_LINKS: { view: ViewName; label: string; icon: React.ReactNode }[] = [
  { view: "books", label: "Books Shop", icon: <BookOpen className="h-4 w-4" aria-hidden /> },
  { view: "test-series", label: "Test Series", icon: <FileQuestion className="h-4 w-4" aria-hidden /> },
  { view: "rankers", label: "Rankers & Testimonials", icon: <Award className="h-4 w-4" aria-hidden /> },
  { view: "about", label: "About Us", icon: <BookMarked className="h-4 w-4" aria-hidden /> },
  { view: "contact", label: "Contact", icon: <Phone className="h-4 w-4" aria-hidden /> },
];

function isActive(current: string, target: ViewName): boolean {
  if (target === current) return true;
  if (target === "ai-hub") return current.startsWith("ai-");
  return false;
}

export function Navbar() {
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const cartCount = useAppStore((s) => s.cart.reduce((n, c) => n + c.qty, 0));
  const setCartOpen = useAppStore((s) => s.setCartOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Radix UI generates ids via React useId; when the SSR tree and the first
  // client render diverged (React 19 tree-context quirk), hydration threw
  // attribute-mismatch warnings for the dropdown/sheet triggers. Rendering the
  // interactive (Radix) part only after mount guarantees the hydration HTML
  // matches the server output — a static, Radix-free shell renders before that.
  // useSyncExternalStore = hydration-safe "mounted" flag (no setState-in-effect).
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const go = (v: ViewName) => {
    setMobileOpen(false);
    navigate(v);
  };

  const logout = async () => {
    try {
      await apiPost("/api/auth/logout");
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
    setUser(null);
    toast.success("Logged out. See you at the next class!");
    navigate("home");
  };

  const linkCls = (v: ViewName) =>
    cn(
      "gold-underline hidden rounded-md px-1 py-2 text-sm font-medium transition-colors lg:inline-flex lg:items-center",
      isActive(view, v) ? "text-primary" : "text-foreground/75 hover:text-primary"
    );

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/70 bg-white/85 backdrop-blur-md"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          type="button"
          onClick={() => go("home")}
          className="flex min-h-11 items-center gap-2 rounded-md pr-2"
          aria-label="Niyatee Civil Services Academy — go to home"
        >
          { }
          <img src="/brand/logo.png" alt="Niyatee IAS logo" className="h-9 w-auto" />
        </button>

        {/* Desktop links — Radix-heavy tree mounts after hydration */}
        {mounted ? (
          <>
            <div className="hidden items-center gap-5 lg:flex">
              {MAIN_LINKS.map((l) => (
                <button key={l.view} type="button" onClick={() => go(l.view)} className={linkCls(l.view)} data-active={isActive(view, l.view)}>
                  {l.label}
                </button>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "gold-underline inline-flex items-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition-colors",
                    isActive(view, "ai-hub") ? "text-primary" : "text-foreground/75 hover:text-primary"
                  )}
                  data-active={isActive(view, "ai-hub")}
                >
                  AI Tools <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                    AI-Powered Preparation
                  </DropdownMenuLabel>
                  {AI_LINKS.map((l) => (
                    <DropdownMenuItem key={l.view} onClick={() => go(l.view)} className="min-h-11 cursor-pointer gap-2.5">
                      {l.icon}
                      {l.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button type="button" onClick={() => go("courses")} className={linkCls("courses")} data-active={isActive(view, "courses") || view === "course-detail"}>
                Courses
              </button>

              <button type="button" onClick={() => go("plans")} className={linkCls("plans")} data-active={isActive(view, "plans")}>
                Plans
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "gold-underline inline-flex items-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition-colors",
                    MORE_LINKS.some((l) => l.view === view) ? "text-primary" : "text-foreground/75 hover:text-primary"
                  )}
                  data-active={MORE_LINKS.some((l) => l.view === view)}
                >
                  More <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  {MORE_LINKS.map((l) => (
                    <DropdownMenuItem key={l.view} onClick={() => go(l.view)} className="min-h-11 cursor-pointer gap-2.5">
                      {l.icon}
                      {l.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative min-h-11 min-w-11"
                onClick={() => setCartOpen(true)}
                aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden />
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[11px] font-bold text-primary">
                    {cartCount}
                  </span>
                ) : null}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm font-medium hover:bg-accent sm:px-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-hidden>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => go("dashboard")} className="min-h-11 cursor-pointer gap-2.5">
                      <LayoutDashboard className="h-4 w-4" aria-hidden /> My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="min-h-11 cursor-pointer gap-2.5 text-destructive">
                      <LogOut className="h-4 w-4" aria-hidden /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => go("login")} className="hidden min-h-11 sm:inline-flex">
                    <UserRound className="mr-1.5 h-4 w-4" aria-hidden /> Login
                  </Button>
                  <Button
                    onClick={() => go("register")}
                    className="min-h-11 bg-secondary px-4 font-semibold text-primary hover:bg-gold-bright"
                  >
                    <GraduationCap className="mr-1.5 h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Start Learning</span>
                    <span className="sm:hidden">Free</span>
                  </Button>
                </>
              )}

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="min-h-11 min-w-11 lg:hidden" aria-label="Open navigation menu">
                    <Menu className="h-5 w-5" aria-hidden />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto p-0">
                  <SheetHeader className="border-b border-border p-4 text-left">
                    <SheetTitle className="flex items-center gap-2">
                      { }
                      <img src="/brand/logo.png" alt="Niyatee IAS logo" className="h-8 w-auto" />
                    </SheetTitle>
                  </SheetHeader>
                  <MobileNav active={view} onNavigate={go} user={user} onLogout={logout} />
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <NavbarShellFallback />
        )}
      </nav>
    </motion.header>
  );
}

/** Radix-free shell shown during SSR + first paint — visually matches the
 *  loaded navbar to avoid layout shift, and matches the server HTML exactly so
 *  hydration never mismatches. */
function NavbarShellFallback() {
  return (
    <>
      <div className="hidden items-center gap-5 lg:flex" aria-hidden="true">
        {["w-12", "w-11", "w-20", "w-14", "w-16", "w-12"].map((w, i) => (
          <span key={i} className={cn("h-4 rounded-full bg-foreground/10", w)} />
        ))}
      </div>
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md" />
        <span className="hidden h-11 w-24 rounded-md sm:inline-flex" />
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden" />
      </div>
    </>
  );
}

function MobileNav({
  active,
  onNavigate,
  user,
  onLogout,
}: {
  active: string;
  onNavigate: (v: ViewName) => void;
  user: { name: string } | null;
  onLogout: () => void;
}) {
  const item = (v: ViewName, label: string, icon?: React.ReactNode) => (
    <button
      key={v}
      type="button"
      onClick={() => onNavigate(v)}
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active === v ? "bg-secondary/15 text-primary" : "text-foreground/80 hover:bg-accent hover:text-primary"
      )}
    >
      {icon ?? <Newspaper className="h-4 w-4 opacity-70" aria-hidden />}
      {label}
    </button>
  );

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
        <div className="space-y-1">
          {item("home", "Home", <Home className="h-4 w-4" aria-hidden />)}
          {item("news", "News & Current Affairs", <Newspaper className="h-4 w-4" aria-hidden />)}
          {item("resources", "Resources & PYQs", <BookMarked className="h-4 w-4" aria-hidden />)}
          {item("courses", "Courses", <GraduationCap className="h-4 w-4" aria-hidden />)}
          {item("plans", "AI Plans", <Sparkles className="h-4 w-4" aria-hidden />)}
        </div>
      </div>
      <div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">AI Tools</p>
        <div className="space-y-1">
          {AI_LINKS.map((l) => item(l.view, l.label, l.icon))}
        </div>
      </div>
      <div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">More</p>
        <div className="space-y-1">
          {MORE_LINKS.map((l) => item(l.view, l.label, l.icon))}
        </div>
      </div>
      <div className="border-t border-border pt-4">
        {user ? (
          <div className="space-y-1">
            {item("dashboard", "My Dashboard", <LayoutDashboard className="h-4 w-4" aria-hidden />)}
            <button
              type="button"
              onClick={onLogout}
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Log out
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {item("login", "Login", <UserRound className="h-4 w-4" aria-hidden />)}
            {item("register", "Register Free", <GraduationCap className="h-4 w-4" aria-hidden />)}
          </div>
        )}
        <p className="mt-4 px-3 text-xs text-muted-foreground">{SITE.hours}</p>
      </div>
    </div>
  );
}
