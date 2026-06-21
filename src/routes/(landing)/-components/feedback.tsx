import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Button } from "#/components/ui/button";

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

export default function FeedbackSection() {
  return (
    <section className="bg-muted px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <h2 className="text-foreground mb-4 text-5xl leading-tight font-bold tracking-tight md:text-6xl">
            Do you have anything for us?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Don&apos;t just be a bystander and get involved!
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button asChild variant="default" size="lg" className="rounded-full">
            <a href="#contact">Send us a message!</a>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
