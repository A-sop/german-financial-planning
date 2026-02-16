# Content rules

Guidelines for content on the German Financial Planning (GFP) site. For canonical (Allfinanz-sourced) Finanztipps, see also `.cursor/rules/canonical-content.mdc`.

---

## Financial tips (Finanztipps)

Content lives in **`content/insights/`** as Markdown files. One file = one post.

### Post types

1. **Canonical post** — Content sourced from the canonical Allfinanz site. On GFP we show only a short summary and link to the full article at source. Use when republishing or summarising an article that lives on Allfinanz.
2. **Own post** — Full article written for GFP. The full body is shown on the site.

### Frontmatter (all posts)

| Field   | Required | Description |
|--------|----------|-------------|
| `title` | Yes | Post title. |
| `date`  | Yes | Publication date, `YYYY-MM-DD`. |
| `excerpt` | Yes | Short summary (1–3 sentences). Shown in lists and, for canonical posts, as the only on-page text. |
| `topic` | Yes | Category: `life-in-germany` or `vorsorge` → Retirement; `personal-finance` or `finanzen` → Finances. |
| `draft` | No | When `true`, post is excluded from hub, category lists, and sitemap in **production**; still viewable by direct URL. In dev, drafts appear everywhere. Remove or set `false` when ready to publish. |

### Canonical posts only

| Field | Required | Description |
|-------|----------|-------------|
| `canonicalSource` | Yes | Full URL of the source article on Allfinanz (e.g. `https://www.allfinanz.ag/logan.williams/...`). |
| `titleEn` | No | English title; shown in the EN view when set. |
| `excerptEn` | No | English excerpt; used in EN view when set. |
| `contentEn` | No | **Full English translation of the article body.** When set, the EN view shows this instead of the default body. Use YAML multiline (`contentEn: \|`) for longer text. |

When `canonicalSource` is set:

- **German (DE):** Only the **excerpt** is shown, plus a prominent link **"Weiterlesen auf Allfinanz"** to the source. (Truncate on GFP.)
- **English (EN):** When `contentEn` is set, the **full English translation** is shown (with optional `titleEn` / `excerptEn`). Otherwise the default body is shown. An italic note at the top: *"This article was first published on [Allfinanz](url)."* is always shown for attribution.
- The page’s HTML canonical and schema point to the source URL so search engines treat the source as canonical.

### File name = URL slug

- File `welcome-post.md` → URL `/financial-tips/retirement/welcome-post` (if topic is retirement).
- Use lowercase, hyphens, no spaces. English slugs preferred for consistency.

### Example: canonical post

```yaml
---
title: Vorsorge und Absicherung – der erste Überblick
date: 2025-02-12
excerpt: Ein kurzer Überblick, warum Vorsorge und Absicherung wichtig sind. Den vollständigen Artikel finden Sie auf Allfinanz.
topic: life-in-germany
canonicalSource: https://www.allfinanz.ag/logan.williams/artikel/...
---
```

### Example: own post (full article)

```yaml
---
title: Your post title
date: 2025-03-01
excerpt: A short summary for lists and SEO.
topic: finanzen
---

Full markdown body here. This is shown on the site.
```

---

## Canonical (Allfinanz) rules summary

- **Truncate:** On GFP, show only a short summary for canonical content; do not republish the full article.
- **Link to source:** Always provide a clear link to the full article on the canonical site.
- **SEO:** Set the page canonical to the **source** URL, not the GFP URL.
- **Timeless only:** Use evergreen posts for Finanztipps. Put year-specific changes in a single "What's changing" article with "Last updated DD/MM/YYYY".
- **Drip-feed:** When catching up, publish at most one post per category per day.

Full details: `.cursor/rules/canonical-content.mdc`.

---

## Canonical post backlog (content tasks)

Content tasks for bringing posts over from the canonical (Allfinanz) live in **`content/insights/CANONICAL-BACKLOG.md`**. That file lists each canonical post to add: title, topic, source URL, suggested slug, and status.

**Workflow:** An agent can create draft posts from the backlog (add a new `.md` in `content/insights/` with `draft: true`, frontmatter, and minimal body), then a human completes the excerpt/body, reviews, and publishes by removing `draft: true`. The same backlog is available as **`content/insights/canonical-backlog.json`** for agents to parse when creating draft posts.
