import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import { Accordion, AccordionItem } from "#/components/ui/accordion.tsx";
import {
  DashedConnector,
  DoodleArrow,
  IconApply,
  IconBuild,
  IconCommunity,
  IconDemo,
  IconFunding,
  IconInterview,
  IconMentor,
  IconNetwork,
  IconRocket,
  IconSpace,
  QuoteMark,
  Reveal,
  SketchCheck,
  SketchCircle,
  SketchFrame,
  SketchUnderline,
  Sparkle,
} from "#/components/sketch.tsx";
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

const BENEFITS: { icon: ComponentType<{ className?: string }>; title: string; body: string }[] = [
  {
    icon: IconFunding,
    title: "Funding to start",
    body: "Up to $[XX]K to build your first real version — no equity, no strings. Money to make, not to owe.",
  },
  {
    icon: IconMentor,
    title: "Mentors who've shipped",
    body: "Weekly 1:1s with founders, operators, and investors who've built and sold real products.",
  },
  {
    icon: IconSpace,
    title: "A room to build in",
    body: "A dedicated workspace on campus, plus the tools, software credits, and resources to move fast.",
  },
  {
    icon: IconNetwork,
    title: "A network for life",
    body: "Graduate into an alumni community of builders who open doors, give advice, and back each other.",
  },
  {
    icon: IconDemo,
    title: "Your Demo Day",
    body: "End the program on stage, pitching your company to investors and industry partners.",
  },
  {
    icon: IconCommunity,
    title: "People who get it",
    body: "Build beside the most driven students at NYP. Around here, ambition is contagious.",
  },
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

const STEPS: { icon: ComponentType<{ className?: string }>; n: string; title: string; body: string }[] = [
  { icon: IconApply, n: "01", title: "Apply", body: "A short application. About [10] minutes — no pitch deck required." },
  { icon: IconInterview, n: "02", title: "Interview", body: "We chat with promising applicants to get to know you and your idea." },
  { icon: IconBuild, n: "03", title: "Build", body: "[6] months of focused building, with funding, mentorship, and space." },
  { icon: IconDemo, n: "04", title: "Demo Day", body: "Pitch your company to a room of investors and industry partners." },
  { icon: IconNetwork, n: "05", title: "Alumni", body: "Graduate into a lifelong network of NYP founders and builders." },
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
    quote:
      "[Placeholder testimonial — a founder reflects on Demo Day and the network they walked away with.]",
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
    name: "Startup Six",
    category: "Consumer",
    blurb: "[One or two sentences on what this startup builds and the problem it solves for its users.]",
    metric: "[X]+ downloads",
    image: "/assets/blog/hackathon.jpeg",
  },
];

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
  { label: "Benefits", href: "#benefits" },
  { label: "How it works", href: "#how" },
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
      {arrow && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
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

function SectionShell({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("px-6 py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
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
        className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
      >
        {label}
      </a>
      <svg
        viewBox="0 0 220 90"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        className="text-brand pointer-events-none absolute -top-2 -bottom-2 -left-3.5 -right-3.5"
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
        scrolled
          ? "border-border/70 bg-white/80 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent",
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
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            NYP Tech
          </span>
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

function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white px-6 pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* atmosphere — soft blue glow + faint dot grid on white */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 45% at 50% -5%, var(--brand-soft) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 text-brand opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 50% 30%, black, transparent)",
        }}
      />
      <Sparkle className="absolute top-28 left-[12%] size-5 text-brand/30" />
      <Sparkle className="absolute top-44 right-[14%] size-7 text-brand/20" />
      <Sparkle className="absolute bottom-16 left-[20%] size-4 text-brand/20" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div {...rise(0)} className="mb-7 flex justify-center">
          <span className="border-brand/15 bg-brand-soft text-brand inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium">
            <span className="bg-brand size-1.5 rounded-full" />
            Applications open &middot; Cohort [X]
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="text-[2.6rem] leading-[1.05] font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Build the company
          <br />
          you keep{" "}
          <span className="relative inline-block whitespace-nowrap text-brand">
            talking about.
            <SketchUnderline className="absolute -bottom-2 left-0 h-3 w-full" />
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.18)}
          className="text-muted-foreground mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
        >
          NYP's student incubator. We give you funding, mentors, and a room full of builders
          for [6] months — so the idea you've been sitting on finally ships.
        </motion.p>

        <motion.div {...rise(0.28)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CtaLink href={APPLY_URL} external variant="primary" arrow>
            Apply now
          </CtaLink>
          <CtaLink href="#how" variant="secondary">
            See how it works
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
    <section className="border-b border-border bg-white px-6 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
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
      <div className="relative rounded-2xl border border-border bg-brand-soft/60 p-8">
        <SketchFrame className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]" />
        <svg viewBox="0 0 340 260" className="relative w-full text-brand" fill="none" aria-hidden="true">
          {/* axes */}
          <path
            d="M40 20v200h270"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
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
          <path d="M244 44l-2-22m2 22l20-6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <IconRocket className="absolute top-7 right-8 size-9 text-brand" />
        <Sparkle className="absolute bottom-10 left-10 size-4 text-brand/50" />
        <div className="absolute bottom-7 left-9 font-serif text-sm text-muted-foreground">
          you are here
        </div>
        <div className="absolute top-16 right-9 font-serif text-sm font-medium text-brand">
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
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] font-medium tracking-tight text-foreground md:text-5xl">
            So, what is it,
            <br />
            <span className="relative inline-block">
              really?
              <SketchCircle className="absolute -inset-x-4 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)]" />
            </span>
          </h2>
          <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              The NYP Tech Incubator is for students who want to build real companies — not class
              projects. Every [semester] we take a small cohort of teams and spend [6] months
              turning rough ideas into products with actual users.
            </p>
            <p>
              You get funding to build, weekly mentorship from founders and operators, a workspace
              on campus, and a network that doesn't expire the day you graduate. It all ends with
              Demo Day: you, on stage, in front of investors and industry partners.
            </p>
            <p className="font-medium text-foreground">
              Most of all, it's a room full of people who are as serious about building as you are.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <GrowthSketch />
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ── Benefits ─────────────────────────────────────────────────────────────────

function Benefits() {
  return (
    <SectionShell id="benefits" className="bg-muted/50">
      <Reveal className="max-w-2xl">
        <Eyebrow>Why join</Eyebrow>
        <h2 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
          Everything you need to
          <span className="relative whitespace-nowrap">
            {" "}go from idea to company.
            <SketchUnderline className="absolute -bottom-1 left-0 h-2.5 w-full" />
          </span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={(i % 3) * 0.08}>
            <div className="group h-full rounded-2xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
              <div className="grid size-12 place-items-center rounded-xl bg-brand-soft transition-colors group-hover:bg-brand/10">
                <b.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{b.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          </Reveal>
        ))}
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
        <h2 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
          You don't have to be a <span className="font-serif italic">“startup person.”</span>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          You just need an idea you can't stop thinking about — and the will to build it.
          The rest, we'll figure out together.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PERSONAS.map((p, i) => (
          <Reveal key={p.tag} delay={(i % 4) * 0.07}>
            <div className="h-full rounded-2xl border border-border bg-white p-6">
              <span className="font-serif text-lg font-medium text-brand">{p.tag}</span>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          <div className="bg-white p-8">
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              You don't need
            </p>
            <ul className="mt-5 space-y-3.5">
              {dont.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-muted-foreground">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted">
                    <X className="size-3 text-muted-foreground" />
                  </span>
                  <span className="line-through decoration-muted-foreground/40">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8">
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">You just need</p>
            <ul className="mt-5 space-y-3.5">
              {need.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-foreground">
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

// ── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <SectionShell id="how" className="bg-muted/50">
      <Reveal className="max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
          From application to Demo Day.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Five steps. The hardest one is the first — and it takes about [10] minutes.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.1} className="relative">
            {/* connector to the next step (desktop) */}
            {i < STEPS.length - 1 && (
              <DashedConnector className="absolute top-9 left-[60%] hidden h-6 w-[80%] lg:block" />
            )}
            <div className="relative flex flex-col items-start">
              <div className="relative grid size-[72px] place-items-center rounded-2xl border border-border bg-white shadow-sm">
                <step.icon className="size-8" />
                <span className="absolute -top-2.5 -right-2.5 grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-12 flex justify-center">
        <CtaLink href={APPLY_URL} external variant="primary" arrow>
          Start your application
        </CtaLink>
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
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] font-medium tracking-tight text-foreground md:text-5xl">
          Built by students who started right where you are.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {STORIES.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <figure className="relative flex h-full flex-col rounded-2xl border border-border bg-white p-7">
              <QuoteMark className="h-8 w-10" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                {s.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-soft font-serif text-base font-medium text-brand">
                    {s.name.replace(/[^A-Za-z]/g, "").charAt(0) || "F"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
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
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
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
                    className={`text-foreground block cursor-pointer font-serif text-3xl tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:text-4xl ${
                      i === active ? "font-bold" : "font-normal"
                    }`}
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

function StartupsMarquee() {
  const reduced = useReducedMotion();
  const marquee = [...STARTUPS, ...STARTUPS];
  return (
    <div className="mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max items-center gap-4"
        animate={reduced ? undefined : { x: ["-50%", "0%"] }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
      >
        {marquee.map((s, i) => (
          <span
            key={i}
            className="border-border text-muted-foreground flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            <span className="bg-brand size-1.5 rounded-full" />
            {s.name}
            <span className="text-muted-foreground/60 text-xs">· {s.category}</span>
          </span>
        ))}
      </motion.div>
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
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <Eyebrow>Our startups</Eyebrow>
          <h2 className="text-foreground mt-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            Real companies, built right
            <span className="text-brand relative whitespace-nowrap">
              {" "}here.
              <SketchUnderline className="absolute -bottom-1 left-0 h-2.5 w-full" />
            </span>
          </h2>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            {enhanced
              ? "Scroll through them — each name grows as its story takes the stage on the right."
              : "A few of the startups that came out of the program — every one started as a student with an idea."}
          </p>
        </Reveal>
      </div>

      <div className="mt-12">{enhanced ? <PinnedStartups /> : <StackedStartups />}</div>

      <div className="mx-auto max-w-6xl px-6">
        <StartupsMarquee />
      </div>
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
          <h2 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
            Good questions.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Still unsure about something? Reach out — we'd rather you ask than not apply.
          </p>
          <DoodleArrow className="mt-8 hidden size-20 -scale-x-100 text-brand/40 md:block" />
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} question={f.q}>
                {f.a}
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section id="apply" className="px-6 py-20">
      <div className="border-brand/15 bg-brand-soft/50 relative mx-auto max-w-6xl overflow-hidden rounded-3xl border px-6 py-20 text-center md:py-28">
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
          <h2 className="text-foreground font-serif text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl">
            It's never too early
            <br />
            to{" "}
            <span className="text-brand relative inline-block whitespace-nowrap">
              apply.
              <SketchUnderline className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-lg leading-relaxed">
            The worst thing you can do with an idea is wait. Applications for Cohort [X] close
            [Month DD, Year].
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
    <footer className="border-t border-border bg-white px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo.png" alt="" className="size-8 rounded-full" />
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                NYP Technopreneurship Club
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The student incubator at Nanyang Polytechnic. We help students turn ideas into
              companies.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
            <nav className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Explore
              </p>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Get started
              </p>
              <CtaLink href={APPLY_URL} external variant="primary" arrow className="w-fit px-4 py-2 text-[13px]">
                Apply now
              </CtaLink>
              <div className="mt-1 flex items-center gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:border-brand/40 hover:bg-brand-soft"
                  >
                    <img src={s.icon} alt="" className="size-4 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />
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
      <Footer />
    </div>
  );
}
