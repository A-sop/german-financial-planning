'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/locale-provider';
import type { FinanzPost, FinanzTopic } from '@/lib/finanztipps';
import { format } from 'date-fns';

export function CategoryContent({
  topic,
  posts,
}: {
  topic: FinanzTopic;
  posts: FinanzPost[];
}) {
  const { t } = useLocale();
  const topicLabel =
    topic === 'retirement' ? t('finanztippsTopicVorsorge') : t('finanztippsTopicFinanzen');

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        <Link href="/financial-tips" className="hover:text-foreground">
          {t('finanztippsBackHub')}
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{topicLabel}</h1>
      <p className="mt-2 text-muted-foreground">{t('finanztippsAllInCategory')}</p>

      <div className="mt-8 space-y-4 text-left">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">More coming soon.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/financial-tips/${topic}/${post.slug}`}
              className="block rounded-lg border border-border p-4 transition-colors hover:border-border/80 hover:bg-accent"
            >
              <span className="text-xs text-muted-foreground tabular-nums">
                {post.date ? format(new Date(post.date), 'MMM d, yyyy') : ''}
              </span>
              <h2 className="mt-1 font-semibold text-foreground">{post.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <span className="mt-2 inline-block text-sm text-primary hover:underline">
                {t('finanztippsWeiterlesen')} →
              </span>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
