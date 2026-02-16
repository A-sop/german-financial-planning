'use client';

import { useLocale } from '@/components/providers/locale-provider';

export function CanonicalPostTitle({
  title,
  titleEn,
  className,
}: {
  title: string;
  /** When set, EN view shows this instead of title. */
  titleEn?: string;
  className?: string;
}) {
  const { locale } = useLocale();
  const displayTitle = locale === 'en' && titleEn ? titleEn : title;
  return <h1 className={className}>{displayTitle}</h1>;
}
