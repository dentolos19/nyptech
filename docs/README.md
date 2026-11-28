# Documentation Guidelines

Write documentation for the next agent or engineer. Keep each file short, factual, and current. Link to code instead of duplicating it.

## Writing Style

- Use American English.
- Use Title Case for headings and short phrases, such as link text and table headers.
- End full sentences with periods, including in bullets. Leave fragments, such as link lists and prerequisites, without periods.
- Use bold sparingly for key terms, with punctuation outside the markers: `**Key Term**: Content`.

## Root Files

- [`README.md`](../README.md): The public overview for humans, with the banner, features, tech stack, and setup. Links to the other documents instead of repeating them.
- [`AGENTS.md`](../AGENTS.md): The index. Holds general instructions, commands, and links to the other documents. Read first, so keep it brief. If `CLAUDE.md` is needed, it only contains `@AGENTS.md`.
- [`PRODUCT.md`](../PRODUCT.md): What is being built and why. Covers the purpose, users, core features, and scope, including what is out of scope.
- [`DESIGN.md`](../DESIGN.md): How it should look and feel. Covers the design system, tokens, components, and UI framework rules.

## Documentation Folder

```text
docs/
|-- README.md
|-- decisions/
|   `-- 0001-<title>.md
|-- guides/
|   `-- <topic>.md
`-- plans/
    `-- <yyyy-mm-dd>-<title>.md
```

- `README.md`: These guidelines. Keep them in sync when the conventions change.
- `decisions/`: Architecture decision records. One decision per file, numbered in order with kebab-case titles.
- `guides/`: How-to documents for recurring tasks, such as deployment and runbooks. Title each with a Title Case `#` heading. Do not repeat the setup steps in the root `README.md`.
- `plans/`: Specs and plans for work in progress. Delete when the work lands; record any lasting choice as a decision.

## Decisions

- Record a decision when choosing between options, adding or removing a dependency or service, changing architecture, data, or APIs, or deviating from these guidelines.
- Do not rewrite accepted decisions. Supersede them with a new record and update the old status to `Superseded by 0007`.
- Use the template below.

```markdown
# 0001. <Title>

- Status: Proposed | Accepted | Superseded by 0000
- Date: <yyyy-mm-dd>

## Context

The problem and constraints.

## Decision

What was chosen and the alternatives considered.

## Consequences

Trade-offs and follow-up work.
```

## Rules

- Put each document in one place only. Product goes in `PRODUCT.md`, design in `DESIGN.md`, decisions in `docs/decisions/`, how-tos in `docs/guides/`, and everything else is linked from `AGENTS.md`.
- Update the relevant document in the same change as the code it describes.
