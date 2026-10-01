"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, toErrorMessage, type SessionUser } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { SITE } from "@/lib/site";
import { toast } from "sonner";

const PERKS = [
  "AI Doubt Agent: ask anything, anytime",
  "1 free AI Mains answer evaluation",
  "Daily GS-tagged current affairs",
  "Bookmarks synced to your dashboard",
];

function AuthAside() {
  return (
    <aside className="hidden bg-navy p-10 text-ivory lg:flex lg:flex-col lg:justify-between" aria-hidden>
      <div>
        <div className="flex items-center gap-3">
          { }
          <img src="/brand/logo.png" alt="" className="h-10 w-auto rounded-md bg-white/5 p-1" />
        </div>
        <p className="mt-8 font-hindi text-4xl font-bold text-gold" lang="hi">नियती</p>
        <p className="mt-2 font-display text-xl">{SITE.tagline}</p>
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold">Free forever. Seriously.</h3>
        <ul className="mt-5 space-y-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-ivory/80">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-white/10 pt-4 text-xs text-ivory/50">
          Enrolled students get unlimited AI credits with their course.
        </p>
      </div>
    </aside>
  );
}

export function RegisterView() {
  const navigate = useAppStore((s) => s.navigate);
  const setUser = useAppStore((s) => s.setUser);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const data = await apiPost<{ user: SessionUser }>("/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setUser(data.user);
      toast.success(`Welcome to Niyatee, ${data.user.name}! Your AI toolkit is unlocked.`);
      navigate("dashboard");
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <AuthAside />
            <CardContent className="p-8 sm:p-10">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="font-display text-3xl font-bold text-primary">Start Learning Free</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  One account for the AI tools, news room and your personal dashboard.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5" aria-label="Registration form">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full name</Label>
                    <Input id="reg-name" required autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your name" className="min-h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="min-h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" required minLength={6} autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="Minimum 6 characters" className="min-h-11" />
                  </div>
                  <Button type="submit" disabled={busy} className="min-h-12 w-full bg-secondary font-semibold text-primary hover:bg-gold-bright">
                    {busy ? "Creating account…" : <> <UserPlus className="mr-2 h-4 w-4" aria-hidden /> Create Free Account</>}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <button type="button" onClick={() => navigate("login")} className="inline-flex items-center gap-1 font-semibold text-gold-ink hover:underline">
                    Log in <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </p>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <LogIn className="h-3.5 w-3.5 text-gold-ink" aria-hidden />
                  By registering you agree to receive study updates. No spam, ever.
                </p>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
