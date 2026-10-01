"use client";

import { MessagesSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatPanel } from "./ChatPanel";

export function AIChatView({ embedded = false }: { embedded?: boolean }) {
  if (embedded) return <ChatPanel compact />;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">AI Tool 02</p>
          <h1 className="font-display text-4xl text-balance text-primary sm:text-5xl">AI Doubt Agent</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A mentor persona that knows the UPSC syllabus inside-out. Ask about concepts, current
            affairs, strategy, optional selection — it answers with structure and sources.
          </p>
        </div>

        <Card className="flex h-[70vh] min-h-[480px] flex-col overflow-hidden">
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <ChatPanel />
          </CardContent>
        </Card>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <MessagesSquare className="h-4 w-4 text-secondary" aria-hidden />
          Tip: mention your optional subject and attempt year for sharper guidance. Answers are AI-generated — verify facts from standard sources.
        </p>
      </div>
    </div>
  );
}
