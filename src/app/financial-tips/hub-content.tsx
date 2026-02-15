'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/locale-provider';
import type { FinanzPost } from '@/lib/finanztipps';
import { format } from 'date-fns';

export function FinancialTipsHubContent({ latest }: { latest: FinanzPost[] }) {
  const { t } = useLocale();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t('finanztippsHubTitle')}
      </h1>
      <p className="mt-2 text-muted-foreground">{t('finanztippsHubIntro')}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/financial-tips/retirement"
          className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          {t('finanztippsTopicVorsorge')}
        </Link>
        <Link
          href="/financial-tips/finances"
          className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          {t('finanztippsTopicFinanzen')}
        </Link>
      </div>

      <h2 className="mt-10 text-lg font-semibold">{t('finanztippsAlleAktuellen')}</h2>
      <div className="mt-4 space-y-4 text-left">
        {latest.length === 0 ? (
          <p className="text-muted-foreground">More coming soon.</p>
        ) : (
          latest.map((post) => (
            <Link
              key={post.slug}
              href={`/financial-tips/${post.topic}/${post.slug}`}
              className="block rounded-lg border border-border p-4 transition-colors hover:border-border/80 hover:bg-accent"
            >
              <span className="text-xs text-muted-foreground">
                {post.topic === 'retirement'
                  ? t('finanztippsTopicVorsorge')
                  : t('finanztippsTopicFinanzen')}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {post.date ? ` · ${format(new Date(post.date), 'MMM d, yyyy')}` : ''}
              </span>
              <h3 className="mt-1 font-semibold text-foreground">{post.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <span className="mt-2 inline-block text-sm text-primary hover:underline">
                {t('finanztippsWeiterlesen')} →
              </span>
            </Link>
          ))
        )}
      </div>

      <div className="mt-10 flex justify-center gap-4 text-sm">
        <Link href="/financial-tips/retirement" className="text-primary hover:underline">
          {t('finanztippsTopicVorsorge')}
        </Link>
        <Link href="/financial-tips/finances" className="text-primary hover:underline">
          {t('finanztippsTopicFinanzen')}
        </Link>
      </div>
    </main>
  );
}
