import { defineConfig } from "cf/config";

import * as entrypoint from "./src/server.ts" with { type: "cf-worker" };

export default defineConfig({
  worker: {
    name: "nyptech",
    compatibilityDate: "2026-10-01",
    entrypoint,
    observability: {
      logs: {
        enabled: true,
      },
      traces: {
        enabled: true,
      },
      issues: {
        enabled: true,
      },
    },
    domains: ["nyptech.club"],
  },
});
