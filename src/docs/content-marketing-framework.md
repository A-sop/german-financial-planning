# Content marketing framework & gated tools (calculators)

**Purpose:** Extract a reusable pattern from the canonical Finanztipps, then outline gated calculators (Clerk sign-up), Datenschutz, and household/offer data flow.

---

## 1. Pattern in the canonical blog posts

From a sample of posts (Taschengeld, Versicherungskennzeichen, Inflation), the structure is **consistent and reusable**:

| Element | What it does |
|--------|----------------|
| **Dieser Artikel in Kürze** | 2–4 bullet takeaways at the top. Reader gets value fast; SEO snippet. |
| **Intro** | One short paragraph: the problem or question (“Wie viel Taschengeld?”, “Was ist Inflation?”). |
| **Sections (H2)** | 3–6 sections. Each has a clear question or theme. Mix of explanation and concrete numbers. |
| **Data / tables / FAQs** | Where it fits: tables (e.g. Taschengeld by age), cost ranges, FAQ block at the end. Builds authority and “widget potential”. |
| **CTA blocks (repeated)** | “Ihr Finanzcoach” + “Jetzt Termin vereinbaren” (or “Jetzt Beratung finden”) every few sections. Same CTA, not random. |
| **Das könnte Sie auch interessieren** | 3 related articles + product links. Keeps people on site and surfaces next step. |
| **Footer** | Contact details, “Weiterempfehlen”. |

**Winning formula (reusable for GFP):**

1. **Key takeaways** (3–5 bullets) at the top.
2. **Intro** that states the reader’s question or problem.
3. **Sections** with H2s; include numbers, tables, or a short FAQ where it helps.
4. **One primary CTA** repeated 2–3 times (e.g. “Book a call” / “Termin vereinbaren”).
5. **Related content** at the end.
6. **Optional:** One “tool” per article (calculator or checklist) that naturally fits the topic—then gate it (see below).

So it’s **not random**: same skeleton, different topics. You can use this as the default template for GFP authority posts.

---

## 2. Calculator / widget opportunities (examples)

Several posts map cleanly to a small tool:

| Article theme | Widget idea | Why it fits |
|---------------|-------------|-------------|
| Taschengeld | **Taschengeld-Rechner** (age → recommended amount, weekly/monthly) | Article already has the table; calculator makes it personal. |
| Versicherungskennzeichen | **“Brauche ich ein Kennzeichen?”** (vehicle type → yes/no + cost range) | Reduces confusion; natural CTA: “Kfz-Versicherung abschließen”. |
| Inflation | **Inflations-Check** (Betrag + Laufzeit + Inflationsrate → Kaufkraft in X Jahren) | Article talks about protecting savings; number makes it tangible. |
| Altersvorsorge / Rente | **Rentenlücke oder Sparrate** (Alter, gewünschte Rente, Laufzeit → grobe Sparrate) | Classic lead magnet for financial planning. |
| Bausparen / Kredit | **Monatsrate oder Tilgungsdauer** (Darlehen, Zins, Laufzeit → Rate) | Standard calculator; high intent. |

**Recommendation:** Start with 1–2 (e.g. Taschengeld + Inflation). Put them behind sign-up. Use results as a hook for “Wir besprechen Ihre Zahlen gerne im Gespräch” (CTA).

---

## 3. Gated calculators: Clerk + sign-up wall

**Idea:** User hits “Rechner nutzen” → must sign up (Clerk) → then can use the calculator. You get a known user and (with consent) can store inputs for follow-up.

### 3.1 “Only Google” – problems if they don’t have Google

- Many people **don’t use Google** or don’t want to link a financial site to Google.
- Some have only work email (no Google), or use Apple/Outlook.
- **Best practice:** Offer **at least two** sign-in options:
  - **Sign in with Google** (fast, low friction).
  - **Email** (magic link or password via Clerk). No Google required.

Clerk supports both. Adding “Continue with Email” (or “Magic link”) avoids losing leads who don’t have or don’t want to use Google.

### 3.2 What to implement

- **Clerk:** Sign-up/sign-in (Google + Email as minimum).
- **Route guard:** e.g. `/tools/taschengeld` shows “Sign in to use this tool” unless the user is signed in; after sign-in, show calculator.
- **No account:** You can still show a “demo” or read-only version without sign-up if you want (e.g. table only), and gate the “save / get personal recommendation” behind sign-up.

---

## 4. Database, permission (Datenschutz), household & offer

You want to: **store data** (with consent), **set up a household**, and **make an offer**. That touches GDPR/Datenschutz and (for financial advice) compliance.

### 4.1 Datenschutz (GDPR) – what to cover

- **Purpose:** Describe clearly: “Wir speichern Ihre Angaben, um Ihren Haushalt zu erfassen und Ihnen ein passendes Angebot zu erstellen. Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung.”
- **Legal basis:** For “household + offer” after sign-up, **consent (Art. 6(1)(a) DSGVO)** is appropriate. If they explicitly request an offer, **contract/pre-contract (Art. 6(1)(b))** can apply; state which you use.
- **What you collect:** List exactly: e.g. name, email, phone, calculator inputs (optional), household data (number of persons, income, goals). “Minimale Daten für Haushalt und Angebot.”
- **How long:** Define retention (e.g. “bis zum Widerruf” or “X Jahre nach letztem Kontakt”). Right to deletion (Art. 17) and other rights (access, rectification, portability) must be stated and implemented.
- **No selling:** Explicit: “Wir verkaufen Ihre Daten nicht.”
- **Clerk / Supabase:** Mention in Datenschutz: “Anmeldung über Clerk; Daten in [Clerk / Supabase].” If Supabase (or your backend) stores household/offer data, that’s “Verantwortlicher” or “Auftragsverarbeiter” – document it.

**Concrete:** Extend the existing Datenschutz section on the Legal page (and any separate Datenschutzerklärung) with a subsection, e.g. “Registrierung und Nutzerkonto / Tools” and “Daten für Haushaltsanalyse und Angebot”, including purpose, legal basis, and rights.

### 4.2 Database design (high level)

- **Users:** Clerk gives you `user_id` (and email/name from OAuth or email sign-up). Store in your DB only what you need (e.g. `user_id`, email, name, consent flags, created_at).
- **Consent:** Store **what** they agreed to and **when** (e.g. “Datenschutz + Nutzung für Haushalt/Angebot am DD.MM.YYYY”). Required for proof under GDPR.
- **Household:** Table(s) for “household” (e.g. household_id, user_id, number of adults/children, income band, goals, notes). Link to user.
- **Calculator runs (optional):** If you want to reuse inputs for the offer: e.g. `calculator_runs` (user_id, tool_slug, inputs JSON, created_at). Only if covered by consent and Datenschutz.
- **Offers:** Your “Angebot” (e.g. offer_id, user_id/household_id, status, summary). Keeps the pipeline clear.

### 4.3 Possible issues to watch

| Topic | Risk | Mitigation |
|-------|------|------------|
| **Only Google** | Users without Google can’t sign up | Add Email (magic link or password) in Clerk. |
| **Consent** | Using data without clear consent | Checkbox(es) at sign-up or before first save: “Ich willige ein, dass … für Haushaltsanalyse und Angebot genutzt werden.” Link to Datenschutz. Store consent + timestamp. |
| **Scope creep** | Collecting more than needed | Only ask for what you need for “household + offer”. Document in Datenschutz. |
| **Regulatory** | Financial advice rules (Honorar-/Provisionsberatung) | Documenting advice and data handling may be required. Out of scope here; treat as separate compliance layer. |

---

## 5. Summary

- **Content:** Use the same structure as the canonical posts (key takeaways → intro → sections + data/FAQ → repeated CTA → related). Add one clear CTA and, where it fits, one calculator idea per article.
- **Calculators:** Gate 1–2 tools behind sign-up. Don’t rely on “Google only”—add Email sign-in in Clerk.
- **Database + Datenschutz:** Extend Datenschutz for “registration, tools, household, offer”; use consent (and optionally contract) and minimal data; store consent + timestamp; design DB for user → household → offer and optionally calculator runs.
- **Household & offer:** Design tables and flows so you have enough information to set up a household and make an offer, without collecting more than declared in the privacy policy.

If you want, next step can be: (1) a short “content template” (markdown outline) for new posts, or (2) a small technical spec for “gated calculator + Clerk + consent + household table” for one tool (e.g. Taschengeld). See also **`progressive-data-collection-and-outreach.md`** for progressive data collection (quizzes → DB, threshold, outreach), security, sales/marketing, and mindset.
