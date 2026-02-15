'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/locale-provider';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteFooter() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/legal"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('footerImprint')}
          </Link>
          <Link
            href="/legal#datenschutz"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('footerPrivacy')}
          </Link>
          <a
            href="mailto:Logan.Williams@allfinanz.ag?subject=Anfrage zur Vermögensberatung"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('footerContact')}
          </a>
        </div>
      </div>
      <div className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="shrink-0 break-words">
              {t('footerCopyright', { year: String(currentYear) })}
            </p>
            <div className="shrink-0 sm:ml-auto">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
