import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type FinanzTopic = 'retirement' | 'finances';

const LEGACY_TOPIC_MAP: Record<string, FinanzTopic> = {
  'life-in-germany': 'retirement',
  'personal-finance': 'finances',
  vorsorge: 'retirement',
  finanzen: 'finances',
  provision: 'retirement',
  retirement: 'retirement',
  finances: 'finances',
};

export interface FinanzPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  topic: FinanzTopic;
  /** When set, post is canonical: show excerpt only and link to this source URL; set HTML canonical to this URL. */
  canonicalSource?: string;
  /** When true, post is excluded from hub, category lists, and sitemap in production; still viewable by URL. */
  draft?: boolean;
}

export interface FinanzPost extends FinanzPostMeta {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

function normalizeTopic(raw: string | undefined): FinanzTopic {
  const key = (raw ?? '').toLowerCase();
  return LEGACY_TOPIC_MAP[key] ?? 'retirement';
}

const NON_POST_SLUGS = ['CANONICAL-BACKLOG'];

export function getAllFinanzSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((slug) => !NON_POST_SLUGS.includes(slug));
}

export function getFinanzPostBySlug(slug: string): FinanzPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const topic = normalizeTopic(data.topic);
  const canonicalSource =
    typeof data.canonicalSource === 'string' && data.canonicalSource.trim()
      ? data.canonicalSource.trim()
      : undefined;
  const draft = data.draft === true;
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    topic,
    canonicalSource,
    draft,
    content,
  };
}

/**
 * Returns all posts. In production, excludes draft posts unless includeDrafts is true.
 * Use includeDrafts: true in generateStaticParams so draft post URLs are still built and viewable.
 */
export function getAllFinanzPosts(includeDrafts = false): FinanzPost[] {
  const slugs = getAllFinanzSlugs();
  const posts = slugs
    .map((s) => getFinanzPostBySlug(s))
    .filter((p): p is FinanzPost => p !== null)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
  if (process.env.NODE_ENV === 'production' && !includeDrafts) {
    return posts.filter((p) => !p.draft);
  }
  return posts;
}

export function getFinanzPostsByTopic(
  topic: FinanzTopic,
  includeDrafts = false
): FinanzPost[] {
  return getAllFinanzPosts(includeDrafts).filter((p) => p.topic === topic);
}

export function getFinanzPostBySlugAndTopic(
  slug: string,
  topic: FinanzTopic
): FinanzPost | null {
  const post = getFinanzPostBySlug(slug);
  if (!post || post.topic !== topic) return null;
  return post;
}
