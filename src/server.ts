import handler from "@tanstack/react-start/server-entry";
import { routeAgentRequest } from "agents";

import { EmailAgent } from "#/lib/emails/agent";
import { handleEmailApi } from "#/lib/emails/api";
import { handleIncomingEmail } from "#/lib/emails/inbound";
import {
  clearAdminSessionCookie,
  createAdminSession,
  getAdminSessionCookie,
  hasAdminSession,
  isAdminAuthConfigured,
  verifyTotp,
} from "#/lib/auth";

const noStoreHeaders = { "Cache-Control": "no-store" };

const json = (body: Record<string, unknown>, init: ResponseInit = {}) =>
  Response.json(body, {
    ...init,
    headers: { ...noStoreHeaders, ...init.headers },
  });

const requiresAdminSession = (pathname: string) => pathname === "/admin" || pathname.startsWith("/admin/");

const isEmailApi = (pathname: string) => pathname === "/admin/api/emails" || pathname.startsWith("/admin/api/emails/");

const isAgentRoute = (pathname: string) => pathname === "/agents" || pathname.startsWith("/agents/");

const isSameOrigin = (request: Request) => {
  const origin = request.headers.get("Origin");
  return origin !== null && origin === new URL(request.url).origin;
};

const withNoStore = (response: Response) => {
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export default {
  async fetch(request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/admin/auth/status") {
      return (await hasAdminSession(request, env))
        ? new Response(null, { status: 204, headers: noStoreHeaders })
        : new Response(null, { status: 401, headers: noStoreHeaders });
    }

    if (url.pathname === "/admin/auth" && request.method === "POST") {
      if (!isSameOrigin(request)) return json({ error: "Request origin was rejected." }, { status: 403 });
      if (!isAdminAuthConfigured(env)) return json({ error: "Admin authentication is unavailable." }, { status: 503 });

      try {
        const body = (await request.json()) as { code?: unknown };
        if (typeof body.code !== "string" || !(await verifyTotp(body.code, env))) {
          return json({ error: "Invalid authenticator code." }, { status: 401 });
        }

        const session = await createAdminSession(env);
        return json(
          { ok: true },
          {
            headers: { "Set-Cookie": getAdminSessionCookie(session) },
          },
        );
      } catch {
        return json({ error: "Unable to verify the code." }, { status: 400 });
      }
    }

    if (url.pathname === "/admin/auth/logout" && request.method === "POST") {
      if (!isSameOrigin(request)) return json({ error: "Request origin was rejected." }, { status: 403 });
      return json({ ok: true }, { headers: { "Set-Cookie": clearAdminSessionCookie() } });
    }

    if (isEmailApi(url.pathname) || isAgentRoute(url.pathname)) {
      if (!(await hasAdminSession(request, env))) return json({ error: "Admin authentication is required." }, { status: 401 });
      if (request.method !== "GET" && request.method !== "HEAD" && !isSameOrigin(request)) {
        return json({ error: "Request origin was rejected." }, { status: 403 });
      }

      if (isEmailApi(url.pathname)) {
        const response = await handleEmailApi(request, env);
        if (response) return response;
      }

      const response = await routeAgentRequest(request, env);
      if (response) return withNoStore(response);
    }

    if (
      requiresAdminSession(url.pathname) &&
      url.pathname !== "/admin/login" &&
      !(await hasAdminSession(request, env))
    ) {
      return Response.redirect(new URL("/admin/login", url), 302);
    }

    const response = await handler.fetch(request);
    return requiresAdminSession(url.pathname) ? withNoStore(response) : response;
  },
  async email(message, env, ctx) {
    await handleIncomingEmail(message, env, ctx);
  },
} satisfies ExportedHandler<Env> & { email: EmailExportedHandler<Env> };

export { EmailAgent };
