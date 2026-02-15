'use client';

import ReactMarkdown from 'react-markdown';
import { useLocale } from '@/components/providers/locale-provider';

export function CanonicalPostBody({
  excerpt,
  content,
  canonicalSource,
}: {
  excerpt: string;
  content: string;
  canonicalSource: string;
}) {
  const { t, locale } = useLocale();
  const isEnglish = locale === 'en';

  if (isEnglish) {
    return (
      <div className="space-y-4">
        <p className="text-sm italic text-muted-foreground">
          {t('finanztippsFirstPublishedOn')}{' '}
          <a
            href={canonicalSource}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium not-italic text-primary underline underline-offset-2 hover:text-primary/90"
          >
            {t('finanztippsSourceLinkText')}
          </a>
          .
        </p>
        <div className="insight-content text-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">{excerpt}</p>
      <a
        href={canonicalSource}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex font-medium text-primary underline underline-offset-2 hover:text-primary/90"
      >
        {t('finanztippsReadAtSource')} →
      </a>
    </div>
  );
}
