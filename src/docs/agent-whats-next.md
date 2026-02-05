# What's next — agent guidance

Use this file to orient AI agents on current priorities and open tasks.

## Current focus

**Auth & onboarding (PirateSkills Lesson 4.4)** — Continue with Stage 5: Database Setup and RLS.

## Open tasks (track these)

| Task | Location | Notes |
|------|----------|-------|
| Fix onboarding completion loop | `auth-flow-prd.md` → Known issues | After Get Started/Skip, user may loop onboarding ↔ workspace. JWT/metadata timing. |
| Stage 5: Clerk + Supabase RLS | `auth-flow-prd.md` | Database setup, user_id, RLS policies, Supabase client with Clerk token |
| Stage 6: Testing and polish | `auth-flow-prd.md` | Full auth flow testing, error states, mobile |
| Stage 7: Documentation and commit | `auth-flow-prd.md` | Update PRD, commit, Linear |

## Linear

When working on Linear issues, include the issue ID in commit messages (e.g. `fix: onboarding loop. Fixes A-XX`). See `GIT-WORKFLOW.md`.

## Cost estimates

Use **average productivity** for new estimates. See `private/cost-estimate-reference.md` (gitignored).

## Key docs

- `src/docs/auth-flow/auth-flow-prd.md` — Auth implementation plan
- `src/docs/workspace-prd.md` — Workspace feature
- `GIT-WORKFLOW.md` — Branching, commits, PRs
