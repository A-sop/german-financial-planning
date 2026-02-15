import { redirect, notFound } from 'next/navigation';
import { getFinanzPostBySlug, getAllFinanzSlugs } from '@/lib/finanztipps';

/**
 * Legacy route: redirect /insights/[slug] to /financial-tips/[topic]/[slug].
 * Hub and category index redirects are in next.config.
 */
export function generateStaticParams() {
  const slugs = getAllFinanzSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LegacyInsightSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getFinanzPostBySlug(slug);
  if (!post) notFound();
  redirect(`/financial-tips/${post.topic}/${slug}`);
}
