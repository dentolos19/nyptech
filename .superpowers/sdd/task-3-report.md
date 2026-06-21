# Task 3 Report: Continuous scrubbed scaling + click-to-jump + a11y

## What was changed

**File modified:** `src/routes/index.tsx` — `PinnedStartups` function only.

Replaced the Task 2 `PinnedStartups` implementation (discrete snap-to-active via CSS classes) with the Task 3 version featuring:

1. **Continuous GSAP-driven emphasis** — `itemRefs` (`useRef<(HTMLButtonElement | null)[]>`) stores refs to each name button. Inside `onUpdate`, `applyEmphasis(frac)` calls `gsap.set` on every button to interpolate `scale` (0.78→1.20), `opacity` (0.30→1.0), and `fontWeight` (400→700) based on distance from the fractional scroll position. FALLOFF = 1.6 means two neighbours are partially emphasised.

2. **Click-to-jump** — `triggerRef` (`useRef<{ start: number; end: number } | null>`) captures the ScrollTrigger's pixel start/end from both `st.start`/`st.end` (initial) and `self.start`/`self.end` (each `onUpdate`). `jumpTo(i)` calculates `top = start + (end - start) * (i / maxIdx)` and calls `window.scrollTo({ top, behavior: "smooth" })`.

3. **Accessibility** — Each name is now a `<button type="button">` with `aria-current={i === active ? "true" : undefined}` and `focus-visible:outline-brand` focus ring.

4. **React/GSAP style ownership respected** — The JSX `style` prop carries only `{ transformOrigin: "left center" }`. GSAP owns `scale`, `opacity`, and `fontWeight` entirely, so React re-renders on `active` change cannot wipe GSAP's values.

5. **Initial state** — `applyEmphasis(0)` is called once after GSAP loads, so the first item starts emphasised before any scroll.

## Exact commands and results

```
bun run lint
→ $ oxlint --fix
→ (no errors, clean exit)

bunx tsc -p tsconfig.json
→ (no output = 0 errors)
```

## Files changed

- `src/routes/index.tsx` — 48 insertions, 11 deletions (net +37 lines in `PinnedStartups`)

## Commit

`142472f` — "Add smooth scrubbed scaling, click-to-jump, and a11y to startups showcase"

## Self-review

- Spec coverage: All three features (continuous scaling, click-to-jump, aria-current) implemented.
- Style ownership: JSX `style` has only `transformOrigin`; GSAP owns dynamic props. No risk of React wipe.
- Ref callback `ref={(el) => { itemRefs.current[i] = el; }}` returns `void` implicitly — type-safe.
- `triggerRef` typed as `{ start: number; end: number } | null` — matches brief.
- `onUpdate` `self` typed as `{ progress: number; start: number; end: number }` — structural subset of ScrollTrigger, assignable, no tsc errors.
- No other files touched.
- No tests added (repo has no test runner).

## Concerns

None. Lint and tsc both pass clean. The code is a verbatim transcription of the brief's replacement block with no deviations.

---

## Fix wave (final review)

### Fix 1 — Stop animating `font-weight` every scroll frame

**Problem:** `gsap.set(el, { ..., fontWeight: Math.round(400 + 300 * t) })` was called on every scroll frame. Because Fraunces is a variable font, each `fontWeight` mutation forces a per-frame text reflow and causes jitter.

**Changes made in `src/routes/index.tsx`:**

1. Removed `fontWeight` from the `gsap.set` call in `applyEmphasis` — GSAP now only animates compositor-only properties (`scale`, `opacity`).
2. Changed the name `<button>` `className` from a plain string to a template literal that appends `font-bold` when `i === active` and `font-normal` otherwise. The weight now flips once per integer crossing (class-based, no conflict with GSAP inline styles), and smooth growth is carried entirely by `scale`.

### Fix 2 — `jumpTo` must read LIVE trigger positions, not a stale snapshot

**Problem:** `triggerRef` stored a `{ start, end }` snapshot captured at ScrollTrigger creation and again in each `onUpdate`. After a viewport resize, ScrollTrigger recomputes `start`/`end` internally, but the snapshot in `triggerRef` was only updated on the next scroll event — so clicks between a resize and the next scroll used stale values.

**Changes made in `src/routes/index.tsx`:**

1. **`onUpdate` callback** — removed the `triggerRef.current = { start: self.start, end: self.end }` snapshot line and narrowed the `self` type back to `{ progress: number }`.
2. **Post-create assignment** — changed `triggerRef.current = { start: st.start, end: st.end }` to `triggerRef.current = st`, storing the live ScrollTrigger instance. The instance mutates its `.start`/`.end` on each `ScrollTrigger.refresh()`, so `jumpTo` always reads current values.
3. **`triggerRef` type** — left as `useRef<{ start: number; end: number } | null>(null)`. The ScrollTrigger instance structurally satisfies `{ start: number; end: number }`, so the assignment type-checks with no changes to the declared type.
4. **`jumpTo`** — unchanged; it already reads `t.start`/`t.end`.

### Verification commands and output

```
bun run lint
→ $ oxlint --fix
→ (no errors, clean exit)

bunx tsc -p tsconfig.json
→ (no output = 0 errors)
```

### Commit

`32fc325` — "Fix per-frame font-weight reflow and stale jumpTo target in startups showcase"
