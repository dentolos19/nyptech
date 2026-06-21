# Startups Vertical Showcase — Scroll-driven Redesign

**Date:** 2026-06-21
**Status:** Approved design, pending spec review
**Scope:** Redesign the existing startups showcase in `src/routes/index.tsx` and relocate it below the hero.

## 1. Goal

Replace the current one-startup-at-a-time pinned showcase with a **vertical startup list** that
reads like the reference: all startup names stacked on the left, the **active** one large/bold/dark
while the rest dim, and a framed image + short caption on the right that swaps to match. As the user
scrolls, GSAP drives a smooth, scrubbed transition from one startup to the next.

This makes the incubator's student startups feel like a confident, storytelling-driven showcase.

## 2. Placement

New section order:

```
Hero
TrustBand
StartupsShowcase  ← moved here (was between HowItWorks and SuccessStories)
ProgramOverview
Benefits
WhoShouldApply
HowItWorks
SuccessStories
Faq
FinalCta
```

The showcase sits directly below the trust band, so the hero + stats read as the "landing" unit and
the showcase immediately backs it up with real companies. The `id="startups"` anchor and its nav link
(`#startups`) are preserved.

## 3. Layout

### Desktop (`md+`, motion allowed) — pinned two-column panel

- **Section header** (above the pinned panel): existing `Eyebrow` ("Our startups") + serif/bold
  headline + intro line. Stays as today.
- **Pinned panel** — `min-h-screen`, vertically centered, `max-w-6xl`, two columns:
  - **Left — vertical list.** All 6 startup names stacked. Each name is a focusable `<button>`.
    - Active: large (~`text-5xl` Fraunces serif), bold, `text-foreground`, full opacity.
    - Inactive: smaller, light weight, `text-muted-foreground/40`.
    - A small line above the list shows the active index + category (e.g. `01 — Fintech`),
      reusing the existing mono index treatment.
  - **Right — image + caption.** A `SketchFrame`-wrapped image that crossfades between startups,
    with a short caption directly below it. Caption = the startup's `blurb`; the `metric` shows as a
    small blue accent line. An optional small label (e.g. category) may sit above the image.

### Mobile + `prefers-reduced-motion` — stacked fallback

Reuse the existing `StackedStartups` component (alternating image/text rows, each `Reveal`-faded on
scroll). No pinning, no scroll-jacking. This is the existing, working fallback — kept as-is.

### Marquee

The existing `StartupsMarquee` (infinite scrolling name pills) is retained below the showcase body.

## 4. Interaction & animation (Approach A — pinned scroll-sequence)

- Lazy-import `gsap` + `gsap/ScrollTrigger` in an effect (matches the current pattern in the file).
- `ScrollTrigger.create` pins the inner panel with `start: "top top"` and an `end` of
  `+= window.innerHeight * (STARTUPS.length - 1) * <factor>`, `scrub`, `pinSpacing: true`,
  `anticipatePin: 1`, `invalidateOnRefresh: true`.
- **Continuous (scrubbed) emphasis**, not a discrete snap. Scroll progress (0→1) maps to a
  fractional position across the list. For each startup `i`, compute its "distance" from the current
  fractional active position and drive:
  - opacity `0.35 → 1`
  - scale `~0.92 → 1`
  - color `muted → foreground`
  - weight `light → bold`

  so the name that's being scrolled toward **grows smoothly** rather than popping. Implementation:
  per-item GSAP tweens linked to the trigger timeline, or a single `onUpdate` that writes interpolated
  styles to each item via refs. Either is acceptable as long as the scaling reads as continuous.
- The **active integer index** (rounded from progress) is held in React state and drives the right-side
  image crossfade + caption. Image transition uses the existing `motion`/Framer crossfade
  (opacity + slight scale), keyed on the active index.
- **Click-to-jump:** clicking a name scrolls the window to the scroll position corresponding to that
  startup's index (computed from the trigger's start/end). Names are real buttons — keyboard focusable,
  `aria-current` on the active one.

### Reduced motion / cleanup

- When `prefers-reduced-motion` is set, the pinned path is never mounted (fallback used instead).
- The effect cleans up via `gsap.context().revert()` and a `cancelled` guard on unmount, exactly as
  the current implementation does.

## 5. Active-state styling tokens

| State | opacity | scale | color | weight |
|-------|---------|-------|-------|--------|
| Active | 1 | 1 | `text-foreground` | bold |
| Adjacent | ~0.6 | ~0.96 | `text-muted-foreground` | normal |
| Far | 0.35 | 0.92 | `text-muted-foreground/40` | light |

Adjacent values are produced naturally by the continuous interpolation; the table documents the
endpoints. Names use the Fraunces serif (`font-serif`) for the editorial feel, consistent with other
storytelling headlines on the page.

## 6. Content / data

- Reuse the existing `STARTUPS` array (6 entries: name, category, blurb, metric, image) **unchanged** —
  all still clearly-marked placeholders (`Startup One`…, `[X]+ users`, etc.).
- Caption under the image = `blurb`; `metric` shown as the blue accent line.
- No new images or copy sourced in this change.

## 7. Components affected

- **`src/routes/index.tsx`:**
  - `PinnedStartups` — rewritten: left becomes the full vertical list with scrubbed per-item emphasis;
    right keeps the crossfading framed image and gains the caption block. Click-to-jump added.
  - `StartupsShowcase` — header intro copy adjusted to match the new interaction; `StackedStartups`
    and `StartupsMarquee` retained.
  - `Home` — move `<StartupsShowcase />` to directly after `<TrustBand />`.
  - `StartupText` helper — may be simplified/retired for the pinned path (the right column no longer
    shows name/category/blurb as the primary text; that now lives in the left list + caption). It is
    still used by `StackedStartups`, so it stays.
- No new files, no new dependencies (`gsap` and `motion` already present).

## 8. Out of scope (YAGNI)

- No changes to other sections.
- No real startup content/images (placeholders only).
- No new horizontal/auto-play behavior — scroll-driven only.
- No second startup section — the old pinned design is replaced, not kept.

## 9. Decisions log

| Decision | Choice |
|----------|--------|
| Existing showcase | Redesign in place into the vertical-list style, move below the hero/trust band |
| Content | Reuse the existing 6 placeholder startups + images |
| Interaction model | Approach A — pinned scroll-sequence with continuous (scrubbed) per-item emphasis |
| Emphasis behavior | Active name grows/bolds/darkens smoothly; others dim |
| Right side | Crossfading framed image + short caption (blurb) + metric accent |
| Fallback | Existing `StackedStartups` for mobile + `prefers-reduced-motion` |
| Accessibility | Names are focusable buttons, click-to-jump, `aria-current` on active |
