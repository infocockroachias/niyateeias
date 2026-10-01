"use client";

import { useMemo } from "react";
import { CheckCircle2, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useApi, pickArray, type Faq, type Plan } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { CardsSkeleton, ErrorCard, FadeIn, SectionHeading } from "@/components/shared/blocks";
import { cn } from "@/lib/utils";

export function PlansView() {
  const navigate = useAppStore((s) => s.navigate);
  const { data, isLoading, isError, refetch } = useApi<{ plans: Plan[] }>("/api/plans");
  const plans = useMemo(() => pickArray<Plan>(data, "plans"), [data]);
  const { data: faqData } = useApi<{ faqs: Faq[] }>("/api/faq");
  const aiFaqs = useMemo(() => {
    const all = pickArray<Faq>(faqData, "faqs");
    const filtered = all.filter((f) => f.category.toLowerCase().includes("ai") || f.question.toLowerCase().includes("ai"));
    return (filtered.length > 0 ? filtered : all).slice(0, 4);
  }, [faqData]);

  const choose = (p: Plan) => {
    navigate("contact", { course: `${p.name} AI Plan`, message: `I'm interested in the ${p.name} AI plan (${p.priceInr > 0 ? inr(p.priceInr) + "/" + p.period : "Free"}).` });
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Unlock the Full Niyatee AI Ecosystem"
          description="The Doubt Agent answers for free. Heavy lifting (unlimited Mains evaluations and MCQ generation) runs on plan credits."
        />

        {isLoading ? (
          <CardsSkeleton count={3} />
        ) : isError ? (
          <ErrorCard message="Could not load plans." onRetry={() => void refetch()} />
        ) : plans.length === 0 ? (
          <ErrorCard message="Plans are being finalised, call +91 97776 43159 in the meantime." />
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.08}>
                <Card
                  className={cn(
                    "relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                    p.highlight
                      ? "border-2 border-secondary shadow-lg shadow-secondary/10 lg:-my-3 lg:py-3"
                      : "border-border"
                  )}
                >
                  {p.highlight ? (
                    <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-secondary px-4 py-1 text-xs font-bold text-primary shadow">
                      <Crown className="h-3.5 w-3.5" aria-hidden /> Most Popular
                    </span>
                  ) : null}
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-center gap-2">
                      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", p.highlight ? "bg-secondary/20" : "bg-muted")}>
                        {p.highlight ? <Zap className="h-5 w-5 text-[#7a5c2e]" aria-hidden /> : <Sparkles className="h-5 w-5 text-gold-ink" aria-hidden />}
                      </span>
                      <h2 className="font-display text-2xl font-bold text-primary">{p.name}</h2>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>

                    <p className="mt-5">
                      <span className="font-display text-4xl font-bold text-primary">
                        {p.priceInr > 0 ? inr(p.priceInr) : "Free"}
                      </span>
                      {p.priceInr > 0 ? <span className="text-sm text-muted-foreground">/{p.period}</span> : null}
                    </p>
                    <p className="mt-1 inline-flex w-fit rounded-full bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                      {p.aiCredits}
                    </p>

                    <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                          <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlight ? "text-gold-ink" : "text-primary/50")} aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => choose(p)}
                      className={cn(
                        "mt-6 min-h-12 w-full font-semibold",
                        p.highlight
                          ? "bg-secondary text-primary hover:bg-gold-bright"
                          : ""
                      )}
                      variant={p.highlight ? "default" : "outline"}
                    >
                      {p.priceInr > 0 ? `Choose ${p.name}` : "Start Free"}
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans are <strong className="text-primary">free for enrolled classroom students</strong>, your course fee already includes full AI access.
        </p>

        {/* FAQ mini */}
        {aiFaqs.length > 0 ? (
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="mb-6 text-center font-display text-2xl font-bold text-primary">Plan FAQs</h2>
            <Accordion type="single" collapsible>
              {aiFaqs.map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>
    </div>
  );
}
