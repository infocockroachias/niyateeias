"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi, pickArray, type Book } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { CardsSkeleton, ErrorCard, FadeIn, SectionHeading } from "@/components/shared/blocks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BooksView() {
  const navigate = useAppStore((s) => s.navigate);
  const addToCart = useAppStore((s) => s.addToCart);
  const cart = useAppStore((s) => s.cart);
  const cartIds = useMemo(() => new Set(cart.map((c) => c.id)), [cart]);
  const { data, isLoading, isError, refetch } = useApi<{ books: Book[] }>("/api/books");

  const [category, setCategory] = useState<string>("all");
  const books = useMemo(() => pickArray<Book>(data, "books"), [data]);
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(books.map((b) => b.category)))],
    [books]
  );
  const filtered = useMemo(
    () => (category === "all" ? books : books.filter((b) => b.category === category)),
    [books, category]
  );

  const add = (b: Book) => {
    addToCart({ id: b.id, title: b.title, author: b.author, priceInr: b.priceInr, coverColor: b.coverColor });
    toast.success(`Added “${b.title}” to cart.`);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Bookshop"
          title="Mentor-Approved UPSC Books"
          description="Handpicked titles and Niyatee's own printed notes — the exact material our classroom toppers use."
        />

        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Book category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
              )}
            >
              {c === "all" ? "All Books" : c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <CardsSkeleton count={6} />
        ) : isError ? (
          <ErrorCard message="Could not load the bookshop." onRetry={() => void refetch()} />
        ) : filtered.length === 0 ? (
          <ErrorCard message="No books in this shelf yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((b, i) => (
              <FadeIn key={b.id} delay={(i % 4) * 0.05}>
                <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Stylized cover */}
                  <div
                    className="relative flex h-44 flex-col justify-between p-4 text-white"
                    style={{ backgroundColor: b.coverColor }}
                    aria-hidden
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">Niyatee Press</span>
                    <div>
                      <p className="font-display text-lg font-bold leading-snug drop-shadow">{b.title}</p>
                      <p className="mt-1 text-xs opacity-80">{b.author}</p>
                    </div>
                    <span className="absolute right-3 top-3 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase">
                      {b.category}
                    </span>
                  </div>
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1" aria-label={`Rated ${b.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={cn(
                            "h-3.5 w-3.5",
                            si < Math.round(b.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"
                          )}
                          aria-hidden
                        />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">{b.rating.toFixed(1)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{b.description}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-xl font-bold text-primary">{inr(b.priceInr)}</span>
                      {b.mrpInr > b.priceInr ? (
                        <span className="text-sm text-muted-foreground line-through">{inr(b.mrpInr)}</span>
                      ) : null}
                      {b.mrpInr > b.priceInr ? (
                        <span className="text-xs font-bold text-emerald-700">
                          {Math.round(((b.mrpInr - b.priceInr) / b.mrpInr) * 100)}% off
                        </span>
                      ) : null}
                    </div>
                    <Button
                      onClick={() => add(b)}
                      className={cn("mt-4 min-h-11 w-full", cartIds.has(b.id) && "opacity-90")}
                      aria-label={`Add ${b.title} to cart`}
                    >
                      <ShoppingCart className="mr-1.5 h-4 w-4" aria-hidden />
                      {cartIds.has(b.id) ? "Add Another" : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 text-secondary" aria-hidden />
          Free delivery in Bhubaneswar · Cash on delivery available ·{" "}
          <button type="button" onClick={() => navigate("contact")} className="font-semibold text-secondary hover:underline">
            bulk orders for batches
          </button>
        </p>
      </div>
    </div>
  );
}
