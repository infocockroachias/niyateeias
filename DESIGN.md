# Niyatee IAS — Design System

> Adopted and distilled from the **Impeccable** design language (pbakaus/impeccable), the
> **Design & Taste** skill (h3nryprod01/design-taste, itself a synthesis of Emil Kowalski's
> design-engineering, impeccable, and taste-skill), and Anthropic's frontend-design guidance.
> This document is binding for every future UI change in this repository.

## 1. Design read

- **Surface modes**: marketing pages (home, courses, about) run in *Persuade*; app surfaces
  (reader, AI tools, dashboard, news) run in *Operate*; long-form (news articles, PYQ papers)
  run in *Read*.
- **Dials (Persuade)**: variance 7 / motion 5 / density 4. **(Operate)**: variance 3 / motion 3 /
  density 6. **(Read)**: variance 5 / motion 3 / density 4.
- **Aesthetic family**: institutional prestige, not startup gloss. The brand is navy `#0a1b3d`
  + gold `#c9a24b` + silver paper (drawn from the actual Niyatee logo: silver NIYATEE, gold IAS).
  Gold is an accent (≤10% of any surface), never a wash.

## 2. Typography

| Role | Face | Notes |
|---|---|---|
| Display / headings | **Cabinet Grotesk** (ITF via Fontshare, self-hosted, 500/700/800) | Slightly tightened tracking (-0.01em); `text-wrap: balance` on h1-h3 |
| Body / UI | **Satoshi** (ITF via Fontshare, self-hosted, 400/500/700) | 16px floor, line-height 1.5-1.6, measure ≤ 65-75ch on prose |
| Devanagari motif | **Noto Sans Devanagari** (500/700) | Only for नियती wordmark usage |

- Fonts are self-hosted woff2 (`src/fonts/`) loaded via `next/font/local`: no external font CDN
  dependency at runtime, no invisible-text reflow.
- Hierarchy comes from scale + weight + color, never from raw size alone. No all-caps body copy.
- Why not Inter/Playfair: they are the reflex AI pairing; Cabinet Grotesk + Satoshi carry the
  same discipline with a distinctive, human voice (and an Indian Type Foundry pedigree that
  fits the brand).

## 3. Color

- Canvas `#f4f5f7` (silver paper), card `#ffffff`, ink `#121a2b`, navy `#0a1b3d`,
  navy-deep `#060f26`, gold `#c9a24b`, gold-bright `#d4aa2a`, gold-ink `#8a6d2f`.
- **Contrast rules (WCAG AA)**: body ≥ 4.5:1, large text ≥ 3:1.
  - Small gold text/icons on light surfaces must use `text-gold-ink` (`#8a6d2f`), never raw gold.
  - Raw gold `text-gold` is reserved for text/icons on navy surfaces (≥ 7:1 there).
  - Muted body text is `#4a5364` (≥ 7:1 on canvas), tinted toward the brand hue, not gray.
- One accent (gold), locked across every page. No second accent. No pure `#000`/`#fff`.
- No AI-purple, no neon glow, no cream+brass template, no gradient text.

## 4. Shape, depth, layout

- One radius system: 12px inputs/buttons (`--radius: 0.75rem`), cards 16px max (`rounded-2xl`).
  Never 24px+ on cards. Full-pill only for chips/tags.
- Cards only when elevation communicates hierarchy; prefer borders, dividers and spacing.
  Nested cards are always wrong.
- Shadows: tinted to the surface hue, blur ≤ 8px unless a real elevation step; a border +
  big soft shadow ("ghost card") together is banned.
- No colored `border-left/right` > 1px side-stripes on cards/callouts. Use full borders +
  tinted backgrounds (see Prelims/Mains blocks in the news reader).
- Responsive grids via `repeat(auto-fit, minmax(...))` where applicable; single column below 768px.

## 5. Motion

- One curve everywhere: `--ease-swift: cubic-bezier(0.23, 1, 0.32, 1)`; enter 150-300ms.
- Animate only `transform` and `opacity` (+ blur/clip when measured). Nothing animates from
  `scale(0)`; buttons get `:active { scale(0.98) }`.
- `prefers-reduced-motion` is honored globally (globals.css) and per-component.
- Every animation must justify itself: feedback, state change, or hierarchy. One authored
  moment per page, not scattered effects.

## 6. Copy rules (the human touch)

- **Zero em-dashes (U+2014/U+2013 as separators) in visible copy.** Use commas, colons,
  periods or parentheses. This is the single most-violated AI tell.
- No filler verbs (elevate / empower / seamless / supercharge / world-class). Button labels
  are verb + object ("Book Free Counselling", not "OK").
- **Honesty over marketing**: no invented numbers or claims the institute cannot verify
  (e.g. no "100+ selections"; the academy is new). Results language is forward-looking
  ("results will be published here as founding cohorts clear their cycles").
- No eyebrow micro-labels above section headings (the uppercase tracked kicker is banned).
  Headings carry their own weight. No "AI Tool 01" numbering, no status-dot decoration,
  no scroll cues, no version stamps.

## 7. Components

- shadcn/ui is customized via tokens in `globals.css`, never used in default gray.
- Buttons: `active:scale-[0.98]`; on navy sections outline buttons are transparent with
  `border-ivory/50 text-ivory` (ivory-on-ivory is the classic invisible-button bug).
- Every interactive element ships default, hover, focus-visible, active, disabled states.
  Focus ring is gold, 2px offset 2px.
- Forms: labels above inputs, errors below, `aria-describedby` wired; touch targets ≥ 44px.
- Icons: lucide only (shadcn/ui project), consistent stroke, never emoji as UI icons.
- Browser surfaces are themed: selection (gold/navy), scrollbars (navy/gold on paper),
  caret, focus rings.

## 8. Pre-flight (before shipping any UI change)

1. Zero em-dashes in user-visible strings.
2. Contrast pass on every CTA, label and placeholder against its actual background.
3. Eyebrow count = 0. No section numbering. No decorative dots.
4. One theme per page (no section inversion), one accent, one radius system.
5. Buttons visible on both silver and navy surfaces; press feedback present.
6. Copy self-audit: read every visible string; no broken grammar, no fake precision.
7. Verify desktop (1366px) and mobile (390px) in the browser, light theme.
8. `bun run lint` clean.
