# Integrations & API Keys

**Purpose:** Central reference for external services and secure key storage.  
**Audience:** Developers and AI agents working on this project.

---

## Where to store secrets

| Location                                          | Use                                         | Committed?             |
| ------------------------------------------------- | ------------------------------------------- | ---------------------- |
| `.env.local`                                      | Local development keys                      | **No** (in .gitignore) |
| `.env.example`                                    | Template showing variable names (no values) | **Yes**                |
| Vercel → Project Settings → Environment Variables | Production/Preview keys                     | N/A                    |

**Rule:** Never commit real API keys. Reference them server-side only:

```ts
const apiKey = process.env.OPENAI_API_KEY;
```

---

## Setup for new integrations

1. Add the variable name to `.env.example` (no value).
2. Add your real key to `.env.local` locally.
3. Add the same variable in Vercel → Environment Variables for deploy.
4. Use it only in server code (Server Actions, API routes, server components).
5. Document the integration below.

---

## Current integrations

### OpenAI

- **Used for:** LLM drafting, document extraction, Whisper (voice-to-text).
- **Env key:** `OPENAI_API_KEY`
- **Where used:** `src/lib/openai.ts` (server-only)
- **Test:** Workspace → "Test API" section (dev)

---

## Validation & Security

- **Zod** schemas at `src/lib/schemas/` — validate all form inputs (email, locale) on client and server
- **Early access:** `earlyAccessSchema` enforces trim, min/max length (254), email format, allowed locales (en, de)
- **Outputs:** No `dangerouslySetInnerHTML`; user content rendered as text (React escapes)
- **Errors:** Validation failures return i18n keys; unexpected errors logged server-side only, generic message to user

## Current integrations (continued)

### Supabase

- **Used for:** Document Intake persistence (uploads, task_suggestions). Pre-login session storage.
- **Env keys:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Where used:** `src/lib/supabase-server.ts` (server-only), `src/app/workspace/supabase-actions.ts`
- **Test:** Workspace → Developer tools → "Test Supabase"

---

## Planned (not yet wired)
- n8n (workflows)
- WhatsApp (Twilio)
- Slack
- Resend (email)

---

## File map for AI agents

```
.env.example              — Template: which env vars exist (no secrets)
.env.local                — Your actual keys (never commit; create from .env.example)
src/docs/INTEGRATIONS.md  — This file: setup guide and integration list
src/lib/openai.ts         — OpenAI client (server-only)
src/app/workspace/actions.ts — testOpenAI() server action
src/app/workspace/api-test-card.tsx — UI to trigger API test (Workspace page, bottom)
```
