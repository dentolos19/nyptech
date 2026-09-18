import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import AppProvider from "#/components/app-provider";
import ErrorOccurred from "#/components/error-occurred";
import Loading from "#/components/loading";
import NotFound from "#/components/not-found";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "NYP Technopreneurship",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/icon2.jpeg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className={"antialiased"}>
        <AppProvider>{children}</AppProvider>
        <Scripts />
      </body>
    </html>
  ),
  pendingComponent: () => (
    <main className={"h-dvh"}>
      <Loading />
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className={"h-dvh"}>
      <ErrorOccurred error={error instanceof Error ? error : new Error(String(error))} />
    </main>
  ),
  notFoundComponent: () => (
    <main className={"h-dvh"}>
      <NotFound />
    </main>
  ),
});
