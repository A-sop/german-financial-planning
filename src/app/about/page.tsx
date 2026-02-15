'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/providers/locale-provider';

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('homeLearnTitle')}
      </h1>
      <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-muted-foreground">
        {t('homeLearnIntro')}
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <span className="text-3xl font-bold tabular-nums text-primary">41</span>
          <p className="mt-1 text-sm font-medium text-foreground">
            {t('homeLearnYears')}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <span className="text-3xl font-bold tabular-nums text-primary">965</span>
          <p className="mt-1 text-sm font-medium text-foreground">
            {t('homeLearnClients')}
          </p>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        {t('homeLearnCommitment')}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/book">{t('homeCtaBook')}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">{t('aboutBackToHome')}</Link>
        </Button>
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        <a
          href="https://www.allfinanz.ag/logan.williams/ueber-uns.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/90"
        >
          {t('aboutProfileAllfinanz')}
        </a>
      </p>
    </main>
  );
}
