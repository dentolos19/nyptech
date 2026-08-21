import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Link as LinkIcon, LogOut, Mail, type LucideIcon } from "lucide-react";
import { useState } from "react";

type NavigationItem = {
  label: string;
  to: "/admin" | "/admin/emails" | "/admin/links";
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Emails", to: "/admin/emails", icon: Mail },
  { label: "Links", to: "/admin/links", icon: LinkIcon },
];

export const AdminShell = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  if (pathname === "/admin/login") return <Outlet />;

  const signOut = async () => {
    setIsSigningOut(true);
    setSignOutError("");

    try {
      const response = await fetch("/admin/auth/logout", { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("Unable to sign out.");

      window.location.assign("/admin/login");
    } catch {
      setSignOutError("Unable to sign out. Try again.");
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#fffaf7] md:flex">
      <aside className="border-border bg-white md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col md:border-r">
        <header className="border-border flex h-18 items-center border-b px-5 md:h-20">
          <a href="/" className="flex min-w-0 items-center gap-3" aria-label="Open the public site">
            <img src="/icon2.jpeg" alt="" className="size-9 rounded-full" />
            <span className="truncate text-sm font-semibold tracking-tight">NYP Technopreneurship</span>
          </a>
        </header>

        <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:px-4 md:py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/admin" }}
                className="focus-visible:outline-brand flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                activeProps={{ className: "bg-brand text-white" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-brand-soft hover:text-foreground" }}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <footer className="border-border border-t px-4 py-4 md:mt-auto md:border-t-0">
          {signOutError ? (
            <p role="alert" className="text-destructive mb-3 text-xs">
              {signOutError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            disabled={isSigningOut}
            className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-brand flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut className="size-4" />
            {isSigningOut ? "Signing out" : "Sign out"}
          </button>
        </footer>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <Outlet />
      </main>
    </div>
  );
};
