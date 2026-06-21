# NYP Tech Incubator — Landing Page Redesign

**Date:** 2026-06-21
**Status:** Approved design, pending spec review
**Scope:** Single-page marketing site redesign (`src/routes/index.tsx` + supporting files)

## 1. Goal

Redesign the NYP Technopreneurship Club landing page so its single, focused job is to
**convince visitors to apply to the incubator program**. The page must clearly answer:

- **What** the program is
- **Who** it is for
- **Why** someone should join
- **How** they apply

## 2. Design concept

**Y Combinator's clean, structured layout + Sequoia Capital's raw, hand-drawn storytelling, rendered in white + blue.**

The page reads confident and trustworthy (YC), while feeling youthful, approachable, and
founder-focused through tasteful hand-drawn sketch accents (Sequoia). The structure stays
minimal and uncluttered — sketches are *accents*, never clutter.

## 3. Visual system

- **Mode:** Light only. White background, near-black text. The forced `.dark` wrapper on the
  page is removed.
- **Brand color:** A confident royal blue (~`#2563EB`) as the single primary brand color —
  buttons, links, highlights, and two full-width solid-blue blocks (hero + final CTA). A deeper
  blue for the solid blocks. Brand tokens defined in `src/styles.css`.
- **Typography:**
  - **Geist** (already loaded) — clean sans for body and UI. Provides the YC clarity.
  - **Fraunces** (variable serif, added via `@fontsource-variable/fraunces`) — used only for
    a few storytelling headlines and pull-quotes. Provides the warm, editorial Sequoia feel.
- **Sketch layer (Sequoia signature):** Reusable **inline-SVG hand-drawn elements** drawn in
  blue "ink" — squiggly underline under a hero keyword, doodle arrows pointing at CTAs, hand-drawn
  step icons, dashed connectors between "How it works" steps, and a rough frame around quotes.
  No external image dependencies. **Balanced accent level**: present at key moments only; the rest
  of the page stays clean and minimal.

## 4. Page structure (single page, anchor navigation)

| # | Section | Purpose | Notes |
|---|---------|---------|-------|
| 1 | **Navbar** | Persistent CTA | Fixed, white/blur. Logo, anchor links (Program · Benefits · How it works · FAQ), blue **Apply** button. |
| 2 | **Hero** | Hook + primary CTA | Solid-blue block. Big headline w/ hand-drawn squiggle under one word, subhead, `Apply now →` + "How it works", "Applications open — Cohort [X]" badge, subtle doodles. |
| 3 | **Trust band** | Social proof | `[X]+ startups · [Y]+ students · [Z] cohorts`, hand-drawn separators. |
| 4 | **Program overview** | *What it is* | Storytelling 2-column + sketch illustration. Serif headline. |
| 5 | **Benefits** | *Why join* | Card grid: funding, mentorship, network, workspace, Demo Day, lifelong community. Each w/ sketch icon. |
| 6 | **Who should apply** | *Who it's for* | Personas + reassurance ("you don't need a finished idea"). Sketch checkmarks. |
| 7 | **How it works** | *How to apply* | Steps: Apply → Interview → Build (6 mo) → Demo Day → Alumni. Hand-drawn numbered steps + dashed connectors. |
| 8 | **Success stories** | Proof / aspiration | Placeholder startups + founder quotes in sketch-framed cards. |
| 9 | **FAQ** | Remove objections | Accordion: eligibility, cost/equity, time commitment, deadlines, idea readiness. |
| 10 | **Final CTA** | Conversion | Second solid-blue block. "It's never too early to apply," big Apply button, deadline placeholder. |
| 11 | **Footer** | Wrap-up | Logo, socials, copyright. |

## 5. Behavior

- **Scroll animations:** Reuse the existing `motion` scroll-triggered `FadeIn` (fade + rise,
  staggered) plus SVG sketch "draw-on" (animate `pathLength` when in view). Smooth anchor
  scrolling for nav links. Gentle hover transitions on cards/buttons. All motion honors
  `prefers-reduced-motion`.
- **Primary CTA:** Every Apply button links to an `APPLY_URL` constant — a clearly-marked
  placeholder (e.g. `https://forms.gle/REPLACE_ME`) opened in a new tab. Easy to swap for the
  real application form later.

## 6. Content

- **Placeholders (clearly marked, easy to find-and-replace):** startup names (`Startup One`…),
  testimonial quotes & authors (`[Name]`, `[Cohort N]`), and stats (`[X]+`, `[Y]+`, `[Z]`),
  deadlines, and cohort numbers.
- **Real persuasive copy (written now):** program overview, benefits, who-should-apply,
  how-it-works, and FAQ — these are the conversion-driving sections and need genuine, clear copy.

## 7. Technical approach

- **`src/routes/index.tsx`** — rewritten to compose the new sections.
- **`src/styles.css`** — light brand palette, `--brand` blue tokens + solid-block blue,
  serif font variable, `scroll-behavior: smooth`, sketch ink color. Remove forced dark usage.
- **New files:**
  - `src/components/sketch.tsx` — reusable hand-drawn inline-SVG components (squiggle underline,
    doodle arrow, step icons, quote frame, dividers), animatable via `motion` `pathLength`.
  - `src/components/ui/accordion.tsx` — lightweight accessible accordion for the FAQ.
  - `src/routes/-sections/*.tsx` — one file per major section (TanStack Router ignores `-`
    prefixed files as routes), keeping each unit small and focused.
- **Dependency added:** `@fontsource-variable/fraunces`.
- **Reused primitives:** existing `Button`, `Card`, `Badge`, `Avatar` (restyled via the new
  light + blue theme).

## 8. Out of scope (YAGNI)

- No backend / database / form submission handling (CTA links out to an external form).
- No dark-mode toggle.
- No new routes/pages beyond the single landing page.
- No real content sourcing — placeholders only, per the decision above.

## 9. Decisions log

| Decision | Choice |
|----------|--------|
| Sign-up flow | External form link via `APPLY_URL` placeholder, new tab |
| Visual direction | YC-faithful structure + blue |
| Sequoia influence | Hand-drawn sketch storytelling, **balanced** accent level |
| Content | All fresh placeholder copy (marked) + real structural copy |
| Serif accent | Add Fraunces via `@fontsource` for storytelling headlines/quotes |
| Color mode | Light only |
