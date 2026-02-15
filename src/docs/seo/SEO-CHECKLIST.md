# SEO Checklist — German Financial Planning

Technical and on-page SEO. Tick as implemented.

---

## Technical

- [x] `robots.ts` — allow `/`, disallow `/workspace/`, `/api/`, `/private/`; sitemap URL
- [x] `sitemap.ts` — homepage, insights index, pillar pages, /book, /careers, per-post URLs
- [x] Root `metadata` — title template, default description, `metadataBase`, Open Graph base
- [x] Per-route `generateMetadata` — insights [slug]; book, careers, work-with-me, legal have metadata
- [x] Canonical URLs — via `metadataBase` (NEXT_PUBLIC_SITE_URL); absolute, consistent
- [x] `lang` attribute on `<html>` — set by LocaleProvider (`de` / `en`) for bilingual
- [x] Schema: Person (layout — site-wide)
- [x] Schema: BlogPosting (each insight post)
- [x] Schema: ProfessionalService (work-with-me)

---

## On-Page (Content)

- [ ] One primary keyword per post
- [ ] Meta description from excerpt (≤155 chars)
- [ ] H1 = page title (one per page)
- [ ] H2/H3 for structure
- [ ] Internal links to pillar + related posts
- [ ] Links to other projects, communities, Pirate Skills
- [ ] Single author (no author bio block on every post — it's just Logan)

---

## Ongoing

- [ ] Internal linking as new posts are published
- [ ] Keyword doc updated when adding clusters
- [ ] Content map updated when adding posts
