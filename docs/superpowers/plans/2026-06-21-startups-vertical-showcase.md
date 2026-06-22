# Startups Vertical Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the one-startup-at-a-time pinned showcase with a vertical startup list whose active name grows/bolds/darkens as you scroll, with the right-side image + caption swapping to match — and move the section to just below the hero.

**Architecture:** Rewrite the `PinnedStartups` component inside `src/routes/index.tsx`. A GSAP `ScrollTrigger` pins the panel for a scroll distance proportional to the startup count; scroll progress is mapped continuously onto the left list (each name's scale / opacity / weight is interpolated by distance from the active position) and rounded to an integer index that drives the right-side `motion` image crossfade and caption. The existing `StackedStartups` mobile / reduced-motion fallback and `StartupsMarquee` are retained.

**Tech Stack:** React 19, TanStack Start (SSR) + Cloudflare, Vite, Tailwind v4, `gsap` (+ `ScrollTrigger`), `motion` (Framer). Runtime: Bun.

## Global Constraints

- **No new dependencies.** `gsap` (^3.15.0) and `motion` (^12.40.0) are already installed.
- **SSR-safe.** GSAP is client-only: import it dynamically inside `useEffect` (the existing pattern). Never import `gsap`/`ScrollTrigger` at module top level.
- **Honor `prefers-reduced-motion`.** The pinned path must only mount on `md+` with motion allowed; otherwise `StackedStartups` renders. This gating already exists in `StartupsShowcase` via the `enhanced` flag — do not change it.
- **Light mode only.** Use existing tokens: `text-foreground`, `text-muted-foreground`, `text-brand`, `bg-brand`, `border-border`, `bg-muted/30`, etc. Royal-blue brand (`--brand`).
- **Reuse existing primitives** from the file/`sketch.tsx`: `SketchFrame`, `Eyebrow`, `SketchUnderline`, `Reveal`, `cn`, `pad`, `STARTUPS`. Do not duplicate them.
- **Placeholders stay marked.** Reuse the existing 6 `STARTUPS` entries unchanged (`Startup One`…, `[X]+ users`, etc.). Do not invent real content.
- **Strict TS.** `noUnusedLocals`/`noUnusedParameters` are on — no unused imports or vars.
- **Runtime is Bun.** Use `bun run …` / `bunx …`.

## Verification model (read first)

This repo has **no unit-test runner** (package.json has only `dev`, `build`, `lint`, `types`). The feature is a scroll-driven visual animation; adding a test harness for it is out of scope (YAGNI). So each task's verification cycle is:

1. `bun run lint` — oxlint (auto-fixes; must end clean).
2. `bunx tsc -p tsconfig.json` — type-check, **0 errors**. (If it errors on a missing `routeTree.gen.ts`, run `bun run types` once first to generate it, then re-run.)
3. `bun run build` — Vite build **succeeds**.
4. **Manual browser check** — `bun run dev`, open `http://localhost:3000`, and confirm the explicit observations listed in the task.

Each task ends by committing.

## File structure

- **Modify only:** `src/routes/index.tsx`
  - `Home` — reorder so `<StartupsShowcase />` renders directly after `<TrustBand />`.
  - `PinnedStartups` — fully rewritten (vertical list + image crossfade + caption + continuous emphasis + click-to-jump).
  - `StartupsShowcase` — intro copy tweak only.
  - `StackedStartups`, `StartupsMarquee`, `StartupText`, `StartupImageFrame`, `pad` — **unchanged** (still used by the fallback).
- No new files, no new deps.

---

### Task 1: Move the showcase below the hero

**Files:**

- Modify: `src/routes/index.tsx` (the `Home` component, ~lines 1055-1074)

**Interfaces:**

- Consumes: existing `<StartupsShowcase />`, `<TrustBand />`.
- Produces: nothing new — pure reorder.

- [ ] **Step 1: Reorder the sections in `Home`**

Edit the `Home` component's `<main>` so the showcase sits right after the trust band. Replace the existing `<main>` block:

```tsx
<main>
  <Hero />
  <TrustBand />
  <ProgramOverview />
  <Benefits />
  <WhoShouldApply />
  <HowItWorks />
  <StartupsShowcase />
  <SuccessStories />
  <Faq />
  <FinalCta />
</main>
```

with:

```tsx
<main>
  <Hero />
  <TrustBand />
  <StartupsShowcase />
  <ProgramOverview />
  <Benefits />
  <WhoShouldApply />
  <HowItWorks />
  <SuccessStories />
  <Faq />
  <FinalCta />
</main>
```

(`StartupsShowcase` keeps its `id="startups"`, so the `#startups` nav link still works.)

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: completes with no errors.

- [ ] **Step 3: Type-check**

Run: `bunx tsc -p tsconfig.json`
Expected: no output / exit 0. (If it complains about `routeTree.gen.ts`, run `bun run types` first.)

- [ ] **Step 4: Build**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 5: Manual check**

Run: `bun run dev`, open `http://localhost:3000`.
Expected: scrolling down from the hero, the **"Our startups"** section now appears immediately after the stats band (before "So, what is it, really?"). The old one-at-a-time pinned behavior still works for now. Clicking the **Startups** nav link still scrolls to it.

- [ ] **Step 6: Commit**

```bash
git add src/routes/index.tsx
git commit -m "Move startups showcase below the hero"
```

---

### Task 2: Rebuild the showcase as a vertical list (discrete active state)

Replace the body of `PinnedStartups` with the new two-column layout: a vertical list of all startup names on the left (active one large/bold, others dimmed) and a crossfading image + caption on the right, driven by a discrete active index. Continuous (scrubbed) scaling and interactivity come in Task 3.

**Files:**

- Modify: `src/routes/index.tsx` — the `PinnedStartups` function (~lines 712-813) and the `enhanced` intro copy in `StartupsShowcase` (~lines 891-896).

**Interfaces:**

- Consumes: `STARTUPS`, `SketchFrame`, `pad`, `cn`, `motion`, `useRef`, `useState`, `useEffect` (all already imported).
- Produces: a rewritten `PinnedStartups` that renders the vertical list and tracks `active` (an integer index 0…`STARTUPS.length-1`). Task 3 extends this same component.

- [ ] **Step 1: Replace the `PinnedStartups` function**

Replace the entire existing `PinnedStartups` function with:

```tsx
function PinnedStartups() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const maxIdx = STARTUPS.length - 1;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * maxIdx * 0.9,
          pin: pin,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self: { progress: number }) => {
            const idx = Math.round(self.progress * maxIdx);
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
      }, section);
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const current = STARTUPS[active];

  return (
    <div ref={sectionRef} className="relative">
      <div ref={pinRef} className="flex min-h-screen flex-col justify-center px-6 py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.1fr]">
          {/* Left — vertical startup list */}
          <div>
            <div className="text-brand mb-7 flex items-center gap-3 text-sm font-semibold">
              <span className="font-mono">{pad(active + 1)}</span>
              <span className="bg-brand/30 h-px w-10" />
              <span className="text-muted-foreground font-mono">{pad(STARTUPS.length)}</span>
              <span className="text-muted-foreground font-sans font-medium tracking-wide uppercase">
                · {current.category}
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {STARTUPS.map((s, i) => (
                <li key={s.name}>
                  <span
                    className={cn(
                      "block origin-left font-serif tracking-tight transition-all duration-500",
                      i === active
                        ? "text-foreground text-4xl font-bold opacity-100 md:text-5xl"
                        : "text-foreground text-2xl font-medium opacity-30 md:text-3xl",
                    )}
                  >
                    {s.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — crossfading image + caption */}
          <div>
            <div className="relative aspect-[16/11] w-full">
              <SketchFrame className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" />
              {STARTUPS.map((s, i) => (
                <motion.img
                  key={s.name}
                  src={s.image}
                  alt={`${s.name} preview`}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.03 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-border absolute inset-0 h-full w-full rounded-2xl border object-cover shadow-xl"
                />
              ))}
            </div>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-muted-foreground mt-8 max-w-md text-base leading-relaxed">{current.blurb}</p>
              <p className="text-brand mt-3 text-sm font-semibold">{current.metric}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update the `enhanced` intro copy in `StartupsShowcase`**

In `StartupsShowcase`, replace the enhanced branch of the intro paragraph:

```tsx
{
  enhanced
    ? "Keep scrolling — each startup expands into view, one after another."
    : "A few of the startups that came out of the program — every one started as a student with an idea.";
}
```

with:

```tsx
{
  enhanced
    ? "Scroll through them — each name grows as its story takes the stage on the right."
    : "A few of the startups that came out of the program — every one started as a student with an idea.";
}
```

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: completes with no errors. (Confirm `cn`, `pad`, `motion`, `SketchFrame`, `STARTUPS` are all still used — they are.)

- [ ] **Step 4: Type-check**

Run: `bunx tsc -p tsconfig.json`
Expected: 0 errors.

- [ ] **Step 5: Build**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 6: Manual check (desktop)**

Run: `bun run dev`, open `http://localhost:3000` in a desktop-width window (≥768px).
Expected:

- The showcase shows **all 6 startup names stacked vertically** on the left; the right shows one framed image with a caption (blurb) + blue metric line below.
- The first name ("Startup One") is large/bold/dark; the rest are smaller and dimmed.
- Scrolling down **pins** the panel; as you scroll, the **active name jumps** down the list (Startup One → Two → …), and the right image + caption + index (`01 → 02 …`) and category update to match.
- After the last startup, the section unpins and the page continues to "So, what is it, really?".

- [ ] **Step 7: Manual check (mobile / reduced-motion fallback)**

Resize to <768px (or enable "reduce motion" in OS and reload).
Expected: the pinned behavior is gone; the stacked `StackedStartups` layout renders (alternating image/text rows) and the marquee still scrolls. No scroll-jacking.

- [ ] **Step 8: Commit**

```bash
git add src/routes/index.tsx
git commit -m "Rebuild startups showcase as a vertical list with image crossfade"
```

---

### Task 3: Continuous scrubbed scaling + click-to-jump + a11y

Make the active name grow **smoothly** as the user scrolls toward it (continuous interpolation, not a snap), make each name a focusable button that jumps to its startup on click, and mark the active one with `aria-current`.

**Files:**

- Modify: `src/routes/index.tsx` — the `PinnedStartups` function only.

**Interfaces:**

- Consumes: same imports as Task 2.
- Produces: final `PinnedStartups`. No new exports.

**Implementation note — React/GSAP style ownership:** GSAP writes `scale`, `opacity`, and `fontWeight` directly to each button's inline style every scroll frame. React must **not** also declare those properties in the JSX `style` prop, or a re-render (when `active` changes) would wipe GSAP's values. So the JSX `style` carries only the static `transformOrigin`; GSAP owns the dynamic styling, and `applyEmphasis(0)` sets the initial state once GSAP loads.

- [ ] **Step 1: Replace the `PinnedStartups` function**

Replace the entire `PinnedStartups` function (from Task 2) with:

```tsx
function PinnedStartups() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef = useRef<{ start: number; end: number } | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const maxIdx = STARTUPS.length - 1;
      const FALLOFF = 1.6; // how many neighbours away the emphasis reaches

      // Continuously style each name by its distance from the fractional
      // active position: t = 1 at the active name, 0 far away.
      const applyEmphasis = (frac: number) => {
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = Math.min(Math.abs(i - frac), FALLOFF);
          const t = 1 - d / FALLOFF;
          gsap.set(el, {
            scale: 0.78 + 0.42 * t, // 0.78 → 1.20
            opacity: 0.3 + 0.7 * t, // 0.30 → 1
            fontWeight: Math.round(400 + 300 * t), // 400 → 700 (Fraunces is variable)
          });
        });
      };

      ctx = gsap.context(() => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * maxIdx * 0.9,
          pin: pin,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self: { progress: number; start: number; end: number }) => {
            const frac = self.progress * maxIdx;
            applyEmphasis(frac);
            triggerRef.current = { start: self.start, end: self.end };
            const idx = Math.round(frac);
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
        triggerRef.current = { start: st.start, end: st.end };
        applyEmphasis(0);
      }, section);
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const jumpTo = (i: number) => {
    const t = triggerRef.current;
    if (!t) {
      setActive(i);
      return;
    }
    const top = t.start + (t.end - t.start) * (i / (STARTUPS.length - 1));
    window.scrollTo({ top, behavior: "smooth" });
  };

  const current = STARTUPS[active];

  return (
    <div ref={sectionRef} className="relative">
      <div ref={pinRef} className="flex min-h-screen flex-col justify-center px-6 py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.1fr]">
          {/* Left — vertical startup list */}
          <div>
            <div className="text-brand mb-7 flex items-center gap-3 text-sm font-semibold">
              <span className="font-mono">{pad(active + 1)}</span>
              <span className="bg-brand/30 h-px w-10" />
              <span className="text-muted-foreground font-mono">{pad(STARTUPS.length)}</span>
              <span className="text-muted-foreground font-sans font-medium tracking-wide uppercase">
                · {current.category}
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {STARTUPS.map((s, i) => (
                <li key={s.name}>
                  <button
                    type="button"
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onClick={() => jumpTo(i)}
                    aria-current={i === active ? "true" : undefined}
                    style={{ transformOrigin: "left center" }}
                    className="text-foreground block cursor-pointer font-serif text-3xl tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:text-4xl"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — crossfading image + caption */}
          <div>
            <div className="relative aspect-[16/11] w-full">
              <SketchFrame className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" />
              {STARTUPS.map((s, i) => (
                <motion.img
                  key={s.name}
                  src={s.image}
                  alt={`${s.name} preview`}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.03 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-border absolute inset-0 h-full w-full rounded-2xl border object-cover shadow-xl"
                />
              ))}
            </div>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-muted-foreground mt-8 max-w-md text-base leading-relaxed">{current.blurb}</p>
              <p className="text-brand mt-3 text-sm font-semibold">{current.metric}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: no errors. (`cn` is no longer used inside `PinnedStartups` but remains used by `StackedStartups`, so the import stays valid.)

- [ ] **Step 3: Type-check**

Run: `bunx tsc -p tsconfig.json`
Expected: 0 errors. (The ref callback returns `void`; `triggerRef` is typed `{ start: number; end: number } | null`.)

- [ ] **Step 4: Build**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 5: Manual check — smooth scaling**

Run: `bun run dev`, open `http://localhost:3000` at desktop width, scroll slowly through the showcase.
Expected:

- As you scroll toward a name it **grows and bolds smoothly** (no snap), while the name you're leaving shrinks and dims. Neighbours are partially emphasised (a gradient of size/opacity), matching the reference.
- The right image + caption + index/category still track the nearest startup.
- No visible overlap between names. (If names overlap at some width, increase the list `gap-3` → `gap-4`/`gap-5` or lower the max scale `0.42` multiplier — note this in the commit.)

- [ ] **Step 6: Manual check — click + keyboard**

Expected:

- **Clicking** any name smoothly scrolls the page so that startup becomes active (image/caption follow).
- **Tab** moves focus through the names with a visible focus ring; **Enter/Space** on a focused name jumps to it.
- The active name carries `aria-current="true"` (verify in DevTools elements panel).

- [ ] **Step 7: Manual check — fallback unchanged**

Resize <768px or enable reduced motion + reload.
Expected: stacked fallback renders, no pinning, no errors in console.

- [ ] **Step 8: Commit**

```bash
git add src/routes/index.tsx
git commit -m "Add smooth scrubbed scaling, click-to-jump, and a11y to startups showcase"
```

---

## Self-Review

**1. Spec coverage:**

- Vertical list of all names on the left → Task 2 (layout) + Task 3 (it's the list).
- Active name larger/bolder/more prominent on scroll → Task 2 (discrete) → Task 3 (continuous/smooth). ✓
- Right image changes dynamically + caption → Task 2 (crossfade `motion.img` + blurb/metric caption). ✓
- GSAP smooth scroll-based animation → Task 2 (`ScrollTrigger` pin/scrub) + Task 3 (scrubbed emphasis). ✓
- Minimal/clean/premium, like the reference → Fraunces serif names, dimmed inactive, framed image. ✓
- Placed below the hero → Task 1. ✓
- Fallback for mobile/reduced-motion → retained `StackedStartups`, gated by existing `enhanced` flag. ✓
- Accessibility (focusable, click-to-jump, `aria-current`) → Task 3. ✓

**2. Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step shows complete code. ✓

**3. Type consistency:** `active` (number) consistent across tasks; `applyEmphasis(frac: number)`, `jumpTo(i: number)`, `triggerRef: { start; end } | null`, `itemRefs: (HTMLButtonElement | null)[]` all consistent. `onUpdate` self-type widened in Task 3 to include `start`/`end` (structural subset of `ScrollTrigger`, assignable). ✓

No gaps found.
