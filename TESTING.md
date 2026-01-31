# Testing Guide — Server Actions + UI

## Flows covered

1. **Early Access** — home page, `submitEarlyAccess` action
2. **OpenAI API Test** — `/workspace`, `testOpenAI` action (bottom of page)

---

## Manual checks

### Early Access

1. **Loading state**
   - Go to `/`, scroll to "Request Early Access"
   - Enter valid email (e.g. `test@example.com`)
   - Click "Notify Me When Available"
   - ✓ Button shows "Submitting…" and is disabled while pending
   - ✓ Input is disabled during submit

2. **Success state**
   - After ~500ms, success message appears (green text)
   - ✓ Message includes your email and "Workspace is available" (EN) or equivalent (DE)
   - ✓ No page reload

3. **Error state**
   - Enter invalid email (e.g. `invalid` or empty)
   - Click submit
   - ✓ Error message appears in red (e.g. "Please enter a valid email address")
   - ✓ Form stays filled so user can correct

4. **i18n**
   - Toggle language to DE (top-right)
   - ✓ Labels, button, messages in German
   - ✓ Submit with valid email → German success message

## Network & console

- **Network:** No XHR/fetch — Server Action uses `POST` with `FormData`. Look for `POST` to current page.
- **Console:** No errors. No duplicate submissions.
- **FormData:** `email` and `locale` are sent.

## Run tests (after `npm install`)

```bash
npm run test
```

- `src/lib/validation.test.ts` — `validateEmail` unit tests
- `src/components/early-access-form.test.tsx` — Early Access form: render, loading, success, error
- `src/lib/openai.test.ts` — `testOpenAIConnection`: no key, success, API error, network error
- `src/app/workspace/api-test-card.test.tsx` — ApiTestCard: render, loading, success, error

## Performance

- **Early Access:** `disabled={isPending}` prevents double submit; uncontrolled email input (no re-renders on keystroke)
- **OpenAI Test:** `disabled={status === "loading"}` prevents double-click; single request per click
