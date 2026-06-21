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
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
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
              <p className="text-muted-foreground mt-8 max-w-md text-base leading-relaxed">
                {current.blurb}
              </p>
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
            {enhanced
              ? "Keep scrolling — each startup expands into view, one after another."
              : "A few of the startups that came out of the program — every one started as a student with an idea."}
```

with:

```tsx
            {enhanced
              ? "Scroll through them — each name grows as its story takes the stage on the right."
              : "A few of the startups that came out of the program — every one started as a student with an idea."}
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

