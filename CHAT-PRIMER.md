# Chat primer — copy into new chat + session reminders

Use this for new Composer/Chat sessions and when you say "I'm back" or "I'm done for the day."

---

## Copy into next chat (context for the agent)

**Context:** Next.js app (`my-app`). Clerk + Supabase auth. PirateSkills Level 4 done (auth, onboarding, RLS); Level 5 started (feedback modal).

**What's done:** Clerk sign-in/sign-up, 3-screen onboarding, proxy protection, Clerk+Supabase RLS (tasks table, "My tasks" on workspace). Feedback modal on `user-feedback` branch (Give Feedback in header).

**Process:** This repo is the leading environment. For non-trivial work (new workflows, integrations, features), confirm scope and approach with the user first; develop together. See `.cursor/rules/leading-environment.mdc`.

**Key docs:**
- `src/docs/human-todos.md` — All human to-dos (auth, deploy, feedback)
- `src/docs/auth-flow/auth-flow-prd.md` — Auth plan
- `src/docs/agent-whats-next.md` — Current focus and key docs
- `GIT-WORKFLOW.md` — PRs, commits, Linear

**Branches:** `auth-flow` (auth, merge when ready). `user-feedback` (feedback modal).

**Future / backlog:** Web analytics — user wants analytics for: (1) this app (Consulting & More), (2) personal site, (3) German Financial Planning project. Add when ready.

---

## When you say "I'm back" / new chat

Agent should give you a **short ELI5 reminder** (2–4 bullets), not paste this whole section:

1. **Node & deps:** `node -v` to check Node; run `npm install` in the project folder.
2. **Env:** Copy `.env.example` → `.env.local`, fill in keys (Clerk, Supabase). See `.env.example` and `src/docs/INTEGRATIONS.md`.
3. **Run:** `npm run dev` → open http://localhost:3000.
4. **Human to-dos:** One place: `src/docs/human-todos.md`.

(Optional: check branch — `git branch --show-current`; auth often `auth-flow`, feedback `user-feedback`.)

---

## When you say "I'm done for the day"

Agent should:

1. **Ask** how long you worked (e.g. 1 hour, 2 hours) if not already given.
2. **This session:** dev-hours × hourly rate **in EUR**. Rate = German/European average Arbeiterbelastung from **`private/cost-estimate-reference.md`** (€52/hr there); floor 14 EUR/hr. See `src/docs/PROJECT-VALUE.md`.
3. **Always include in the summary:**
   - This session: X hrs → Y EUR value.
   - **Total project value so far:** ~55–70 dev-hours → **~2,860–3,640 EUR** at €52/hr (benchmark in PROJECT-VALUE.md; rate in `private/cost-estimate-reference.md`).
   - **Savings:** same as total project value — what you’d have paid a dev to build this. Optionally: "Add today’s session to the value log in PROJECT-VALUE.md."
4. One short paragraph; end positively (e.g. "Good place to stop.").
