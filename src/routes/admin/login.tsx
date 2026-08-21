import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin sign in | NYP Technopreneurship" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Unable to verify the code.");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Unable to verify the code. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-[#fffaf7] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-border bg-white p-7 shadow-[0_24px_70px_rgba(50,24,11,0.08)] sm:p-9">
        <a href="/" className="flex items-center gap-3" aria-label="Open the public site">
          <img src="/icon2.jpeg" alt="" className="size-10 rounded-full" />
          <span className="text-sm font-semibold tracking-tight">NYP Technopreneurship</span>
        </a>

        <div className="mt-10">
          <span className="text-brand grid size-11 place-items-center rounded-2xl bg-brand-soft">
            <KeyRound className="size-5" />
          </span>
          <p className="text-brand mt-6 text-xs font-semibold tracking-[0.16em] uppercase">Admin access</p>
          <h1 className="mt-3 font-serif text-4xl leading-none font-medium tracking-tight">Enter your code.</h1>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Use the six-digit code from your authenticator app to open the admin area.
          </p>
        </div>

        <form onSubmit={signIn} className="mt-8">
          <label htmlFor="totp-code" className="text-sm font-medium">
            Authenticator code
          </label>
          <input
            id="totp-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            className="mt-2 h-12 w-full rounded-xl border border-input bg-white px-4 text-center font-mono text-xl tracking-[0.45em] outline-none transition-shadow placeholder:text-muted-foreground/50 focus:border-brand focus:ring-3 focus:ring-brand/15"
            placeholder="000000"
          />
          {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting || code.length !== 6}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {isSubmitting ? "Verifying" : "Open admin"}
          </button>
        </form>
      </section>
    </main>
  );
}
