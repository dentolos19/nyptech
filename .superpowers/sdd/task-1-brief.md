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

