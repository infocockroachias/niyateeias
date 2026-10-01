"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ViewName =
  | "home"
  | "about"
  | "news"
  | "resources"
  | "pyq-reader"
  | "ai-hub"
  | "ai-evaluate"
  | "ai-chat"
  | "ai-mcq"
  | "ai-geo"
  | "plans"
  | "courses"
  | "course-detail"
  | "rankers"
  | "books"
  | "test-series"
  | "contact"
  | "login"
  | "register"
  | "dashboard";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface CartItem {
  id: string;
  title: string;
  author: string;
  priceInr: number;
  qty: number;
  coverColor: string;
}

interface AppState {
  /** Current SPA view */
  view: ViewName;
  /** Free-form params synced into the hash query */
  params: Record<string, string>;
  /** Navigate to a view; syncs to location.hash e.g. "#/courses?id=gs-foundation" */
  navigate: (view: ViewName, params?: Record<string, string>) => void;
  /** Replace current params without adding a history entry */
  setParams: (params: Record<string, string>) => void;
  /** Authed user (null when logged out) */
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  /** Chat widget open state */
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  /** Cart sheet open state */
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** Book shop cart */
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  decrementCart: (id: string) => void;
  clearCart: () => void;
}

/** Parse "#/news?date=2025-09-30" → { view: "news", params: { date: "..." } } */
export function parseHash(hash: string): { view: ViewName; params: Record<string, string> } {
  const raw = hash.replace(/^#\/?/, "");
  const [pathPart, queryPart] = raw.split("?");
  const params: Record<string, string> = {};
  if (queryPart) {
    const sp = new URLSearchParams(queryPart);
    sp.forEach((v, k) => {
      params[k] = v;
    });
  }
  return { view: (pathPart || "home") as ViewName, params };
}

/** Serialize view + params back into a hash string */
export function buildHash(view: ViewName, params?: Record<string, string>): string {
  const base = `#/${view}`;
  if (!params || Object.keys(params).length === 0) return base;
  const sp = new URLSearchParams(params);
  return `${base}?${sp.toString()}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "home",
      params: {},
      navigate: (view, params) => {
        set({ view, params: params ?? {} });
        if (typeof window !== "undefined") {
          const target = buildHash(view, params);
          if (window.location.hash !== target) {
            window.location.hash = target;
          }
        }
      },
      setParams: (params) => {
        set({ params });
        if (typeof window !== "undefined") {
          const target = buildHash(get().view, params);
          if (window.location.hash !== target) {
            window.location.hash = target;
          }
        }
      },
      user: null,
      setUser: (u) => set({ user: u }),
      chatOpen: false,
      setChatOpen: (open) => set({ chatOpen: open }),
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      cart: [],
      addToCart: (item) =>
        set((s) => {
          const existing = s.cart.find((c) => c.id === item.id);
          if (existing) {
            return {
              cart: s.cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)),
            };
          }
          return { cart: [...s.cart, { ...item, qty: 1 }] };
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      decrementCart: (id) =>
        set((s) => ({
          cart: s.cart
            .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
            .filter((c) => c.qty > 0),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "niyatee-app",
      storage: createJSONStorage(() => localStorage),
      // Only persist meaningful client state; view stays hash-driven
      partialize: (s) => ({ user: s.user, cart: s.cart }),
      skipHydration: true,
    }
  )
);

/** Local quiz attempt log (client-side, no auth required) */
export interface QuizAttemptLocal {
  subject: string;
  difficulty: string;
  score: number;
  total: number;
  at: string;
}

const QUIZ_KEY = "niyatee-quiz-attempts";

export function loadQuizAttempts(): QuizAttemptLocal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUIZ_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuizAttemptLocal[]) : [];
  } catch {
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizAttemptLocal): void {
  if (typeof window === "undefined") return;
  const all = [...loadQuizAttempts(), attempt].slice(-30);
  try {
    window.localStorage.setItem(QUIZ_KEY, JSON.stringify(all));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}
