import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { Badge } from "#/components/ui/badge";

const SOCIALS = [
  { name: "Discord", icon: "/assets/icons/discord.svg", href: "https://go.nyptech.club/discord" },
  { name: "WhatsApp", icon: "/assets/icons/whatsapp.svg", href: "https://go.nyptech.club/whatsapp" },
  { name: "Telegram", icon: "/assets/icons/telegram.svg", href: "https://go.nyptech.club/telegram" },
  { name: "Instagram", icon: "/assets/icons/instagram.svg", href: "https://go.nyptech.club/instagram" },
  { name: "LinkedIn", icon: "/assets/icons/linkedin.svg", href: "https://go.nyptech.club/linkedin" },
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

export default function ContactSection() {
  return (
    <section id="contact" className="border-border border-t px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <Badge variant="outline" className="mb-4 border-[#5046e6]/30 text-[#5046e6]">
            Connect
          </Badge>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h2 className="text-foreground mb-4 text-5xl leading-tight font-bold tracking-tight md:text-6xl">
            Get to know us better!
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Join one of our social media channels to get latest updates and opportunities from us!
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex justify-center gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="group border-border flex size-12 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 hover:border-[#5046e6]/40"
              >
                <img
                  src={social.icon}
                  alt={social.name}
                  className="size-5 opacity-40 brightness-0 invert transition-opacity group-hover:opacity-90"
                />
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
