import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

const STARTUPS = [
  {
    name: "Virage",
    description: "A vishing simulation platform designed for educational purposes.",
    imageUrl: "/assets/startups/virage.png",
    url: "https://virage.app",
  },
  {
    name: "ProcoLink",
    description: "A comprehensive suite of tools to build, test, and deploy conversation pipelines for your prospects.",
    imageUrl: "/assets/startups/procolink.png",
    url: "https://proco.link",
  },
  {
    name: "Bihance",
    description: "An end-to-end platform for managing your events.",
    imageUrl: "/assets/startups/bihance.png",
    url: "https://bihance.app",
  },
  {
    name: "Pronto",
    description: "Let us find your next part-time job for you.",
    imageUrl: "/assets/startups/pronto.png",
    url: "https://pronto.sg",
  },
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

export default function StartupsSection() {
  return (
    <section id="startups" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-3 border-[#5046e6]/30 text-[#5046e6]">
              Startups
            </Badge>
            <h2 className="text-foreground text-4xl leading-tight font-bold tracking-tight md:text-5xl">
              Our Home-Developed Startups
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg leading-relaxed">
              Find out what your seniors and members of this club has founded and built!
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STARTUPS.map((startup, i) => (
            <FadeIn key={startup.name} delay={i * 0.1} className="h-full">
              <Card className="group border-border bg-card h-full overflow-hidden pt-0 pb-6 transition-all duration-300 hover:border-[#5046e6]/30 hover:shadow-lg hover:shadow-[#5046e6]/5">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={startup.imageUrl}
                    alt={startup.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground text-lg font-semibold">{startup.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{startup.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
                    <a href={startup.url} target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
