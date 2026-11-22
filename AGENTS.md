# Agent Instructions

NYPTech is the public website of NYP Technopreneurship, Nanyang Polytechnic's student community for builders turning ideas into ventures. It is a single landing page served from a Cloudflare Worker at `nyptech.club`.

## Stack

TanStack Start with React, Tailwind CSS, and shadcn/ui on Base UI, built with Vite and deployed with the `cf` CLI.

## Commands

- `just setup`: Installs dependencies and generates types.
- `just start`: Starts the local app on port 3000.
- `just check`: Lints, formats, and type-checks.
- `just build`: Builds the Worker and static assets.
- `just deploy`: Builds and deploys the Worker. Pass `environment=production` to use `.env.production`.

## Documents

- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)
