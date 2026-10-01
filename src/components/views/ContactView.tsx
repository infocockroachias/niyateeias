"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Headset,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Youtube,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiPost, pickArray, toErrorMessage, useApi, type Course, type Faq } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { clampWords, countWords } from "@/lib/format";
import { SITE } from "@/lib/site";
import { ErrorCard, FadeIn, SectionHeading } from "@/components/shared/blocks";
import { toast } from "sonner";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const MODES = [
  { value: "offline", label: "Offline Classroom (Bhubaneswar)" },
  { value: "online-live", label: "Online Live" },
  { value: "recorded", label: "Self-paced Recorded" },
  { value: "hybrid", label: "Hybrid" },
];

const STAGES = ["Foundation (start fresh)", "Prelims", "Mains", "Interview"];

const SOCIALS = [
  { href: SITE.instagram, label: "Instagram", handle: "@niyateeiasacademy", icon: Instagram },
  { href: SITE.youtube, label: "YouTube", handle: "@NiyateeIASAcademy", icon: Youtube },
  { href: SITE.x, label: "X (Twitter)", handle: "@niyateeias", icon: XIcon },
  { href: SITE.telegram, label: "Telegram", handle: "t.me/niyateeias", icon: Send },
];

/* ------------------------------ Contact methods ----------------------------- */

function ContactMethods() {
  const methods = [
    {
      icon: Phone,
      title: "Call Us",
      line1: SITE.phone,
      line2: SITE.hours,
      href: SITE.phoneHref,
      cta: "Call now",
    },
    {
      icon: MessageSquareText,
      title: "WhatsApp",
      line1: SITE.phone,
      line2: "Fastest replies · 9AM–9PM",
      href: SITE.whatsapp,
      cta: "Chat on WhatsApp",
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      line1: SITE.email,
      line2: `Admissions: ${SITE.admissionsEmail}`,
      href: SITE.emailHref,
      cta: "Write to us",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {methods.map((m) => (
        <a key={m.title} href={m.href} target={m.external ? "_blank" : undefined} rel={m.external ? "noopener noreferrer" : undefined} className="group">
          <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-secondary/60 group-hover:shadow-lg">
            <CardContent className="p-5">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                <m.icon className="h-5 w-5 text-gold" aria-hidden />
              </span>
              <h3 className="font-display text-lg font-bold text-primary">{m.title}</h3>
              <p className="mt-1 text-sm font-medium text-foreground/85">{m.line1}</p>
              <p className="text-xs text-muted-foreground">{m.line2}</p>
              <p className="mt-3 text-sm font-semibold text-secondary">{m.cta} →</p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}

/* --------------------------------- Enquiry form ----------------------------- */

export function ContactView() {
  const params = useAppStore((s) => s.params);
  const { data: coursesData } = useApi<{ courses: Course[] }>("/api/courses");
  const { data: faqData, isLoading: faqLoading, isError: faqError, refetch: faqRefetch } = useApi<{ faqs: Faq[] }>("/api/faq");
  const courses = useMemo(() => pickArray<Course>(coursesData, "courses"), [coursesData]);
  const faqs = useMemo(() => pickArray<Faq>(faqData, "faqs").slice(0, 6), [faqData]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    courseInterest: "",
    mode: "",
    stage: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Prefill from navigation params (course detail → "Enquire Now")
  useEffect(() => {
    if (params.course) {
      setForm((f) => ({ ...f, courseInterest: params.course, message: f.message || `I'm interested in ${params.course}. Please share batch details.` }));
    }
    if (params.message) {
      setForm((f) => ({ ...f, message: params.message }));
    }
  }, [params.course, params.message]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setMessage = (value: string) => setForm((f) => ({ ...f, message: clampWords(value, 50) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!/^[+\d][\d\s-]{8,14}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      await apiPost<{ ok: boolean; id: string }>("/api/enquiry", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim() || undefined,
        courseInterest: form.courseInterest || undefined,
        mode: form.mode || undefined,
        stage: form.stage || undefined,
        message: form.message.trim(),
      });
      toast.success("Enquiry received! A mentor will call you within 24 working hours.");
      setDone(true);
      setForm({ name: "", email: "", phone: "", city: "", courseInterest: "", mode: "", stage: "", message: "" });
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const words = countWords(form.message);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Contact"
          title="Talk to a Mentor — Not a Sales Desk"
          description="Ask about batches, fees, scholarships or your preparation plan. We reply within one working day."
        />

        <ContactMethods />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-primary">Enquiry Form</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {done ? "We've got your details — here's the form again if you'd like to send another." : "Fill this once; our admissions mentor calls you back."}
              </p>

              <form onSubmit={submit} className="mt-6 space-y-5" aria-label="Enquiry form">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cq-name">Full name *</Label>
                    <Input id="cq-name" required value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="Your name" className="min-h-11 bg-card" autoComplete="name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cq-email">Email *</Label>
                    <Input id="cq-email" type="email" required value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="you@example.com" className="min-h-11 bg-card" autoComplete="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cq-phone">Phone *</Label>
                    <Input id="cq-phone" type="tel" required value={form.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="+91 …" className="min-h-11 bg-card" autoComplete="tel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cq-city">City</Label>
                    <Input id="cq-city" value={form.city} onChange={(e) => set("city")(e.target.value)} placeholder="Bhubaneswar" className="min-h-11 bg-card" autoComplete="address-level2" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Course interest</Label>
                    <Select value={form.courseInterest} onValueChange={set("courseInterest")}>
                      <SelectTrigger className="min-h-11 w-full bg-card" aria-label="Course interest">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        <SelectItem value="general">General Counselling</SelectItem>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred mode</Label>
                    <Select value={form.mode} onValueChange={set("mode")}>
                      <SelectTrigger className="min-h-11 w-full bg-card" aria-label="Preferred mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODES.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preparation stage</Label>
                    <Select value={form.stage} onValueChange={set("stage")}>
                      <SelectTrigger className="min-h-11 w-full bg-card" aria-label="Preparation stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cq-message">Message</Label>
                    <span className={`text-xs font-semibold ${words >= 50 ? "text-destructive" : "text-muted-foreground"}`} aria-live="polite">
                      {words} / 50 words
                    </span>
                  </div>
                  <Textarea
                    id="cq-message"
                    value={form.message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Tell us your attempt year, background and what you're looking for…"
                    className="bg-card"
                  />
                </div>

                <Button type="submit" disabled={busy} className="min-h-12 w-full bg-secondary text-base font-semibold text-primary hover:bg-gold-bright">
                  {busy ? "Sending…" : "Send Enquiry"}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                  We never share your details. Expect one call, not ten.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Right column: map + socials */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-navy relative flex h-56 items-center justify-center" aria-hidden>
                <span className="absolute inset-0 bg-[radial-gradient(rgba(201,162,75,0.09)_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative text-center text-ivory">
                  <MapPin className="mx-auto h-10 w-10 text-gold" aria-hidden />
                  <p className="mt-3 font-display text-lg font-bold">Find Us in Infovalley</p>
                  <p className="mx-auto mt-1 max-w-xs text-xs text-ivory/70">{SITE.address}</p>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-secondary" aria-hidden /> {SITE.hours}
                  </div>
                  <Button asChild variant="outline" className="min-h-11 shrink-0">
                    <a href={SITE.mapsDirections} target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-1.5 h-4 w-4" aria-hidden /> Get Directions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold text-primary">Follow the Journey</h3>
                <p className="mt-1 text-sm text-muted-foreground">Daily current affairs, topper talks & class snippets.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-md"
                      aria-label={`${s.label} (opens in new tab)`}
                    >
                      <s.icon className="h-5 w-5 text-primary" aria-hidden />
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{s.label}</span>
                        <span className="block text-xs text-muted-foreground">{s.handle}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <FadeIn>
              <div className="rounded-2xl bg-navy p-6 text-ivory">
                <Headset className="h-8 w-8 text-gold" aria-hidden />
                <h3 className="mt-3 font-display text-xl font-bold">Free 30-minute Counselling</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                  Not sure where you stand? Get a free diagnostic session — syllabus mapping, attempt
                  planning and an honest read on your readiness.
                </p>
                <Button asChild className="mt-4 min-h-11 bg-secondary font-semibold text-primary hover:bg-gold-bright">
                  <a href={SITE.phoneHref}>Book a Slot: {SITE.phone}</a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-6 text-center font-display text-2xl font-bold text-primary">Before You Ask…</h2>
          {faqLoading ? (
            <ErrorCard message="Loading FAQs…" />
          ) : faqError ? (
            <ErrorCard message="Could not load FAQs." onRetry={() => void faqRefetch()} />
          ) : (
            <Accordion type="single" collapsible>
              {faqs.map((f) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
