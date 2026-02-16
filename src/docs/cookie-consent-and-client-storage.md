# Cookie consent tool & optional client-side storage

**Purpose:** Plan a cookie consent solution that (1) discovers what cookies the site sets, (2) produces a cookie declaration, (3) lets users opt in/out by category (essential, marketing, etc.), and (4) optionally lets logged-in users store sensitive data on their own device instead of your server. Also: security and branding benefits of holding less data.

**Context:** GFP uses Google Tag Manager (GTM) in `layout.tsx`. Legal/Datenschutz already mention GTM and cookies; no consent banner or declaration yet. EU/GDPR and ePrivacy expect consent for non-essential cookies and clear information.

---

## Start with the free option (expand later)

**Goal:** Cheapest, preferably **free**, to begin with. Prepare for growth (e.g. more traffic or stricter requirements) without overbuilding now.

| Phase | Approach | Cost |
|-------|----------|------|
| **Now** | **Manual declaration** + **custom or free open-source consent banner**. You maintain a static cookie table (GTM, Clerk when added, etc.) and a small banner component that stores preference and gates GTM. No paid CMP, no scanner. | **Free** (your time only). |
| **Later** | If traffic or compliance needs grow: add a **CMP with scanner** (Cookiebot, Osano, etc.) for auto-discovery and maintained declaration, or a **periodic scan** plus the same banner. | Paid CMP when you need it. |

The rest of this doc describes what to build in the free phase and how it scales. All of this is **documented here in markdown** so we don’t forget it later; see also **`src/docs/README.md`** for an index of planning docs.

---

## 1. What the cookie tool should do

| Requirement | Description |
|-------------|-------------|
| **Discover cookies** | Identify which cookies (and similar tech, e.g. localStorage) the site sets—first-party and from third-party scripts (GTM, GA, Clerk, etc.). |
| **Cookie declaration** | A page or section (often linked from footer/Datenschutz) listing: name, provider, purpose, expiry, type (essential / functional / marketing). |
| **Consent UI** | Banner or modal on first visit: choices such as "Accept all", "Essential only", "Customise" (e.g. turn marketing on/off). |
| **Respect choice** | Don’t set non-essential cookies (or don’t load scripts that set them) until the user has consented. Persist the user’s choice (e.g. in a cookie or localStorage). |
| **Change mind** | Link in footer ("Cookie-Einstellungen" / "Cookie preferences") to reopen and change preferences (e.g. reduce to essential only). |

---

## 2. How to “figure out” what cookies exist (discovery)

Cookies can come from your domain (first-party) or from third-party scripts (GTM, GA, Clerk, Supabase, etc.). Options:

### Option A: Use a CMP that scans (easiest for “scrape and declare”)

- **Cookiebot**, **OneTrust**, **Osano**, **CookieYes**, **Consent Manager** (e.g. from Usercentrics/Quantcast) and similar tools:
  - Run a **scan** of your site (crawl + often a known database of third-party cookies).
  - Generate a **cookie report** and a **declaration page** (or embeddable list).
  - Provide a **consent banner** and script to gate tags (e.g. GTM) by category.
- **Pros:** Declaration stays up to date when you add new tools; less manual work. **Cons:** Cost; dependency on vendor; you still need to wire GTM (and others) to fire only after consent.

### Option B: Manual declaration + consent banner (no scraper)

- You **declare** what you use: e.g. “We use Google Tag Manager; it may set cookies X, Y, Z (see [Google’s list](https://...) ). We use Clerk for sign-in (session cookie).”
- You maintain a **static table** (e.g. in Datenschutz or a dedicated “Cookie-Übersicht” page): cookie name, provider, purpose, expiry, type.
- You add a **consent banner** (custom or a small library) that stores preference (essential / marketing / etc.) and only then loads GTM (or triggers GTM consent mode).
- **Pros:** Full control; no recurring CMP cost. **Cons:** You must update the list when you add/remove scripts.

### Option C: One-off or periodic scan (build or use a scanner)

- **Scan:** Use a tool that loads your site (e.g. headless browser or a service like CookieMetrix, or a script that visits key pages and records `document.cookie` and known third-party script URLs). Result: list of cookie names, domains, maybe expiry.
- **Then:** You (or a script) map those to purposes and categories and feed a **declaration**. Consent UI still needed separately.
- **Pros:** Discovers what’s actually set. **Cons:** Scan doesn’t know “purpose” or “marketing” by itself; you still classify. Third-party cookies often need a known database (GTM/GA cookie lists) unless you only record what you see in one run.

**Practical recommendation for GFP:** Start with **Option B** (free): document GTM (and any GA/other tags inside GTM), Clerk (when you add it), and Supabase client if it sets storage. Create a static cookie table and a consent banner that gates GTM (or uses GTM Consent Mode v2). If you later want auto-discovery or higher traffic, add a CMP with scanning (Option A) or a periodic scan (Option C) and merge results into your declaration.

---

## 3. Consent categories and “reduce cookies”

Typical categories:

| Category | Purpose | Examples | Consent needed (EU) |
|----------|---------|----------|----------------------|
| **Essential** | Strictly necessary (auth, security, load balancing, consent storage). | Session cookie, Clerk session, cookie preference cookie. | No (legitimate interest or necessity). |
| **Functional** | Preferences, language, UX. | Language choice, “remember me”. | Often yes (consent). |
| **Marketing / Analytics** | Ads, retargeting, analytics. | GA, GTM tags for ads/analytics. | Yes. |

Your UI can offer:

- **Accept all** – set essential + functional + marketing.
- **Essential only** – no GTM (or GTM in consent-only mode so no marketing tags run); no non-essential cookies.
- **Customise** – toggles per category (e.g. “Marketing cookies: On / Off”).

Store the choice in a **cookie** (e.g. `cookie_preferences`) or **localStorage** (key `cookie_consent`), and **don’t load GTM** (or don’t fire marketing tags) until the user has accepted marketing/analytics. That way you actually “reduce” cookies when they choose “essential only”.

**Implementation note:** In Next.js you can load the GTM script only after consent (e.g. from a client component that reads consent state and then injects the GTM script). Alternatively use [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent) and keep GTM on the page but let it respect `gtag('consent', ...)` so tags don’t fire until consent.

---

## 4. Cookie declaration content

The declaration (in Datenschutz or a dedicated page) should list at least:

- **Cookie (or storage) name**
- **Provider** (e.g. Google, Clerk, You)
- **Purpose** (short, plain language)
- **Expiry** (session / 1 year / etc.)
- **Type** (essential / functional / marketing)

You can add a column “Legal basis” (e.g. consent, legitimate interest) if you want to be explicit. Keep the table in sync with what you actually use (GTM, Clerk, Supabase, any analytics).

---

## 5. Storing sensitive data on the user’s device (optional)

**Idea:** For logged-in users, offer an option to keep **sensitive or draft data only on their device** (e.g. localStorage or IndexedDB) instead of on your server. When they’re ready (e.g. “Request offer”), they submit and you then store what’s needed for the offer.

**Benefits:**

- **Security:** You hold less PII. If your DB is breached, data that never left the device isn’t there.
- **Branding / trust:** “We don’t store your household details on our servers until you ask for an offer” is a clear, positive message and reduces the “they have all my data” complaint surface.
- **Compliance:** Less data on your side can mean fewer retention and deletion obligations for that subset.

**Trade-offs:**

- User clears site data or uses another device → draft/local data is gone unless you offer export/import.
- You can’t “see” their progress for outreach until they submit; so use this for **drafts / preferences** and still require a minimal server-side step (e.g. “Request call” or “Send my data for offer”) that sends only what’s needed.
- Implementation: store household draft, quiz answers, or preferences in **localStorage** or **IndexedDB** keyed by user id; only write to your DB when they explicitly “submit for offer” or “save to my account” (and consent).

**How to offer it:**

- In settings or after login: **“Store my draft data only on this device (we don’t save it to our servers until I request an offer).”** If they opt in, your app writes drafts to local storage only; when they click “Angebot anfordern” or “Save to my account”, you send the data to the server and store it with consent.
- Mention in **Datenschutz**: “Sie können wählen, dass Entwürfe und Vorlieben nur auf Ihrem Gerät gespeichert werden, bis Sie ein Angebot anfordern.”

---

## 6. Datenschutz updates

- Add a **Cookie / Cookie-Übersicht** section (or link to a cookie declaration page) and state that you use a consent tool and which categories exist (essential, functional, marketing).
- Explain **how** users can change preferences (link to “Cookie-Einstellungen”).
- If you offer **client-only storage** for drafts: state that data can be stored locally until the user requests an offer or saves to account, and that you don’t receive that data until then.

---

## 7. Free implementation options (no paid CMP)

- **Custom banner:** A small React client component that shows on first visit, stores preference in `localStorage` (e.g. `cookie_consent`), and conditionally loads GTM only when marketing/analytics is accepted. No third-party dependency; you own the copy and styling. Scales to any traffic.
- **Free open-source libraries:** e.g. `react-cookie-consent`, `vanilla-cookieconsent`, or similar (check current licence). You still maintain the declaration yourself; the library gives you the UI and storage. Suited to low/medium traffic.
- **GTM loading:** Either (1) don't render the GTM `<Script>` in `layout.tsx` until a client component has read consent and decided to load it, or (2) keep GTM on the page and use [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent) so tags don't fire until consent. Both are free.

**When to expand:** If you add many third-party scripts, need auto-updated declarations, or want a vendor to handle scans and updates, consider a paid CMP (Cookiebot, Osano, etc.) later. The free setup prepares for that: same consent categories and "Cookie-Einstellungen" link; you'd swap the banner for the CMP widget.

---

## 8. Summary

| Item | Action |
|------|--------|
| **Cost** | Start **free**: manual declaration + custom or free library banner; expand to paid CMP when needed. |
| **Discovery** | Start with manual declaration (GTM, Clerk, Supabase, etc.); optionally add a CMP with scanner or a periodic scan later. |
| **Declaration** | One page or section with a table: name, provider, purpose, expiry, type. |
| **Consent UI** | Banner on first visit + “Cookie-Einstellungen” link; options: Accept all / Essential only / Customise. |
| **Respect choice** | Don’t load GTM (or use Consent Mode) until marketing/analytics accepted; persist preference in cookie or localStorage. |
| **Reduce cookies** | “Essential only” = no marketing/analytics scripts; “Customise” = let user turn marketing on/off. |
| **Sensitive data on device** | Optional: let logged-in users choose “store draft data only on this device until I request an offer”; document in Datenschutz; good for security and branding. |

When you’re ready to implement, next steps are: (1) add the consent banner component and wire GTM to consent, and (2) add the cookie declaration table (and optional client-storage option) to the legal/Datenschutz flow.
