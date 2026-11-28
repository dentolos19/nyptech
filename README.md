<img alt="NYP Technopreneurship" src="banner.png">

---

NYPTech is the public website of NYP Technopreneurship, the student-led entrepreneurship community at Nanyang Polytechnic, at [nyptech.club](https://nyptech.club). It introduces the club to students, showcases startups from its community, and points them to the interest form and its social channels.

The site is a single animated landing page built with TanStack Start and served from a Cloudflare Worker, with its content defined as constants in [`src/routes/index.tsx`](src/routes/index.tsx).

## Features

- **Hero**: A headline with calls to action to register interest or browse the startups.
- **Program Overview**: Workshops, founder conversations, community events, and funding guidance.
- **Who Should Apply**: The student personas the club serves and what applicants do not need.
- **Success Stories**: Short stories from community startups.
- **Startups Showcase**: Community startups with descriptions and links, pinned and animated on wide screens.
- **FAQ**: Common questions in an accordion.
- **Contact**: Email and links to Instagram, LinkedIn, Discord, and Telegram.

## Tech Stack

- [TanStack Start](https://tanstack.com/start/latest) with [React](https://react.dev) for routing and server rendering.
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) with the `cf` CLI for hosting and deployment.
- [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com) with [Tailwind CSS](https://tailwindcss.com) for the interface.
- [Motion](https://motion.dev) and [GSAP](https://gsap.com) for entrance and scroll-driven animations.
- [Bun](https://bun.sh) for packages, linting, formatting, and type checking.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.4 or newer
- [Node.js](https://nodejs.org) 22.23 or newer
- [Just](https://just.systems)

### Setup

1. Run `just setup` to install packages and generate types.

   ```sh
   just setup
   ```

2. Run `just start` and open http://localhost:3000.

   ```sh
   just start
   ```

## Documentation

- [Agent Instructions](AGENTS.md)
- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)

## License

Licensed under the [MIT License](LICENSE).
