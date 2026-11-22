# 0001. Cf CLI and Vite Integration

- Status: Accepted
- Date: 2026-11-01

## Context

The app is a TanStack Start site deployed as a Cloudflare Worker. Its Worker configuration lived in `wrangler.jsonc`.

## Decision

Replace `wrangler.jsonc` with the beta Cloudflare `cf` CLI and Vite integration, configured in [`cloudflare.config.ts`](../../cloudflare.config.ts) with [`src/server.ts`](../../src/server.ts) as the Worker entrypoint. The `cf` CLI and `@cloudflare/vite-plugin` versions are pinned in `package.json`. The change follows [Cloudflare's migration guide](https://developers.cloudflare.com/cf/wrangler/migrate/).

## Consequences

- The CLI and Vite integration are beta.
- Worker types are generated into `.cloudflare/types/index.d.ts` after install, and local state and build output live under `.cloudflare/`.
- Commands are described in the [Cloudflare guide](../guides/cloudflare.md).
