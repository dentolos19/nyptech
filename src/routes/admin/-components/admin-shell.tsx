import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
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
  const isEmailWorkspace = pathname === "/admin/emails";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    <div className={`bg-[#fffaf7] md:flex ${isEmailWorkspace ? "md:h-dvh md:overflow-hidden" : "min-h-dvh"}`}>
      <aside
        className={`border-border bg-white md:sticky md:top-0 md:flex md:h-dvh md:shrink-0 md:flex-col md:border-r md:transition-[width] ${
          isSidebarCollapsed ? "md:w-24" : "md:w-64"
        }`}
      >
        <header
          className={`border-border flex h-18 items-center border-b px-5 md:h-20 ${
            isSidebarCollapsed ? "md:justify-center md:px-0" : ""
          }`}
        >
          <a href="/" className="flex min-w-0 items-center gap-3" aria-label="Open the public site">
            <img src="/icon2.jpeg" alt="" className="size-9 rounded-full" />
            <span className={`truncate text-sm font-semibold tracking-tight ${isSidebarCollapsed ? "md:hidden" : ""}`}>
              NYP Technopreneurship
            </span>
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
                className={`focus-visible:outline-brand flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isSidebarCollapsed ? "md:justify-center" : ""
                }`}
                activeProps={{ className: "bg-brand text-white" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-brand-soft hover:text-foreground" }}
                aria-label={item.label}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className="size-4" />
                <span className={isSidebarCollapsed ? "md:hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <footer
          className={`border-border relative flex items-center justify-between border-t px-4 py-4 md:mt-auto md:border-t-0 ${
            isSidebarCollapsed ? "md:justify-center md:px-2" : ""
          }`}
        >
          {signOutError ? (
            <p role="alert" className="text-destructive absolute right-4 bottom-full mb-2 text-xs">
              {signOutError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            disabled={isSigningOut}
            className={`text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-brand flex size-10 items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 ${
              isSidebarCollapsed ? "md:hidden" : ""
            }`}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-4" />
            <span className="sr-only">{isSigningOut ? "Signing out" : "Sign out"}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-brand hidden size-10 items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:flex"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </footer>
      </aside>

      <main
        className={
          isEmailWorkspace
            ? "min-w-0 flex-1 md:h-dvh md:overflow-hidden"
            : "min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
        }
      >
        <Outlet />
      </main>
    </div>
  );
};
