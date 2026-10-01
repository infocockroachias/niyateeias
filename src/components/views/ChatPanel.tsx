"use client";

import { useEffect, useRef, useState } from "react";
import { BookMarked, RotateCcw, SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiPost, toErrorMessage, type ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SUGGESTIONS = [
  "How to choose my optional subject?",
  "Explain RBI's MPC inflation targeting",
  "President's Rule under Article 356",
  "India–Sri Lanka relations",
];

interface LocalMsg extends ChatMessage {
  mode?: "ai" | "kb";
  sources?: string[];
}

const GREETING: LocalMsg = {
  role: "assistant",
  content:
    "Namaste! I'm the Niyatee Doubt Agent — your 24×7 UPSC mentor. Ask me anything about polity, economy, history, geography, strategy or the syllabus. For best answers, mention your attempt year and stage (Prelims/Mains).",
};

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<LocalMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const data = await apiPost<{ reply: string; mode?: "ai" | "kb"; sources?: string[] }>(
        "/api/ai/chat",
        {
          messages: nextMessages.filter((m) => m !== GREETING || messages.length === 1),
        }
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, mode: data.mode, sources: data.sources },
      ]);
    } catch (err) {
      toast.error(toErrorMessage(err));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          mode: "kb",
          content: "I couldn't reach the mentor network just now. Please retry — meanwhile you can browse today's curated current affairs in the News Room.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setMessages([GREETING]);
    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Messages */}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 space-y-4 overflow-y-auto nice-scroll",
          compact ? "p-3" : "p-4 sm:p-6"
        )}
        aria-label="Chat messages"
        role="log"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                m.role === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-border bg-card text-foreground"
              )}
            >
              {m.role === "assistant" && i === 0 ? (
                <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-secondary">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden /> Niyatee Doubt Agent
                </span>
              ) : null}
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.role === "assistant" && i !== 0 ? (
                <p className="mt-2 flex flex-wrap items-center gap-1 border-t border-border/60 pt-1.5 text-[10px] text-muted-foreground">
                  {m.mode === "kb" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-1.5 py-0.5 font-semibold text-[#7a5c2e]">
                      <BookMarked className="h-3 w-3" aria-hidden /> Curated knowledge base
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-1.5 py-0.5 font-semibold text-primary/80">
                      <Sparkles className="h-3 w-3" aria-hidden /> AI Mentor
                    </span>
                  )}
                  {m.sources && m.sources.length > 0 ? (
                    <span className="truncate"> · {m.sources.join(" · ")}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        ))}

        {busy ? (
          <div className="flex justify-start" aria-label="Agent is typing">
            <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !busy ? (
        <div className={cn("flex flex-wrap gap-2 border-t border-border", compact ? "px-3 py-2" : "px-4 py-3 sm:px-6")}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="min-h-9 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1.5 text-xs font-medium text-[#7a5c2e] transition-colors hover:bg-secondary/25"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className={cn("flex items-end gap-2 border-t border-border bg-muted/40", compact ? "p-3" : "p-4 sm:px-6")}
      >
        <label htmlFor={compact ? "chat-widget-input" : "chat-view-input"} className="sr-only">
          Ask your doubt
        </label>
        <Textarea
          id={compact ? "chat-widget-input" : "chat-view-input"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={compact ? 1 : 2}
          placeholder="Type your doubt… (Enter to send)"
          className="min-h-11 resize-none bg-card"
          disabled={busy}
        />
        <Button
          type="submit"
          size="icon"
          disabled={busy || !input.trim()}
          className="min-h-11 min-w-11 shrink-0 bg-primary text-gold hover:bg-navy-800"
          aria-label="Send message"
        >
          <SendHorizonal className="h-4 w-4" aria-hidden />
        </Button>
        {messages.length > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={reset}
            className="min-h-11 min-w-11 shrink-0 text-muted-foreground"
            aria-label="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </form>
    </div>
  );
}
