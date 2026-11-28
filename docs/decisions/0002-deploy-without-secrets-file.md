# 0002. Deploy Without Secrets File

- Status: Accepted
- Date: 2026-11-28

## Context

The conventions have `just deploy` check that the selected dotenv file exists and pass it to `cf deploy --secrets-file`, with GitHub Actions writing that file through `SpicyPizza/create-envfile`. This app reads no environment variables, so `.env.template` declares no keys. A dry run of `cf deploy --prebuilt --secrets-file` rejects an empty or comment-only dotenv file as not valid, so the standard recipe would fail on every deployment.

## Decision

Keep `just deploy` as `bun run deploy --prebuilt`, with no `test -f` check or `--secrets-file`, and keep the deployment workflow without a `Download Secrets` step. Alternatives considered were adding a placeholder variable, which would upload a meaningless Worker secret, and only passing the file when it declares keys, which adds shell logic for a case that does not exist yet.

## Consequences

- Deployments never upload Worker secrets.
- When the app first reads an environment variable, add it to `.env.template`, restore the standard `deploy` recipe and the workflow's `Download Secrets` step, and supersede this decision.
