# Design System

## Framework

- React with TanStack Start and TanStack Router file routes in [`src/routes/`](src/routes/).
- shadcn/ui components in the `base-vega` style on Base UI, configured in [`components.json`](components.json), live in [`src/components/ui/`](src/components/ui/).
- Icons come from Lucide, with hand-drawn sketch decorations and icons in [`sketch.tsx`](src/components/sketch.tsx).
- Motion handles entrance animations, and GSAP with ScrollTrigger handles scroll-driven section animations.
- [`AppProvider`](src/components/app-provider.tsx) wraps the app with the theme provider, tooltips, and the Sonner toaster.

## Styling

- Tailwind CSS 4 with tokens as CSS variables in [`src/styles.css`](src/styles.css), plus `tw-animate-css`, the shadcn Tailwind preset, and the typography plugin.
- Merge classes with `cn` from [`src/lib/utils.ts`](src/lib/utils.ts).

## Tokens

- **Brand**: An orange palette with `brand` (`#fd5f00`), `brand-strong` (`#cf4e00`), `brand-soft` (`#fff0e7`), `brand-foreground` (white), and `ink`.
- **Semantic colors**: The shadcn set (`background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover`, and `sidebar`) on a warm palette with dark brown foreground text (`#32180b`). `primary` and `ring` match the brand orange.
- **Charts**: `chart-1` to `chart-5`, from brand orange to pale peach.
- **Radius**: `--radius` is `0.625rem`, with `sm` to `4xl` scaled from it.
- **Fonts**: Geist Variable for sans and headings, and Fraunces Variable for serif display text, tuned with soft optical settings.

## Theming

- A `.dark` palette is defined, but the theme provider forces the light theme.

## Layout

- The landing page stacks full-width sections, most wrapped in `SectionShell` with consistent padding, and a fixed navigation bar. Smooth scrolling offsets anchors below the navigation.
- Calls to action use `CtaLink` with `primary` (brand fill) and `secondary` (bordered white) variants.
- Sections start with an `Eyebrow` label above the heading.

## Motion

- Respect reduced motion. The stylesheet shortens all animations and transitions under `prefers-reduced-motion`, and components check `useReducedMotion` before animating.
- The FAQ accordion animates its height with Base UI's exposed panel height.
