# Cloudflare Development

The app uses the beta Cloudflare CLI and Vite integration with [`cloudflare.config.ts`](../../cloudflare.config.ts) (see [0001](../decisions/0001-cf-cli-and-vite-integration.md)). Install dependencies with Bun and use Node.js for the CLI. The generated types are in `.cloudflare/types/index.d.ts`; local Cloudflare state and build output also live under `.cloudflare/` and are ignored by Git.

## Commands

| Command                              | Action                                                       |
| ------------------------------------ | ------------------------------------------------------------ |
| `bun run types`                      | Regenerate the Worker types and the route tree.              |
| `bun run deploy --dry-run`           | Build and package the Worker without uploading.              |
| `just deploy`                        | Build and deploy the Worker.                                 |
| `just environment=production deploy` | Use `.env.production` for the build and deployment commands. |

## Environment

Just uses `.env` by default and `.env.<environment>` when `environment` is set. Values in the selected file override inherited variables. This selects configuration values, not a different Worker or domain. Cloudflare account and API credentials are supplied through the process environment or the workflow's top-level `env` in GitHub Actions.

The app reads no environment variables, so deployment does not upload a secrets file (see [0002](../decisions/0002-deploy-without-secrets-file.md)). The CLI and Vite integration are beta. See [Cloudflare's migration guide](https://developers.cloudflare.com/cf/wrangler/migrate/).
