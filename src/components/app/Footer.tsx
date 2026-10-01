"use client";

import { useState } from "react";
import { Instagram, Mail, MapPin, Phone, Send, Youtube, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost, toErrorMessage } from "@/lib/api";
import { useAppStore, type ViewName } from "@/lib/store";
import { SITE } from "@/lib/site";
import { toast } from "sonner";

const QUICK_LINKS: { view: ViewName; label: string }[] = [
  { view: "news", label: "News & Current Affairs" },
  { view: "resources", label: "Resources & PYQs" },
  { view: "courses", label: "Courses" },
  { view: "ai-hub", label: "AI Tools" },
  { view: "plans", label: "AI Plans" },
];

const SUPPORT_LINKS: { view: ViewName; label: string }[] = [
  { view: "books", label: "Books Shop" },
  { view: "test-series", label: "Test Series" },
  { view: "rankers", label: "Rankers" },
  { view: "about", label: "About Us" },
  { view: "contact", label: "Contact & Counselling" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: SITE.instagram, label: "Instagram", icon: Instagram },
  { href: SITE.youtube, label: "YouTube", icon: Youtube },
  { href: SITE.x, label: "X (Twitter)", icon: XIcon },
  { href: SITE.telegram, label: "Telegram", icon: Send },
];

export function Footer() {
  const navigate = useAppStore((s) => s.navigate);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await apiPost("/api/newsletter", { email });
      toast.success("Subscribed! The weekly current-affairs brief is on its way.");
      setEmail("");
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="mt-auto bg-navy text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              { }
              <img src="/brand/logo.png" alt="Niyatee IAS logo" className="h-10 w-auto rounded-md bg-white/5 p-1" />
            </div>
            <p className="mt-4 font-hindi text-lg font-bold text-gold" lang="hi">
              नियती, <span className="text-ivory/80">Destiny</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ivory/70">
              {SITE.positioning}. Guiding aspirants from Prelims to Interview with expert mentorship and an
              AI-integrated ecosystem.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in new tab)`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer quick links">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.view}>
                  <button
                    type="button"
                    onClick={() => navigate(l.view)}
                    className="min-h-11 py-1 text-sm text-ivory/75 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer support links">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Support</h3>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.view}>
                  <button
                    type="button"
                    onClick={() => navigate(l.view)}
                    className="min-h-11 py-1 text-sm text-ivory/75 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Reach Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-ivory/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{SITE.address}</span>
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex min-h-11 items-center gap-2.5 hover:text-gold">
                  <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.emailHref} className="flex min-h-11 items-center gap-2.5 hover:text-gold">
                  <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden /> {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{SITE.hours}</span>
              </li>
            </ul>
            <form onSubmit={subscribe} className="mt-5" aria-label="Newsletter subscription">
              <label htmlFor="footer-newsletter" className="mb-2 block text-xs font-medium uppercase tracking-wider text-ivory/60">
                Weekly current-affairs brief
              </label>
              <div className="flex gap-2">
                <Input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-h-11 border-ivory/20 bg-white/10 text-ivory placeholder:text-ivory/40"
                />
                <Button type="submit" disabled={busy} className="min-h-11 shrink-0 bg-secondary text-primary hover:bg-gold-bright">
                  {busy ? "…" : "Join"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-ivory/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Niyatee Civil Services Academy. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => toast.info("Privacy Policy, coming soon.")}
              className="min-h-11 hover:text-gold"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => toast.info("Terms of Use, coming soon.")}
              className="min-h-11 hover:text-gold"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
