"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { apiGet, type SessionUser } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  );

  useEffect(() => {
    // Rehydrate persisted (user + cart) state after mount to avoid SSR mismatch
    void useAppStore.persist.rehydrate();
    // Sync session with the backend (cookie-based)
    apiGet<{ user: SessionUser | null }>("/api/auth/me")
      .then((data) => {
        useAppStore.getState().setUser(data?.user ?? null);
      })
      .catch(() => {
        /* offline / backend not ready — keep local state */
      });
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
