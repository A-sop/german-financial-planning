'use client';

import Link from 'next/link';
import { useLocale } from '@/components/providers/locale-provider';

export function BackLinkFinanztipps({ href = '/financial-tips' }: { href?: string }) {
  const { t } = useLocale();
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {t('finanztippsBackHub')}
    </Link>
  );
}
