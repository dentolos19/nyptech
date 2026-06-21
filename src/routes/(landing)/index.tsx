import { createFileRoute } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import ContactSection from "#/routes/(landing)/_components/contact";
import FeedbackSection from "#/routes/(landing)/_components/feedback";
import InnovationSection from "#/routes/(landing)/_components/innovation";
import IntroSection from "#/routes/(landing)/_components/intro";
import StartupsSection from "#/routes/(landing)/_components/startups";

export const Route = createFileRoute("/(landing)/")({ component: Home });

// ── Navbar ─────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="border-border bg-background/75 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <img src="/assets/logo.png" alt="NYP Technopreneurship Club" className="h-8 w-auto" />
        <div className="text-muted-foreground hidden items-center gap-8 text-sm md:flex">
          <a href="#startups" className="hover:text-foreground transition-colors duration-200">
            Startups
          </a>
          <a href="#innovation" className="hover:text-foreground transition-colors duration-200">
            Innovation
          </a>
          <a href="#contact" className="hover:text-foreground transition-colors duration-200">
            Contact
          </a>
        </div>
        <Button asChild variant="default" size="sm" className="rounded-full">
          <a href="#contact">Join us</a>
        </Button>
      </nav>
    </header>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────

function Footer() {
  const socials = [
    { name: "Instagram", icon: "/assets/icons/instagram.svg", href: "#" },
    { name: "LinkedIn", icon: "/assets/icons/linkedin.svg", href: "#" },
    { name: "Discord", icon: "/assets/icons/discord.svg", href: "#" },
    { name: "Telegram", icon: "/assets/icons/telegram.svg", href: "#" },
  ];

  return (
    <footer className="border-border border-t px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="NYP Technopreneurship Club" className="h-7 w-auto opacity-60" />
          <span className="text-muted-foreground text-sm">NYP Technopreneurship Club</span>
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className="group border-border flex size-9 items-center justify-center rounded-full border transition-colors duration-200 hover:border-[#5046e6]/40"
            >
              <img
                src={s.icon}
                alt={s.name}
                className="size-4 opacity-40 brightness-0 invert transition-opacity group-hover:opacity-90"
              />
            </a>
          ))}
        </div>

        <p className="text-muted-foreground text-xs">&copy; 2026 NYP Technopreneurship Club. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <Navbar />
      <main>
        <IntroSection />
        <InnovationSection />
        <StartupsSection />
        <FeedbackSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
