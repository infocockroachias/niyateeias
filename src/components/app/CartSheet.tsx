"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/blocks";

export function CartSheet() {
  const open = useAppStore((s) => s.cartOpen);
  const setOpen = useAppStore((s) => s.setCartOpen);
  const cart = useAppStore((s) => s.cart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const decrementCart = useAppStore((s) => s.decrementCart);
  const clearCart = useAppStore((s) => s.clearCart);

  const total = cart.reduce((sum, c) => sum + c.priceInr * c.qty, 0);
  const count = cart.reduce((n, c) => n + c.qty, 0);

  const checkout = () => {
    toast.success("Demo checkout, online payments are coming soon. Our team will call you to confirm your order!");
    clearCart();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-[92vw] max-w-md flex-col p-0 sm:w-[400px]">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" aria-hidden /> Your Cart
            {count > 0 ? <span className="text-sm font-normal text-muted-foreground">({count} item{count === 1 ? "" : "s"})</span> : null}
          </SheetTitle>
          <SheetDescription>UPSC books &amp; study material from the Niyatee bookshop.</SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              title="Your cart is empty"
              hint="Browse the bookshop and add mentor-approved UPSC titles."
              icon={<ShoppingBag className="h-5 w-5 text-muted-foreground" />}
              className="w-full border-0 bg-transparent"
            />
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto p-4 nice-scroll" aria-label="Cart items">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span
                    aria-hidden
                    className="flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-md text-[8px] font-bold uppercase tracking-wide text-white/90"
                    style={{ backgroundColor: item.coverColor }}
                  >
                    NIYATEE
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.author}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => decrementCart(item.id)}
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        <Minus className="h-3 w-3" aria-hidden />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          useAppStore.getState().addToCart({
                            id: item.id,
                            title: item.title,
                            author: item.author,
                            priceInr: item.priceInr,
                            coverColor: item.coverColor,
                          })
                        }
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        <Plus className="h-3 w-3" aria-hidden />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-sm font-bold text-primary">{inr(item.priceInr * item.qty)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-primary">{inr(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Shipping &amp; taxes calculated at confirmation.</p>
              <Button
                onClick={checkout}
                className="mt-3 min-h-11 w-full bg-secondary font-semibold text-primary hover:bg-gold-bright"
              >
                Checkout · {inr(total)}
              </Button>
              <Separator className="my-3" />
              <p className="text-center text-xs text-muted-foreground">
                Prefer offline? Call +91 97776 43159 to order by phone.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
