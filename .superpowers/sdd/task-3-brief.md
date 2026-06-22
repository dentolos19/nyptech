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
