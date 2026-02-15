import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
  getFinanzPostBySlugAndTopic,
  getFinanzPostsByTopic,
} from '@/lib/finanztipps';
import type { FinanzTopic } from '@/lib/finanztipps';
import { format } from 'date-fns';
import { BackLinkFinanztipps } from '@/components/back-link-finanztipps';
import { CanonicalPostBody } from '@/components/canonical-post-body';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.germanfinancialplanning.de';

export function generateStaticParams() {
  const posts = getFinanzPostsByTopic('retirement', true);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getFinanzPostBySlugAndTopic(slug, 'retirement');
  if (!post) return {};
  const meta: { title: string; description: string; openGraph: object; alternates?: { canonical: string } } = {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
  if (post.canonicalSource) meta.alternates = { canonical: post.canonicalSource };
  return meta;
}

function blogPostingSchema(
  post: { title: string; excerpt: string; date: string; slug: string; canonicalSource?: string },
  topic: FinanzTopic
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date || undefined,
    url: `${siteUrl}/financial-tips/${topic}/${post.slug}`,
    author: {
      '@type': 'Person',
      name: 'Logan D. Williams',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'German Financial Planning',
      url: siteUrl,
    },
  };
  if (post.canonicalSource) {
    schema.isBasedOn = { '@type': 'CreativeWork', url: post.canonicalSource };
  }
  return schema;
}

export default async function RetirementPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getFinanzPostBySlugAndTopic(slug, 'retirement');
  if (!post) notFound();

  const schema = blogPostingSchema(post, 'retirement');

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div>
        <BackLinkFinanztipps href="/financial-tips" />
      </div>
      <article className="mt-6">
        <span className="text-xs text-muted-foreground tabular-nums">
          {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : ''}
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {post.title}
        </h1>
        <div className="mt-6 text-left">
          {post.canonicalSource ? (
            <CanonicalPostBody excerpt={post.excerpt} content={post.content} canonicalSource={post.canonicalSource} />
          ) : (
            <div className="insight-content text-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
