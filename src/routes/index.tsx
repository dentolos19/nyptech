import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export const Route = createFileRoute("/")({ component: Home });

// ── Data ───────────────────────────────────────────────────────────────────────

const STARTUPS = [
  {
    name: "Bihance",
    tagline: "Student portfolios, reinvented.",
    logo: "/assets/startups/bihance.png",
    cover: "/assets/placeholder-banner.png",
    description:
      "A platform empowering students to showcase their work like professionals — landing better opportunities before they even graduate.",
    achievement: "500+ student portfolios created",
  },
  {
    name: "ProcoLink",
    tagline: "Connecting students to real work.",
    logo: "/assets/startups/procolink.png",
    cover: "/assets/showcase/procolink.png",
    description:
      "A marketplace where NYP students find meaningful freelance gigs and companies discover untapped polytechnic talent.",
    achievement: "200+ gigs facilitated",
  },
  {
    name: "Pronto",
    tagline: "Delivery built for campus life.",
    logo: "/assets/startups/pronto.png",
    cover: "/assets/bee.jpg",
    description:
      "On-demand campus delivery that cuts wait times and congestion — purpose-built for how students actually live.",
    achievement: "1,000+ deliveries completed",
  },
  {
    name: "Virage",
    tagline: "The future of sustainable mobility.",
    logo: "/assets/startups/virage.png",
    cover: "/assets/showcase/autozone.png",
    description:
      "EV fleet management for SMEs in Southeast Asia, making the transition to sustainable transport finally tractable.",
    achievement: "3 enterprise pilots launched",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "NYP Technopreneurship Club compressed months of growth into just weeks. The community pushed me harder than any class ever could.",
    name: "Alex Tan",
    role: "Founder, ProcoLink · Cohort 2",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    quote: "I came in with a rough idea and a GitHub repo. I left with a product, paying customers, and a real team.",
    name: "Sarah Lim",
    role: "Co-founder, Bihance · Cohort 1",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    quote: "The network is irreplaceable. My batchmates became my co-founders, advisors, and first believers.",
    name: "Marcus Wong",
    role: "Founder, Pronto · Cohort 2",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    quote: "Being around the top builders in NYP completely resets your standard for what's possible in six months.",
    name: "Priya Nair",
    role: "Co-founder, Virage · Cohort 3",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    quote:
      "The urgency is infectious. It became the most productive stretch of my life — and I still haven't slowed down.",
    name: "Jordan Ho",
    role: "Founder, Shaper · Cohort 3",
    avatar: "/assets/placeholder-avatar.jpg",
  },
  {
    quote: "Partners treat you like a peer, not a student. That respect changes how you carry yourself as a founder.",
    name: "Michelle Chen",
    role: "Co-founder, AutoZone · Cohort 4",
    avatar: "/assets/placeholder-avatar.jpg",
  },
];

const EVENTS = [
  {
    title: "SOLVE Hackathon 2025",
    date: "March 15, 2025",
    image: "/assets/blog/solveposter.jpg",
    category: "Hackathon",
    description:
      "48 hours to build real-world solutions for Singapore's most pressing problems. 200+ participants, 40 teams.",
  },
  {
    title: "NYPLink Industry Panel",
    date: "February 2, 2025",
    image: "/assets/blog/nyplink-panelists.png",
    category: "Panel",
    description:
      "Industry leaders share how they built companies from zero — and what they wish they'd known on day one.",
  },
  {
    title: "Startup Workshop Series",
    date: "January 20, 2025",
    image: "/assets/blog/workshop.jpeg",
    category: "Workshop",
    description: "Three-session deep dives into product design, go-to-market strategy, and early-stage fundraising.",
  },
];

const SHOWCASE = [
  {
    name: "AutoZone",
    category: "AutoTech",
    image: "/assets/showcase/autozone.png",
    description: "Smart parking and EV charging platform for residential and commercial estates.",
  },
  {
    name: "ProcoLink",
    category: "Marketplace",
    image: "/assets/showcase/procolink.png",
    description: "B2B marketplace connecting polytechnic talent with industry projects.",
  },
  {
    name: "Shaper",
    category: "EdTech",
    image: "/assets/showcase/shaper.png",
    description: "AI-powered skills assessment platform for student career readiness.",
  },
];

const MARQUEE_LOGOS = [
  { name: "Bihance", src: "/assets/startups/bihance.png" },
  { name: "ProcoLink", src: "/assets/startups/procolink.png" },
  { name: "Pronto", src: "/assets/startups/pronto.png" },
  { name: "Virage", src: "/assets/startups/virage.png" },
  { name: "AutoZone", src: "/assets/showcase/autozone.png" },
  { name: "Shaper", src: "/assets/showcase/shaper.png" },
];

const STATS = [
  { value: "20+", label: "Startups Launched" },
  { value: "200+", label: "Students Impacted" },
  { value: "4", label: "Cohorts Completed" },
];

const PHOTO_STRIP = [
  "/assets/blog/group.jpg",
  "/assets/blog/hackathon.jpeg",
  "/assets/blog/nyplink-committee.jpg",
  "/assets/solve.jpg",
  "/assets/blog/workshop.jpeg",
];

// ── Utility Components ─────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function LogoMarquee() {
  const doubled = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex w-max items-center gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex h-9 w-28 items-center justify-center opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          >
            <img src={logo.src} alt={logo.name} className="max-h-9 max-w-28 object-contain" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Section Components ─────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.06] bg-black/75 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <img src="/assets/logo.png" alt="NYP Technopreneurship Club" className="h-8 w-auto" />
        <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
          <a href="#startups" className="transition-colors duration-200 hover:text-white">
            Startups
          </a>
          <a href="#about" className="transition-colors duration-200 hover:text-white">
            About
          </a>
          <a href="#events" className="transition-colors duration-200 hover:text-white">
            Events
          </a>
          <a href="#showcase" className="transition-colors duration-200 hover:text-white">
            Showcase
          </a>
        </div>
        <a
          href="#apply"
          className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
        >
          Join us
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
      {/* Radial bloom — the signature visual */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Subtle background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: "url('/assets/nyp.jpg')" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.2em] text-orange-400 uppercase"
        >
          <span className="h-px w-5 bg-orange-500/60" />
          NYP Technopreneurship Club
          <span className="h-px w-5 bg-orange-500/60" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-5xl leading-[1.03] font-bold tracking-[-0.025em] text-white sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem]"
        >
          We turns students into <span className="text-orange-500">formidable</span>{" "}
          <span className="text-orange-500">builders</span>
          <sup className="ml-1 align-super text-base font-light tracking-normal text-gray-500 md:text-2xl">[1]</sup>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl"
        >
          Singapore's leading student startup accelerator at Nanyang Polytechnic. We fund ideas, build products, and
          launch companies — together.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#apply"
            className="rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
          >
            Join us
          </a>
          <a
            href="#startups"
            className="rounded-full border border-white/20 px-8 py-4 text-base font-medium text-gray-300 transition-all duration-200 hover:border-white/40 hover:text-white"
          >
            See our startups
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mx-auto mt-20 grid max-w-md grid-cols-3 gap-8"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-xs leading-tight tracking-wide text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute bottom-8 mx-auto max-w-xl px-8 text-center text-[11px] text-gray-600"
      >
        [1] "A formidable person is one who seems like they'll get what they want, regardless of whatever obstacles are
        in the way." — inspired by Paul Graham
      </motion.p>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="border-y border-white/[0.06] bg-[#080808] py-10">
      <p className="mb-7 text-center text-[11px] font-medium tracking-[0.2em] text-gray-600 uppercase">
        Companies built with us
      </p>
      <LogoMarquee />
    </section>
  );
}

function StartupsSection() {
  return (
    <section id="startups" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-orange-400 uppercase">Portfolio</p>
              <h2 className="text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
                Built in Nanyang Polytechnic.
                <br />
                Now in the wild.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400 md:text-right">
              Every startup starts with a builder who refused to wait. These are the ones who bet on themselves.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STARTUPS.map((startup, i) => (
            <FadeIn key={startup.name} delay={i * 0.09}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f0f] transition-colors duration-300 hover:border-orange-500/35">
                {/* Cover */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={startup.cover}
                    alt={startup.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <img src={startup.logo} alt={startup.name} className="h-7 w-7 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{startup.name}</h3>
                      <p className="text-[11px] leading-tight text-orange-400">{startup.tagline}</p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-gray-400">{startup.description}</p>
                  <div className="border-t border-white/[0.06] pt-3">
                    <p className="text-xs font-medium text-white/80">{startup.achievement}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-[#080808] px-6 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <FadeIn>
          <div className="space-y-6">
            <p className="text-[11px] font-medium tracking-[0.18em] text-orange-400 uppercase">About</p>
            <h2 className="text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
              A new model for student startups.
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              NYP Technopreneurship Club developed a new model for student startup development. Every semester, we
              invest in a select cohort of student teams — not just with funding, but with mentorship, network, and
              real-world exposure.
            </p>
            <p className="text-sm leading-relaxed text-gray-400">
              We work intensively with teams to get their products into the best possible shape before Demo Day, where
              they present to industry leaders and investors. But the relationship doesn't end there — our alumni
              network stays connected for life.
            </p>
            <div className="grid grid-cols-2 gap-5 pt-2">
              {[
                { value: "$50K+", label: "Seed funding available" },
                { value: "30+", label: "Industry mentors" },
                { value: "6 months", label: "Intensive program" },
                { value: "Singapore", label: "Based in SG" },
              ].map((item) => (
                <div key={item.label} className="border-l-2 border-orange-500/50 pl-4">
                  <p className="text-lg font-bold text-white">{item.value}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/assets/nyp.jpg" alt="NYP Campus" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/15 via-transparent to-transparent" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-orange-400 uppercase">
              In Founders' Words
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">What our founders say</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0f0f0f] p-6 transition-colors duration-300 hover:border-orange-500/25">
                <p className="flex-1 text-sm leading-relaxed text-gray-200">"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-white/[0.06] pt-2">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-9 w-9 flex-shrink-0 rounded-full border border-white/10 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section id="showcase" className="bg-[#080808] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-orange-400 uppercase">Showcase</p>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Built by students.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
              Products that solve real problems, shipped by teams who had the audacity to try.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SHOWCASE.map((project, i) => (
            <FadeIn key={project.name} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f0f] transition-colors duration-300 hover:border-orange-500/30">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] text-orange-400 uppercase">
                    {project.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{project.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{project.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section id="events" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-orange-400 uppercase">Events</p>
              <h2 className="text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
                Where builders meet.
              </h2>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-orange-400 transition-colors hover:text-orange-300 md:self-end"
            >
              View all events →
            </a>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {EVENTS.map((event, i) => (
            <FadeIn key={event.title} delay={i * 0.1}>
              <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f0f] transition-colors duration-300 hover:border-orange-500/30">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] text-orange-400 uppercase">
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                  <h3 className="text-lg leading-snug font-semibold tracking-tight text-white">{event.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{event.description}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section id="apply" className="border-t border-white/[0.06] bg-[#080808] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        {/* Photo strip */}
        <div className="mb-20 flex h-40 gap-2 overflow-hidden rounded-2xl md:h-52">
          {PHOTO_STRIP.map((src, i) => (
            <div key={i} className="min-w-0 flex-1 overflow-hidden">
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl leading-[1.05] font-bold tracking-tight text-white md:text-6xl">
              It's never too early
              <br />
              <span className="text-orange-500">to apply.</span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400">
              We fund teams with no revenue, no product, and no fully baked idea. All we need is one thing: builders who
              refuse to wait.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="rounded-full bg-orange-500 px-10 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
              >
                Join us
              </a>
              <a
                href="#about"
                className="rounded-full border border-white/20 px-8 py-4 text-base font-medium text-gray-300 transition-all duration-200 hover:border-white/40 hover:text-white"
              >
                Learn more
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  const socials = [
    { name: "Instagram", icon: "/assets/icons/instagram.svg", href: "#" },
    { name: "LinkedIn", icon: "/assets/icons/linkedin.svg", href: "#" },
    { name: "Discord", icon: "/assets/icons/discord.svg", href: "#" },
    { name: "Telegram", icon: "/assets/icons/telegram.svg", href: "#" },
  ];

  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="NYP Technopreneurship Club" className="h-7 w-auto opacity-60" />
          <span className="text-sm text-gray-500">NYP Technopreneurship Club</span>
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors duration-200 hover:border-orange-500/40"
            >
              <img
                src={s.icon}
                alt={s.name}
                className="h-4 w-4 opacity-40 brightness-0 invert transition-opacity group-hover:opacity-90"
              />
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-600"> © 2026 NYP Technopreneurship Club. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <MarqueeSection />
        <StartupsSection />
        <AboutSection />
        <TestimonialsSection />
        <ShowcaseSection />
        <EventsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
