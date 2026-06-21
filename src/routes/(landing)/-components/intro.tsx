import { ArrowRightIcon, CoinsIcon, RocketIcon, UsersIcon } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Button } from "#/components/ui/button";

const STATS = [
  { icon: RocketIcon, value: "5+", label: "Startups Launched" },
  { icon: UsersIcon, value: "20+", label: "Mentors" },
  { icon: CoinsIcon, value: "30k+", label: "Funding" },
];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function IntroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24 pb-20">
      {/* Subtle background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: "url('/assets/nyp.jpg')" }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        {/* Text content */}
        <div className="max-w-xl max-md:text-center">
          <FadeIn>
            <h1 className="text-foreground text-5xl leading-[1.08] font-bold tracking-[-0.025em] sm:text-6xl md:text-6xl lg:text-7xl">
              Launch Your Startup <span className="text-[#5046e6]">Dream</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              Our incubator program empowers entrepreneurs to turn innovative ideas into successful businesses through
              mentorship, resources, and a vibrant startup ecosystem.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4 max-md:justify-center">
              <Button asChild variant="default" size="lg" className="rounded-full">
                <a href="#contact" className="group flex items-center gap-2">
                  Join Us Now
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="#innovation">Learn More</a>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm max-md:justify-center">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="size-4 text-[#5046e6]" />
                  <span className="text-foreground font-semibold">{stat.value}</span>
                  <span className="text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Hero image with hexagon-like rounded shape */}
        <FadeIn delay={0.15} className="flex justify-center max-md:order-first">
          <div className="relative overflow-hidden rounded-[2rem] max-md:mt-8 md:aspect-square md:w-full md:max-w-lg">
            <img
              src="/assets/blog/nyplink-committee.jpg"
              alt="Incubator Illustration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5046e6]/15 via-transparent to-transparent" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
