'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useLocale } from '@/components/providers/locale-provider';

const CAREER_URL_DE = 'https://www.dvag-karriere.de/Logan.Williams';

export function SiteHeader() {
  const { t, locale } = useLocale();
  const careerHref = locale === 'de' ? CAREER_URL_DE : '/careers';
  const careerExternal = locale === 'de';

  return (
    <header className="sticky top-0 z-50 flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border bg-background px-4 py-3 sm:px-6">
      <Link
        href="/"
        className="shrink-0 text-base font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/90"
        aria-label="German Financial Planning"
      >
        German Financial Planning
      </Link>
      <nav
        className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2 sm:gap-x-2"
        role="navigation"
        aria-label="Main menu"
      >
        <Link
          href="/about"
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t('navAbout')}
        </Link>
        <Link
          href="/advice"
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t('navAdvice')}
        </Link>
        <Link
          href="/#bewertungen"
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t('navReviews')}
        </Link>
        {careerExternal ? (
          <a
            href={careerHref}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {t('navCareer')}
          </a>
        ) : (
          <Link
            href={careerHref}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {t('navCareer')}
          </Link>
        )}
        <Link
          href="/financial-tips"
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t('navFinanztipps')}
        </Link>
        <Link
          href="/book"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <MessageCircle className="size-4 shrink-0" aria-hidden />
          {t('navCta')}
        </Link>
      </nav>
    </header>
  );
}
