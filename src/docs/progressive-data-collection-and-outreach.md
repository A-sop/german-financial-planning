# Progressive data collection, threshold & outreach

**Purpose:** Capture the model where CRM-style headers are filled gradually via quizzes/widgets (not at login), a threshold gates "make an offer", and you reach out personally when they've given enough—plus security, sales/marketing, and mindset.

**Companion:** See `content-marketing-framework.md` for content pattern, gated calculators, and Datenschutz.

---

## 1. The model

- **CRM-style database** with many possible fields (headers). Only a **subset** are **compulsory** before you can make an offer.
- **Login** stays light: identity (Clerk), maybe name/email. You do **not** ask all compulsory fields at sign-up—that would be unreasonable.
- **Quizzes, widgets, tools** in individual posts/pages are how you collect that information. Each widget captures a **few** CRM fields. Data is saved to the database; the user can retrieve or continue later.
- **Threshold:** A defined **minimum set of compulsory fields** must be present before you can actually make an offer.
- **Outreach:** When they've submitted enough (threshold met) and show interest, you **personally call or reach out** and get their okay—similar to a course/onboarding flow (e.g. Pirate Skills): complete steps → you see they're ready → you contact them.

So: **many headers in DB, few compulsory at once; widgets feed the DB; threshold gates offer + outreach.**

---

## 2. Mapping widgets to CRM headers

- List your **compulsory** fields (e.g. household size, income band, goals, contact preference, phone).
- Design each quiz/widget so it **fills a few** of these (and optionally nice-to-haves). One tool → 2–3 headers; another → 3–4. Over several visits they complete the set.
- In the DB, store by **field/header** (or a schema that matches your CRM), not only as "quiz 3 answers". Then you can check "do I have all compulsory fields?" and reuse data for the offer.

---

## 3. "Pirate Skills"–style journey

- User goes through **steps** (articles + tools/quizzes). Each step adds value (e.g. calculator result) and captures more data.
- **You** see progress (e.g. "compulsory fields 7/10 filled", "completed inflation + Taschengeld tools"). When they cross the threshold and show interest (e.g. requested offer, opened "Angebot anfordern"), you **personally call or reach out** and get their okay.
- Make the "we'll call you" (or "we'll prepare an offer") expectation clear in the UI and in Datenschutz: **consent for contact** (phone/email) and **purpose** (offer/preparation) must be explicit and stored.

---

## 4. Security (top-notch)

- **Auth:** Clerk (or equivalent) for sign-in only; no storing passwords yourself. Google + Email as minimum.
- **API/DB:** All writes to "my data" (profile, household, quiz results) must be **authenticated** (session/user_id) and **authorised** (this user can only write to their own record). Use Server Actions or API routes that check `user_id` and never trust client-supplied user ids.
- **Data in transit:** HTTPS only. If you use Supabase, use its client with RLS so the browser only talks to Supabase with a user-scoped token (e.g. JWT from Clerk passed to Supabase).
- **Data at rest:** Supabase (or your backend) holds PII; restrict access (roles, RLS). No sensitive data in client-side storage except what's strictly needed (e.g. session).
- **Consent and audit:** Store consent (what, when) and key events (e.g. "threshold reached", "outreach approved") so you can prove compliance and handle erasure/portability.
- **Input validation:** Validate and sanitise all widget/quiz inputs (Zod, allowlists). Never eval or inject; use parameterised queries / ORM.

This gives you a solid base; you can add pen-testing or a security checklist later when you go live.

---

## 5. Sales and marketing perspective

- **Progressive disclosure is the right idea.** Asking 20 compulsory fields at sign-up would kill conversion. Let content and tools do the work; each widget is a small commitment and delivers value (result, tip, next step).
- **Threshold = qualification.** You only invest in "offer + call" when the lead has given enough to be useful. That's efficient and respectful of their time.
- **Outreach with permission.** Reaching out when they've crossed the threshold is logical—they've signalled interest by completing steps. Always tie outreach to consent (e.g. "Darf ich Sie anrufen?") and record it.
- **One caveat:** If widgets feel like a long form broken into 10 pages, some users may bounce. Keep each step **short and valuable** (one calculator, one short quiz). Optional "save and continue later" and a simple "your progress" view help.

So from a sales/marketing angle: you're **not** overthinking it; the structure (content → widgets → DB → threshold → offer/outreach) is sound.

---

## 6. Mindset: right approach or overthinking?

- **Right approach:** You're thinking in terms of **user journey** (steps, value, then ask), **minimum necessary data** (compulsory set, not everything at once), and **clear trigger** (threshold → offer/outreach). That's coherent.
- **Where it can feel like "overthinking":** The CRM has "loads" of headers; it's tempting to want every widget to map to many of them. Resist. For the **first** version, define a **small** compulsory set (e.g. 5–8 fields) and 2–3 widgets that cover them. Add more widgets and optional fields later. Ship the funnel first, then expand the schema.
- **Practical mindset:** "I need enough to make an offer and to reach out with their okay." That's two clear goals. Design the threshold and consent for those. The rest (extra CRM headers, more quizzes) is iteration. You're thinking in the right direction; just don't let the size of the full CRM block you from shipping a minimal, secure, compliant flow.
