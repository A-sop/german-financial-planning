'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/providers/locale-provider';

const stepKeys = ['homeStep1', 'homeStep2', 'homeStep3', 'homeStep4', 'homeStep5'] as const;

export default function AdvicePage() {
  const { t } = useLocale();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('homeStepsTitle')}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('homeStepsSubtitle')}</p>
      <ol className="mt-8 space-y-6">
        {stepKeys.map((key, index) => (
          <li key={key} className="flex gap-4">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              aria-hidden
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-muted-foreground">
                {index + 1}. {t('homeStepLabel')}
              </span>
              <p className="mt-0.5 text-sm font-medium leading-snug text-foreground break-words">
                {t(key)}
              </p>
            </div>
          </li>
        ))}
      </ol>
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
          href="https://www.allfinanz.ag/logan.williams/warum-vermoegensberatung/finanzcoaching.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/90"
        >
          {t('adviceCoachingAllfinanz')}
        </a>
      </p>
    </main>
  );
}
