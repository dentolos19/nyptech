import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

const FEATURES = [
  {
    title: "Learn From Workshops",
    image: "/assets/blog/workshop.jpeg",
    description:
      "We have a list of upcoming workshops catered just for you to learn more about what it takes to start a SaaS.",
  },
  {
    title: "Join The Community",
    image: "/assets/blog/hackathon.jpeg",
    description:
      "Join a group of like minded people to brainstorm, develop and maintain code, get a chance to work with real-world clients.",
  },
  {
    title: "Access Capital",
    image: "/assets/blog/group.jpg",
    description:
      "We aim to provide you with grants and funding opportunities as well as advise on how to better pursue them.",
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

export default function InnovationSection() {
  return (
    <section id="innovation" className="bg-muted px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-3 border-[#5046e6]/30 text-[#5046e6]">
              Innovation
            </Badge>
            <h2 className="text-foreground text-4xl leading-tight font-bold tracking-tight md:text-5xl">
              Faster Iteration, More Innovation
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg leading-relaxed">
              Empowering breakthrough ideas by streamlining iterations and driving continuous innovation.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1} className="h-full">
              <Card className="group border-border bg-card h-full overflow-hidden pt-0 pb-6 transition-all duration-300 hover:border-[#5046e6]/30 hover:shadow-lg hover:shadow-[#5046e6]/5">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
