import { createFileRoute } from "@tanstack/react-router";
import { Link as LinkIcon } from "lucide-react";

export const Route = createFileRoute("/admin/links")({
  head: () => ({ meta: [{ title: "Links | NYP Technopreneurship Admin" }] }),
  component: LinksPage,
});

function LinksPage() {
  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase">Resources</p>
      <h1 className="mt-4 font-serif text-5xl leading-[0.95] font-medium tracking-tight sm:text-6xl">Links.</h1>
      <div className="border-border mt-10 grid min-h-72 place-items-center rounded-3xl border border-dashed bg-white p-8 text-center">
        <div>
          <span className="text-brand bg-brand-soft mx-auto grid size-12 place-items-center rounded-2xl">
            <LinkIcon className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">Link management will live here.</h2>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
            This page is ready for the club links, startup profiles, and other public destinations you manage.
          </p>
        </div>
      </div>
    </section>
  );
}
