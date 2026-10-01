"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, LogIn, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, toErrorMessage, type SessionUser } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { SITE } from "@/lib/site";
import { toast } from "sonner";

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
      <div className="space-y-4">
        <div className="flex gap-3 rounded-xl bg-white/5 p-4">
          <Star className="h-5 w-5 shrink-0 fill-gold text-gold" />
          <p className="text-sm leading-relaxed text-ivory/80">
            &ldquo;The daily answer-writing feedback changed everything for me. My Mains score jumped
            68 marks between attempts.&rdquo;
          </p>
        </div>
        <p className="text-xs text-ivory/50">— A student who stopped guessing and started measuring.</p>
        <ul className="space-y-2 pt-4 text-sm text-ivory/75">
          <li>✓ AI evaluation on every answer</li>
          <li>✓ 24×7 doubt agent</li>
          <li>✓ Daily curated current affairs</li>
        </ul>
      </div>
    </aside>
  );
}

export function LoginView() {
  const navigate = useAppStore((s) => s.navigate);
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiPost<{ user: SessionUser }>("/api/auth/login", { email: email.trim(), password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
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
                <h1 className="font-display text-3xl font-bold text-primary">Welcome back, aspirant</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Log in to reach your dashboard — bookmarks, quiz history and AI credits.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5" aria-label="Login form">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="min-h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="min-h-11"
                    />
                  </div>
                  <Button type="submit" disabled={busy} className="min-h-12 w-full bg-primary font-semibold text-primary-foreground hover:bg-navy-800">
                    {busy ? "Logging in…" : <> <LogIn className="mr-2 h-4 w-4" aria-hidden /> Log In</>}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  New to Niyatee?{" "}
                  <button type="button" onClick={() => navigate("register")} className="inline-flex items-center gap-1 font-semibold text-secondary hover:underline">
                    Create a free account <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </p>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-secondary" aria-hidden />
                  Demo tip: register first, then log in — accounts persist on the server.
                </p>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
