# Agent Instructions

NYPTech is the public website of NYP Technopreneurship, Nanyang Polytechnic's student community for builders turning ideas into ventures. It is a single landing page served from a Cloudflare Worker at `nyptech.club`.

## Commands

- `just setup`: Install dependencies and generate types.
- `just install`: Install dependencies from the frozen lockfile and generate types.
- `just start`: Start the development server on port 3000.
- `just build`: Build the Worker and static assets.
- `just check`: Lint, format, and type check.
- `just deploy`: Build and deploy the Worker. Set `environment=production` to use `.env.production`.

## Stack

TanStack Start with React 19 on Cloudflare Workers through the `cf` CLI, with shadcn/ui on Base UI, Tailwind CSS 4, Motion, GSAP, and Bun.

## Rules

- When the app first reads an environment variable, restore the standard secrets-file deployment and supersede [0002](docs/decisions/0002-deploy-without-secrets-file.md).

## Documentation

- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)
