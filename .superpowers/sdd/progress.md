# Progress: Startups Vertical Showcase

Plan: docs/superpowers/plans/2026-06-21-startups-vertical-showcase.md
Baseline (BASE for Task 1): 08da02b2278ada341727090ad39c69f3c689a9a9

- Task 1: complete (commits 08da02b..929e601, review clean). Build gate skipped (env: Node 22.14 lacks registerHooks). Out-of-scope WIP fixes in scroll-area.tsx & accordion.tsx KEPT per user.
- Task 2: complete (commits 929e601..8a8e6b8, review clean; StartupText confirmed still used by StackedStartups, not orphaned).
- Task 3: complete (commits 8a8e6b8..142472f, review clean). All 3 tasks done.
Task 2 BASE: 929e601
Task 3 BASE: 8a8e6b8
Final review BASE: 08da02b (feature start)

## Final review (08da02b..142472f): "With fixes"
- IMPORTANT 1: fontWeight animated per-frame -> reflow jitter. FIX: drop fontWeight from gsap.set; bold active via className.
- IMPORTANT 2: jumpTo uses stale triggerRef snapshot after resize. FIX: hold live ScrollTrigger instance, read start/end at click time.
- MINOR 3 (last-item emphasis never hits t=1) and MINOR 4 (hand-narrowed onUpdate type): non-blocking, flagged for user's visual pass.
- Dispatching ONE fix subagent for IMPORTANT 1 + 2.

## Fix wave applied: commit 32fc325 (lint+tsc clean, diff verified by controller)
- IMPORTANT 1 resolved: fontWeight dropped from gsap.set; active bolds via className.
- IMPORTANT 2 resolved: triggerRef now holds live ScrollTrigger instance; jumpTo reads live start/end.
FEATURE COMPLETE. Pending: user visual verification (app cannot build/run here due to Node 22.14 env).
