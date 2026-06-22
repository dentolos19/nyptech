import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";

import {
  DoodleArrow,
  IconRocket,
  QuoteMark,
  Reveal,
  SketchCheck,
  SketchCircle,
  SketchFrame,
  SketchUnderline,
  Sparkle,
} from "#/components/sketch.tsx";
import { Accordion, AccordionItem } from "#/components/ui/accordion.tsx";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/")({ component: Home });

// ── Config ───────────────────────────────────────────────────────────────────

// TODO: Replace with the real application form URL (Google Form / Typeform / etc.)
const APPLY_URL = "https://forms.gle/REPLACE_WITH_REAL_FORM";

// ── Placeholder content (clearly marked — swap before launch) ─────────────────

const STATS = [
  { value: "[X]+", label: "startups launched" },
  { value: "[Y]+", label: "student founders" },
  { value: "[Z]", label: "cohorts so far" },
  { value: "$[XX]K+", label: "funding deployed" },
];

const PERSONAS = [
  {
    tag: "The tinkerer",
    body: "You're always making things — apps, side projects, prototypes. You want one to become more than a hobby.",
  },
  {
    tag: "The problem-spotter",
    body: "You keep noticing things that are broken and thinking “someone should fix this.” That someone is you.",
  },
  {
    tag: "The ready team",
    body: "You and a friend have an idea and just need the push, the funding, and the people to make it real.",
  },
  {
    tag: "The first-timer",
    body: "You've never built a company and have no clue where to start. Perfect — that's exactly what this is for.",
  },
];

const STORIES = [
  {
    quote:
      "[Placeholder testimonial — a founder describes how the incubator turned their rough idea into a company with real users.]",
    name: "[Founder Name]",
    role: "Founder, Startup One · Cohort [N]",
  },
  {
    quote:
      "[Placeholder testimonial — a founder talks about the mentorship and community, and what they shipped during the program.]",
    name: "[Founder Name]",
    role: "Co-founder, Startup Two · Cohort [N]",
  },
  {
    quote: "[Placeholder testimonial — a founder reflects on Demo Day and the network they walked away with.]",
    name: "[Founder Name]",
    role: "Founder, Startup Three · Cohort [N]",
  },
];

const STARTUPS = [
  {
    name: "Startup One",
    category: "Fintech",
    blurb: "[One or two sentences on what this startup builds and the problem it solves for its users.]",
    metric: "[X]+ users",
    image: "/assets/showcase/shaper.png",
  },
  {
    name: "Startup Two",
    category: "Marketplace",
    blurb: "[One or two sentences on what this startup builds and the problem it solves for its users.]",
    metric: "[X]+ sellers onboarded",
    image: "/assets/showcase/procolink.png",
  },
  {
    name: "Startup Three",
    category: "AI",
    blurb: "[One or two sentences on what this startup builds and the problem it solves for its users.]",
    metric: "$[X]K in revenue",
    image: "/assets/showcase/autozone.png",
  },
  {
    name: "Startup Four",
    category: "EdTech",
    blurb: "[One or two sentences on what this startup builds and the problem it solves for its users.]",
    metric: "[X] schools using it",
    image: "/assets/blog/solvewebsite.png",
  },
  {
    name: "Startup Five",
    category: "Climate",
    blurb: "[One or two sentences on what this startup builds and the problem it solves for its users.]",
    metric: "[X] pilots launched",
    image: "/assets/blog/workshop.jpeg",
  },
  {
    name: "$100K+",
    category: "Combined valuation",
    blurb:
      "A growing portfolio of student-built companies creating real value across software, AI, commerce, and community.",
    metric: "combined valuation",
    isMilestone: true,
  },
];

const STARTUP_LOGOS = [
  { name: "Bihance", src: "/assets/startups/bihance.png" },
  { name: "ProcoLink", src: "/assets/startups/procolink.png" },
  { name: "Virage", src: "/assets/startups/virage.png" },
  { name: "Pronto", src: "/assets/startups/pronto.png" },
];

const LOGO_COLLAGE_POSITIONS: Record<string, CSSProperties> = {
  Bihance: { left: "6%", top: "10%", transform: "rotate(-4deg)" },
  ProcoLink: { right: "10%", top: "17%", transform: "rotate(3deg)" },
  Virage: { left: "18%", bottom: "12%", transform: "rotate(3deg)" },
  Pronto: { right: "4%", bottom: "8%", transform: "rotate(-3deg)" },
};

const FAQS = [
  {
    q: "Who can apply?",
    a: "Any current NYP student, from any course or year. Apply solo or with a team of up to [4]. No prior startup experience needed — curiosity counts more than a CV.",
  },
  {
    q: "Do I need a fully formed idea?",
    a: "No. Some teams arrive with a working prototype; others with a rough hunch and a lot of energy. If you can point at a problem you genuinely care about, you're ready to apply.",
  },
  {
    q: "Does it cost anything? Do you take equity?",
    a: "It's free to join, and we don't take equity in your company. Any funding we provide is there to help you build — not to own a piece of you.",
  },
  {
    q: "How much time does it take?",
    a: "Plan for roughly [8–10] hours a week across the [6]-month program — workshops, mentor sessions, and building. It's designed to run alongside your studies, not replace them.",
  },
  {
    q: "When does the next cohort start?",
    a: "Cohort [X] begins [Month Year], and applications close [Month DD, Year]. We review on a rolling basis, so applying early genuinely helps.",
  },
  {
    q: "What do I actually walk away with?",
    a: "Funding to build, weekly mentorship, a workspace on campus, tools and credits, a Demo Day stage, and a founder network that lasts well beyond graduation.",
  },
  {
    q: "Can I apply with just an idea and no team?",
    a: "Absolutely. Plenty of founders start solo and meet co-founders inside the program. Come as you are.",
  },
];

const NAV_LINKS = [
  { label: "Program", href: "#program" },
  { label: "Startups", href: "#startups" },
  { label: "FAQ", href: "#faq" },
];

const SOCIALS = [
  { name: "Instagram", icon: "/assets/icons/instagram.svg", href: "#" },
  { name: "LinkedIn", icon: "/assets/icons/linkedin.svg", href: "#" },
  { name: "Discord", icon: "/assets/icons/discord.svg", href: "#" },
  { name: "Telegram", icon: "/assets/icons/telegram.svg", href: "#" },
];

// ── Shared primitives ─────────────────────────────────────────────────────────

type CtaVariant = "primary" | "secondary";

const CTA_BASE =
  "group inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2";

const CTA_VARIANTS: Record<CtaVariant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-strong hover:shadow-md focus-visible:outline-brand",
  secondary: "border border-border bg-white text-foreground hover:bg-muted focus-visible:outline-brand",
};

function CtaLink({
  href,
  children,
  variant = "primary",
  external = false,
  arrow = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  external?: boolean;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(CTA_BASE, CTA_VARIANTS[variant], className)}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </a>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-brand inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
      <Sparkle className="size-3.5" />
      {children}
    </span>
  );
}

function useGsapSectionAnimations(sectionRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const heading = section.querySelector<HTMLElement>("[data-gsap-heading]");
        const items = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-gsap-item]"));
        const floats = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-gsap-float]"));
        const tiltCards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-gsap-tilt]"));

        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 34, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 82%", once: true },
            },
          );
        }

        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 42, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 72%", once: true },
            },
          );
        }

        floats.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -28 : 24,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        tiltCards.forEach((card) => {
          const onMove = (event: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotateX: y * -4,
              rotateY: x * 5,
              y: -6,
              duration: 0.35,
              ease: "power2.out",
              transformPerspective: 900,
            });
          };
          const onLeave = () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.55)" });
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });
      }, section);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      ctx?.revert();
    };
  }, [reduced, sectionRef]);
}

function SectionShell({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapSectionAnimations(sectionRef);

  return (
    <section ref={sectionRef} id={id} className={cn("px-6 py-24 md:py-32 lg:px-10", className)}>
      <div className="mx-auto max-w-[1440px]">{children}</div>
    </section>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────

// A nav link that draws a loose hand-drawn ink circle around itself on hover or
// keyboard focus (and un-draws on leave/blur). Reuses the site's SketchCircle
// ellipse path, stretched to the link via preserveAspectRatio="none".
function NavLink({ href, label }: { href: string; label: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  return (
    <span className="relative inline-flex">
      <a
        href={href}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="text-muted-foreground hover:text-foreground focus-visible:text-foreground relative text-sm font-medium transition-colors focus-visible:outline-none"
      >
        {label}
      </a>
      <svg
        viewBox="0 0 220 90"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        className="text-brand pointer-events-none absolute -top-2 -right-3.5 -bottom-2 -left-3.5"
      >
        <motion.path
          d="M128 7c-40-6-92-2-112 18-18 18-6 41 30 51 39 11 110 9 150-9 30-14 26-40-8-54-20-8-46-11-70-11"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-border/70 bg-white/80 shadow-sm backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="" className="size-8 rounded-full" />
          <span className="text-foreground text-[15px] font-semibold tracking-tight">NYP Tech</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        <CtaLink href={APPLY_URL} external variant="primary" className="px-4 py-2 text-[13px]">
          Apply
        </CtaLink>
      </nav>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function HeroInfinityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    };

    const particles: Particle[] = [];
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let animation = 0;

    const buildParticles = () => {
      particles.length = 0;
      const count = Math.min(1800, Math.max(900, Math.floor(width / 1.28)));
      const scaleX = Math.min(width * 0.34, height * 1.05);
      const scaleY = Math.min(width * 0.17, height * 0.32);
      const cx = width / 2;
      const cy = height * 0.46;

      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const wobble = Math.sin(i * 1.73) * 0.018;
        const band = (Math.random() - 0.5) * 88;
        const x = cx + scaleX * Math.sin(t + wobble) + band * Math.cos(t * 2);
        const y = cy + scaleY * Math.sin(t * 2 + wobble) + band * Math.sin(t);

        particles.push({
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 60,
          tx: x,
          ty: y,
          vx: 0,
          vy: 0,
          r: 1.25 + Math.random() * 1.55,
          alpha: 0.08 + Math.random() * 0.22,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width / 2, height * 0.36, 40, width / 2, height * 0.36, width * 0.52);
      gradient.addColorStop(0, "rgba(37, 99, 235, 0.10)");
      gradient.addColorStop(0.48, "rgba(37, 99, 235, 0.035)");
      gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        let dx = 0;
        let dy = 0;

        if (pointer.active && !reduced) {
          const px = p.x - pointer.x;
          const py = p.y - pointer.y;
          const dist = Math.max(1, Math.hypot(px, py));
          const radius = 145;
          if (dist < radius) {
            const force = (1 - dist / radius) ** 2;
            dx += (px / dist) * force * 72;
            dy += (py / dist) * force * 72;
          }
        }

        const breathe = reduced ? 0 : Math.sin(frame * 0.018 + p.tx * 0.012) * 1.8;
        const targetX = p.tx + dx;
        const targetY = p.ty + dy + breathe;

        p.vx += (targetX - p.x) * 0.035;
        p.vy += (targetY - p.y) * 0.035;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
        ctx.fill();
      }

      if (!reduced) animation = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("pointerleave", clearPointer);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative overflow-hidden bg-white px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      {/* atmosphere — soft blue glow + faint dot grid on white */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 36% at 50% 18%, var(--brand-soft) 0%, transparent 72%), linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(246,249,255,0.72) 78%, white 100%)",
        }}
      />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-36 bg-gradient-to-b from-transparent via-white/75 to-white" />
      <div
        className="text-brand pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 50% 30%, black, transparent)",
        }}
      />
      <HeroInfinityParticles />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div {...rise(0)} className="mb-7 flex justify-center">
          <span className="border-brand/15 bg-brand-soft text-brand inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium">
            <span className="bg-brand size-1.5 rounded-full" />
            Applications open &middot; Cohort [X]
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="text-foreground text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          Build the company
          <br />
          you keep{" "}
          <span className="text-brand relative inline-block whitespace-nowrap">
            talking about.
            <SketchUnderline className="absolute -bottom-2 left-0 h-3 w-full" />
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.18)}
          className="text-muted-foreground mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
        >
          NYP's student incubator. We give you funding, mentors, and a room full of builders for [6] months — so the
          idea you've been sitting on finally ships.
        </motion.p>

        <motion.div {...rise(0.28)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CtaLink href={APPLY_URL} external variant="primary" arrow>
            Apply now
          </CtaLink>
          <CtaLink href="#startups" variant="secondary">
            See startups
          </CtaLink>
        </motion.div>

        <motion.p {...rise(0.4)} className="text-muted-foreground mt-5 text-[13px]">
          Free to join &middot; takes about [10] minutes &middot; no pitch deck needed
        </motion.p>
      </div>
    </section>
  );
}

// ── Trust band ─────────────────────────────────────────────────────────────────

function TrustBand() {
  return (
    <section className="border-border to-muted/25 border-b bg-gradient-to-b from-white via-white px-6 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">{s.value}</p>
            <p className="text-muted-foreground mt-1 text-sm">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── Program overview ─────────────────────────────────────────────────────────

function GrowthSketch() {
  const reduced = useReducedMotion();
  return (
    <div className="relative">
      <div className="border-border bg-brand-soft/60 relative overflow-hidden rounded-2xl border p-8">
        <SketchFrame className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]" />
        <svg viewBox="0 0 340 260" className="text-brand relative w-full" fill="none" aria-hidden="true">
          {/* axes */}
          <path d="M40 20v200h270" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
          {/* rising hand-drawn curve */}
          <motion.path
            d="M44 206c40 6 70-8 104-44 30-32 52-86 96-118"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <path
            d="M244 44l-2-22m2 22l20-6"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <IconRocket className="text-brand absolute top-12 right-16 size-8" />
        <Sparkle className="text-brand/50 absolute bottom-16 left-20 size-4" />
        <div className="text-muted-foreground absolute bottom-12 left-20 max-w-28 font-serif text-sm leading-none">
          you are here
        </div>
        <div className="text-brand absolute top-18 right-24 max-w-28 text-right font-serif text-sm leading-none font-medium">
          Demo Day
        </div>
      </div>
    </div>
  );
}

function ProgramOverview() {
  return (
    <SectionShell id="program">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <Reveal>
          <Eyebrow>The program</Eyebrow>
          <h2
            data-gsap-heading
            className="text-foreground mt-5 font-serif text-4xl leading-[1.1] font-medium tracking-tight md:text-5xl"
          >
            So, what is it,
            <br />
            <span className="relative inline-block">
              really?
              <SketchCircle className="absolute -inset-x-4 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)]" />
            </span>
          </h2>
          <div data-gsap-item className="text-muted-foreground mt-7 space-y-5 text-[15px] leading-relaxed">
            <p>
              The NYP Tech Incubator is for students who want to build real companies — not class projects. Every
              [semester] we take a small cohort of teams and spend [6] months turning rough ideas into products with
              actual users.
            </p>
            <p>
              You get funding to build, weekly mentorship from founders and operators, a workspace on campus, and a
              network that doesn't expire the day you graduate. It all ends with Demo Day: you, on stage, in front of
              investors and industry partners.
            </p>
            <p className="text-foreground font-medium">
              Most of all, it's a room full of people who are as serious about building as you are.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div data-gsap-item data-gsap-float data-gsap-tilt>
            <GrowthSketch />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ── Who should apply ─────────────────────────────────────────────────────────

function WhoShouldApply() {
  const dont = ["a finished product", "a technical co-founder", "prior experience", "a perfect idea"];
  const need = ["an idea you can't shake", "a problem you care about", "the will to build", "to be an NYP student"];

  return (
    <SectionShell id="who">
      <Reveal className="max-w-2xl">
        <Eyebrow>Who it's for</Eyebrow>
        <h2
          data-gsap-heading
          className="text-foreground mt-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
        >
          You don't have to be a <span className="font-serif italic">“startup person.”</span>
        </h2>
        <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
          You just need an idea you can't stop thinking about — and the will to build it. The rest, we'll figure out
          together.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PERSONAS.map((p, i) => (
          <Reveal key={p.tag} delay={(i % 4) * 0.07}>
            <div data-gsap-item data-gsap-tilt className="border-border h-full rounded-2xl border bg-white p-6">
              <span className="text-brand font-serif text-lg font-medium">{p.tag}</span>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="border-border bg-border mt-10 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
          <div data-gsap-item className="bg-white p-8">
            <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">You don't need</p>
            <ul className="mt-5 space-y-3.5">
              {dont.map((item) => (
                <li key={item} className="text-muted-foreground flex items-center gap-3 text-[15px]">
                  <span className="bg-muted grid size-5 shrink-0 place-items-center rounded-full">
                    <X className="text-muted-foreground size-3" />
                  </span>
                  <span className="decoration-muted-foreground/40 line-through">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-gsap-item className="bg-white p-8">
            <p className="text-brand text-sm font-semibold tracking-wide uppercase">You just need</p>
            <ul className="mt-5 space-y-3.5">
              {need.map((item) => (
                <li key={item} className="text-foreground flex items-center gap-3 text-[15px] font-medium">
                  <SketchCheck className="size-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

// ── Success stories ─────────────────────────────────────────────────────────

function SuccessStories() {
  return (
    <SectionShell id="stories">
      <Reveal className="max-w-2xl">
        <Eyebrow>Success stories</Eyebrow>
        <h2
          data-gsap-heading
          className="text-foreground mt-5 font-serif text-4xl leading-[1.1] font-medium tracking-tight md:text-5xl"
        >
          Built by students who started right where you are.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {STORIES.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <figure
              data-gsap-item
              data-gsap-tilt
              className="border-border relative flex h-full flex-col rounded-2xl border bg-white p-7"
            >
              <QuoteMark className="h-8 w-10" />
              <blockquote className="text-foreground mt-4 flex-1 text-[15px] leading-relaxed">{s.quote}</blockquote>
              <figcaption className="border-border mt-6 border-t pt-5">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-soft text-brand grid size-10 place-items-center rounded-full font-serif text-base font-medium">
                    {s.name.replace(/[^A-Za-z]/g, "").charAt(0) || "F"}
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-semibold">{s.name}</p>
                    <p className="text-muted-foreground text-xs">{s.role}</p>
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

// ── Startups showcase (GSAP-pinned scroll sequence + Framer transitions) ──────

const pad = (n: number) => String(n).padStart(2, "0");

function StartupText({ s }: { s: (typeof STARTUPS)[number] }) {
  return (
    <>
      <span className="border-brand/15 bg-brand-soft text-brand inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
        {s.category}
      </span>
      <h3 className="text-foreground mt-5 font-serif text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl">
        {s.name}
      </h3>
      <p className="text-muted-foreground mt-5 max-w-md text-lg leading-relaxed">{s.blurb}</p>
      <p className="text-brand mt-6 text-sm font-semibold">{s.metric}</p>
    </>
  );
}

function StartupImageFrame({ s, className }: { s: (typeof STARTUPS)[number]; className?: string }) {
  if (s.isMilestone) {
    return <StartupLogoGrid className={className} />;
  }

  return (
    <div className={cn("relative aspect-[16/11] w-full", className)}>
      <SketchFrame className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" />
      <img
        src={s.image}
        alt={`${s.name} preview`}
        className="border-border relative h-full w-full rounded-2xl border object-cover shadow-xl"
      />
    </div>
  );
}

function StartupLogoGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border/70 flex aspect-square w-full items-center justify-center rounded-[2rem] border bg-[#f7f7f2] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)]",
        className,
      )}
    >
      <div className="grid w-full max-w-lg grid-cols-2 items-center gap-x-12 gap-y-12 sm:grid-cols-4 sm:gap-x-10">
        {STARTUP_LOGOS.map((logo) => (
          <div key={logo.name} className="flex items-center justify-center">
            <img src={logo.src} alt={logo.name} className="max-h-12 max-w-28 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

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
      const FALLOFF = 1.8; // how many neighbours away the emphasis reaches

      // Continuously style each name by its distance from the fractional
      // active position: t = 1 at the active name, 0 far away.
      const applyEmphasis = (frac: number) => {
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = Math.min(Math.abs(i - frac), FALLOFF);
          const t = 1 - d / FALLOFF;
          gsap.set(el, {
            y: -4 * t,
            scale: 0.92 + 0.12 * t, // 0.92 -> 1.04, restrained and polished
            opacity: 0.18 + 0.82 * t, // 0.18 -> 1
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
          onUpdate: (self: { progress: number }) => {
            const frac = self.progress * maxIdx;
            applyEmphasis(frac);
            const idx = Math.round(frac);
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
        triggerRef.current = st;
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
      <div ref={pinRef} className="flex min-h-screen flex-col justify-center px-6 py-16 md:py-20 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 md:grid-cols-[0.82fr_1.18fr] lg:gap-10">
          {/* Left — vertical startup list */}
          <div>
            <ul className="flex flex-col gap-9 md:gap-11 lg:gap-12">
              {STARTUPS.map((s, i) => (
                <li key={s.name} className={cn(s.isMilestone && "pt-8 md:pt-12")}>
                  <button
                    type="button"
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onClick={() => jumpTo(i)}
                    aria-current={i === active ? "true" : undefined}
                    style={{ transformOrigin: "left center" }}
                    className={`focus-visible:outline-brand block cursor-pointer font-sans text-4xl leading-none tracking-[-0.045em] transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 md:text-5xl lg:text-[3.6rem] ${
                      i === active ? "text-foreground font-semibold" : "text-foreground/12 font-medium"
                    }`}
                  >
                    <motion.span
                      key={i === active ? `${s.name}-active` : `${s.name}-inactive`}
                      initial={i === active ? { color: "var(--foreground)" } : false}
                      animate={i === active ? { color: "var(--brand)" } : undefined}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="relative inline-block pb-3"
                    >
                      {s.isMilestone ? (
                        <span className="block">
                          <span className="block">{s.name}</span>
                          <span className="mt-2 block text-lg font-medium tracking-[-0.02em] md:text-xl">
                            combined valuation
                          </span>
                        </span>
                      ) : (
                        s.name
                      )}
                      {i === active && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className="text-brand absolute right-0 -bottom-1 left-0 h-3 origin-left"
                        >
                          <SketchUnderline className="h-full w-full" />
                        </motion.span>
                      )}
                    </motion.span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — crossfading image + caption */}
          <div className="min-w-0 pr-0 text-center">
            <div
              className={cn(
                "relative mx-auto w-full max-w-[760px] overflow-hidden",
                current.isMilestone
                  ? "flex min-h-[520px] items-center justify-center"
                  : "aspect-square rounded-[2.25rem] border border-white/80 bg-white p-2 shadow-[0_30px_90px_rgba(15,23,42,0.12)] ring-1 ring-black/5",
              )}
            >
              {!current.isMilestone && (
                <div className="to-brand/5 absolute inset-0 bg-gradient-to-br from-white/70 via-transparent" />
              )}
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden",
                  current.isMilestone ? "min-h-[520px]" : "rounded-[1.75rem] bg-muted",
                )}
              >
                {STARTUPS.map((s, i) =>
                  s.isMilestone ? (
                    <motion.div
                      key={s.name}
                      initial={false}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : 1.035,
                        filter: i === active ? "blur(0px)" : "blur(3px)",
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-4"
                    >
                      <div className="relative h-[440px] w-full max-w-2xl">
                        {STARTUP_LOGOS.map((logo) => (
                          <img
                            key={logo.name}
                            src={logo.src}
                            alt={logo.name}
                            className="absolute h-28 w-48 object-contain"
                            style={LOGO_COLLAGE_POSITIONS[logo.name]}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.img
                      key={s.name}
                      src={s.image}
                      alt={`${s.name} preview`}
                      initial={false}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : 1.035,
                        filter: i === active ? "blur(0px)" : "blur(3px)",
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ),
                )}
              </div>
            </div>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-xl"
            >
              <p className="text-muted-foreground mt-7 text-[15px] leading-relaxed md:text-base">{current.blurb}</p>
              <p className="text-foreground mt-3 text-sm font-medium">{current.metric}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedStartups() {
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-6 pt-2">
      {STARTUPS.map((s, i) => (
        <Reveal key={s.name}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className={cn(i % 2 === 1 && "md:order-2")}>
              <div className="text-brand flex items-center gap-3 text-sm font-semibold">
                <span className="font-mono">{pad(i + 1)}</span>
                <span className="bg-brand/30 h-px w-10" />
                <span className="text-muted-foreground font-mono">{pad(STARTUPS.length)}</span>
              </div>
              <div className="mt-5">
                <StartupText s={s} />
              </div>
            </div>
            <StartupImageFrame s={s} className={cn(i % 2 === 1 && "md:order-1")} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function StartupsShowcase() {
  const reduced = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);

  // Pinned scroll-jacking only on desktop + when motion is allowed; otherwise a
  // clean stacked layout that still reveals each startup on scroll.
  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEnhanced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  return (
    <section id="startups" className="bg-muted/30 py-24 md:py-28">
      {enhanced ? <PinnedStartups /> : <StackedStartups />}
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────────

function Faq() {
  return (
    <SectionShell id="faq">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2
            data-gsap-heading
            className="text-foreground mt-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Good questions.
          </h2>
          <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed">
            Still unsure about something? Reach out — we'd rather you ask than not apply.
          </p>
          <div data-gsap-float>
            <DoodleArrow className="text-brand/40 mt-8 hidden size-20 -scale-x-100 md:block" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div data-gsap-item>
            <Accordion>
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} question={f.q}>
                  {f.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapSectionAnimations(sectionRef);

  return (
    <section ref={sectionRef} id="apply" className="px-6 py-20">
      <div
        data-gsap-item
        data-gsap-tilt
        className="border-brand/15 bg-brand-soft/50 relative mx-auto max-w-6xl overflow-hidden rounded-3xl border px-6 py-20 text-center md:py-28"
      >
        <div
          className="text-brand pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <Sparkle className="text-brand/30 absolute top-12 left-[15%] size-6" />
        <Sparkle className="text-brand/25 absolute right-[18%] bottom-16 size-5" />

        <Reveal className="relative mx-auto max-w-2xl">
          <h2
            data-gsap-heading
            className="text-foreground font-serif text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl"
          >
            It's never too early
            <br />
            to{" "}
            <span className="text-brand relative inline-block whitespace-nowrap">
              apply.
              <SketchUnderline className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-lg leading-relaxed">
            The worst thing you can do with an idea is wait. Applications for Cohort [X] close [Month DD, Year].
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <CtaLink href={APPLY_URL} external variant="primary" arrow>
              Apply now
            </CtaLink>
            <CtaLink href="#faq" variant="secondary">
              Read the FAQ
            </CtaLink>
          </div>
          <p className="text-muted-foreground mt-5 text-[13px]">
            Free &middot; about [10] minutes &middot; no pitch deck needed
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-border border-t bg-white px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo.png" alt="" className="size-8 rounded-full" />
              <span className="text-foreground text-[15px] font-semibold tracking-tight">
                NYP Technopreneurship Club
              </span>
            </div>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              The student incubator at Nanyang Polytechnic. We help students turn ideas into companies.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
            <nav className="flex flex-col gap-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">Explore</p>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">Get started</p>
              <CtaLink href={APPLY_URL} external variant="primary" arrow className="w-fit px-4 py-2 text-[13px]">
                Apply now
              </CtaLink>
              <div className="mt-1 flex items-center gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="border-border hover:border-brand/40 hover:bg-brand-soft grid size-9 place-items-center rounded-full border transition-colors"
                  >
                    <img src={s.icon} alt="" className="size-4 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 NYP Technopreneurship Club. All rights reserved.</p>
          <p>Built by students, for students.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="text-foreground min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustBand />
        <StartupsShowcase />
        <ProgramOverview />
        <WhoShouldApply />
        <FinalCta />
        <SuccessStories />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
