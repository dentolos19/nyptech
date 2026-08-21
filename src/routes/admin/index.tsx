import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Mail, Rocket, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin | NYP Technopreneurship" }] }),
  component: AdminDashboard,
});

const SITE_FACTS = [
  { label: "Featured Ventures", value: "4", detail: "Public startup profiles." },
  { label: "Community Ventures", value: "15", detail: "Listed in the logo directory." },
  { label: "Funding Support", value: "$30K+", detail: "Shown on the public site." },
];

const CHECKLIST = [
  { title: "Startup Directory", detail: "Review company links and logos before the next showcase." },
  { title: "Program Information", detail: "Check event dates, funding details, and application guidance." },
  { title: "Community Inbox", detail: "Respond to prospective founders and student builders." },
];

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase">Site administration</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.95] font-medium tracking-tight sm:text-6xl">
            Keep the front door current.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed">
            A quick view of the public NYP Technopreneurship site and the work that keeps it useful for student
            builders.
          </p>
        </div>
        <div className="border-brand/20 bg-brand relative overflow-hidden rounded-3xl p-7 text-white">
          <Rocket className="absolute top-6 right-6 size-7 opacity-70" />
          <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">Admin access</p>
          <p className="mt-8 max-w-52 font-serif text-3xl leading-tight">Signed in with your authenticator.</p>
          <p className="mt-5 text-sm leading-relaxed text-white/80">Your session expires after eight hours.</p>
        </div>
      </section>

      <section aria-label="Public site summary" className="mt-10 grid gap-3 md:grid-cols-3">
        {SITE_FACTS.map((fact) => (
          <article key={fact.label} className="border-border rounded-2xl border bg-white p-6">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{fact.label}</p>
            <p className="mt-5 text-4xl font-semibold tracking-tight">{fact.value}</p>
            <p className="text-muted-foreground mt-2 text-sm">{fact.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border-border rounded-2xl border bg-white">
          <div className="border-border flex items-center justify-between border-b px-6 py-5">
            <div>
              <p className="text-sm font-semibold">Editorial checklist</p>
              <p className="text-muted-foreground mt-1 text-sm">Review these when you update the site.</p>
            </div>
            <Users className="text-brand size-5" />
          </div>
          <ol className="divide-border divide-y">
            {CHECKLIST.map((item, index) => (
              <li key={item.title} className="flex gap-4 px-6 py-5">
                <span className="text-brand bg-brand-soft grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="border-border rounded-2xl border bg-white p-6">
          <p className="text-sm font-semibold">Quick links</p>
          <div className="mt-5 space-y-3">
            <a
              href="/"
              className="group border-border hover:border-brand/40 hover:bg-brand-soft flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            >
              View public site
              <ExternalLink className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="mailto:nyptechnopreneurs@gmail.com"
              className="group border-border hover:border-brand/40 hover:bg-brand-soft flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            >
              Open community inbox
              <Mail className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div className="border-border mt-7 border-t pt-5">
            <a href="/" className="text-brand inline-flex items-center gap-1 text-sm font-semibold hover:underline">
              Return to the public site
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
