"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { ChatPanel } from "@/components/views/ChatPanel";

export function ChatWidget() {
  const open = useAppStore((s) => s.chatOpen);
  const setOpen = useAppStore((s) => s.setChatOpen);

  return (
    <>
      {/* Floating launcher button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.35, ease: "easeOut" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close AI Doubt Agent" : "Open AI Doubt Agent chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-gold shadow-xl ring-2 ring-gold/40 transition-colors hover:bg-navy-800 sm:right-6"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Sparkles className="h-6 w-6" aria-hidden />}
        <span className="pointer-events-none absolute whitespace-nowrap rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground opacity-0 transition-opacity peer-hover:opacity-100 -left-24"></span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(560px,72vh)] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:right-6"
            aria-label="AI Doubt Agent chat panel"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border bg-navy px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15" aria-hidden>
                  <Sparkles className="h-4 w-4 text-gold" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ivory">Niyatee Doubt Agent</p>
                  <p className="text-[11px] text-ivory/60">AI mentor · UPSC-aware answers</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-9 min-w-9 text-ivory/70 hover:bg-white/10 hover:text-ivory"
                onClick={() => setOpen(false)}
                aria-label="Close chat panel"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </header>
            <ChatPanel compact />
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
