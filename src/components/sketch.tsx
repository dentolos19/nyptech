import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "#/lib/utils.ts";

// ── Scroll reveal ────────────────────────────────────────────────────────────
// Fade + rise as the element scrolls into view. Honors reduced-motion.

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Draw-on primitive ────────────────────────────────────────────────────────
// A path that "draws itself" when scrolled into view.

function DrawPath({
  d,
  delay = 0,
  duration = 0.9,
  strokeWidth = 3,
  className,
}: {
  d: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// ── Decorative hand-drawn accents ────────────────────────────────────────────

/** Wavy marker underline that draws on when seen. Place absolutely under a word. */
export function SketchUnderline({
  className,
  delay = 0.15,
  strokeWidth = 4,
}: {
  className?: string;
  delay?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={cn("text-brand", className)}
    >
      <DrawPath d="M3 9C36 3 64 11 98 6c30-4 64 6 99 1" delay={delay} duration={0.8} strokeWidth={strokeWidth} />
    </svg>
  );
}

/** Loose hand-drawn ellipse to circle a word. */
export function SketchCircle({ className, delay = 0.2 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 220 90" fill="none" aria-hidden="true" className={cn("text-brand", className)}>
      <DrawPath
        d="M128 7c-40-6-92-2-112 18-18 18-6 41 30 51 39 11 110 9 150-9 30-14 26-40-8-54-20-8-46-11-70-11"
        delay={delay}
        duration={1}
        strokeWidth={3}
      />
    </svg>
  );
}

/** Curved hand-drawn arrow, points down-and-right by default. */
export function DoodleArrow({ className, delay = 0.3 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 90 90" fill="none" aria-hidden="true" className={cn("text-brand", className)}>
      <DrawPath d="M14 12c20 8 35 26 38 52" delay={delay} duration={0.7} strokeWidth={3} />
      <DrawPath d="M36 52c5 6 11 11 16 13" delay={delay + 0.5} duration={0.3} strokeWidth={3} />
      <DrawPath d="M66 50c-7 7-11 11-14 15" delay={delay + 0.5} duration={0.3} strokeWidth={3} />
    </svg>
  );
}

/** Four-point hand-drawn sparkle. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("text-brand", className)}>
      <path d="M12 2c1 6 3 8 9 10-6 2-8 4-9 10-1-6-3-8-9-10 6-2 8-4 9-10Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/** Big hand-drawn opening quote. */
export function QuoteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 40" fill="none" aria-hidden="true" className={cn("text-brand", className)}>
      <path
        d="M4 38c-3-12 0-26 16-34l3 6C13 16 11 22 12 26c5 0 9 3 9 9 0 4-4 8-9 8-4 0-7-2-8-5Zm29 0c-3-12 0-26 16-34l3 6c-10 6-12 12-11 16 5 0 9 3 9 9 0 4-4 8-9 8-4 0-7-2-8-5Z"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}

/** Rough rectangular frame (two slightly offset strokes for a sketched look). */
export function SketchFrame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={cn("text-brand/30", className)}
    >
      <path
        d="M4 6c24-2 60-3 92 0 2 26 2 60 0 88-30 2-66 2-92 0-2-28-2-60 0-88Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Hand-drawn dashed connector for the "how it works" steps. */
export function DashedConnector({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <svg
      viewBox={vertical ? "0 0 24 80" : "0 0 120 24"}
      fill="none"
      aria-hidden="true"
      className={cn("text-brand/40", className)}
    >
      {vertical ? (
        <path
          d="M12 4c-3 12 3 22 0 34s2 28-2 38"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
      ) : (
        <path
          d="M4 12c30-4 56 4 84 0s28-2 28-2"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
      )}
    </svg>
  );
}

/** Hand-drawn check tick. */
export function SketchCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("text-brand", className)}>
      <path
        d="M4 13c3 2 5 4 7 7C13 12 17 6 22 3"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Hand-drawn line icons (steps + benefits) ─────────────────────────────────
// Shared sketch styling: rounded, slightly loose strokes in currentColor.

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type IconProps = { className?: string };
const box = (className?: string) => cn("text-brand", className);

/** Paper plane — "Apply". */
export function IconApply({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M42 7 6 22l13 5 5 13 18-33Z" />
      <path {...stroke} d="M42 7 19 27" />
    </svg>
  );
}

/** Two speech bubbles — "Interview". */
export function IconInterview({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M7 11h22a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H16l-7 6V14a3 3 0 0 1 3-3Z" />
      <path {...stroke} d="M36 19h3a3 3 0 0 1 3 3v13l-5-4h-9a3 3 0 0 1-3-3" />
    </svg>
  );
}

/** Wrench + bolt — "Build". */
export function IconBuild({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M30 8a8 8 0 0 0-9 11L9 31a4 4 0 0 0 6 6l12-12a8 8 0 0 0 11-9l-6 6-5-1-1-5 4-8Z" />
    </svg>
  );
}

/** Screen on a stand with rising bar — "Demo Day". */
export function IconDemo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M8 9h32a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z" />
      <path {...stroke} d="M18 41h12M24 33v8" />
      <path {...stroke} d="M14 26l6-7 5 4 8-10" />
    </svg>
  );
}

/** Linked people — "Alumni network". */
export function IconNetwork({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <circle {...stroke} cx="24" cy="11" r="5" />
      <circle {...stroke} cx="11" cy="34" r="5" />
      <circle {...stroke} cx="37" cy="34" r="5" />
      <path {...stroke} d="M21 15 14 29m13-14 7 14M16 34h16" />
    </svg>
  );
}

/** Coins — "Funding". */
export function IconFunding({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <ellipse {...stroke} cx="22" cy="14" rx="13" ry="6" />
      <path {...stroke} d="M9 14v8c0 3.3 5.8 6 13 6s13-2.7 13-6v-8" />
      <path {...stroke} d="M9 22v8c0 3.3 5.8 6 13 6 2.6 0 5-.4 7-1" />
      <circle {...stroke} cx="34" cy="33" r="8" />
      <path {...stroke} d="M34 29v8m-3-6h4.5a1.5 1.5 0 0 1 0 3H32m0 0h4a1.5 1.5 0 0 1 0 3h-5" />
    </svg>
  );
}

/** Compass — "Mentorship". */
export function IconMentor({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <circle {...stroke} cx="24" cy="24" r="18" />
      <path {...stroke} d="m31 17-4 11-11 4 4-11 11-4Z" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Door / workspace — "Space & resources". */
export function IconSpace({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M10 42V9a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v33" />
      <path {...stroke} d="M6 42h36M32 14h6a2 2 0 0 1 2 2v26" />
      <path {...stroke} d="M25 25a1 1 0 1 0 .1 0" />
    </svg>
  );
}

/** Heart — "Community". */
export function IconCommunity({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M24 40C8 30 7 18 14 13c5-3.6 10 0 10 4 0-4 5-7.6 10-4 7 5 6 17-10 27Z" />
    </svg>
  );
}

/** Rocket — generic "growth / launch". */
export function IconRocket({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={box(className)} aria-hidden="true">
      <path {...stroke} d="M24 4c8 4 12 12 12 22l-6 6H18l-6-6C12 16 16 8 24 4Z" />
      <circle {...stroke} cx="24" cy="19" r="4" />
      <path {...stroke} d="M18 32l-5 9 9-4m9-5 5 9-9-4" />
    </svg>
  );
}
