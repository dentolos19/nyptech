import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminShell } from "./-components/admin-shell.tsx";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login" || typeof document === "undefined") return;

    const response = await fetch("/admin/auth/status", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw redirect({ to: "/admin/login" });
  },
  component: AdminShell,
});
