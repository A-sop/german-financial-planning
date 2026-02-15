'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Home, Building2 } from 'lucide-react';
import { useLocale } from '@/components/providers/locale-provider';

const EMAIL = 'Logan.Williams@allfinanz.ag';

export default function BookPage() {
  const { t } = useLocale();

  const options = [
    {
      key: 'teams' as const,
      icon: Video,
      titleKey: 'bookOptionTeams' as const,
      descKey: 'bookOptionTeamsDesc' as const,
      subjectKey: 'bookSubjectTeams' as const,
    },
    {
      key: 'home' as const,
      icon: Home,
      titleKey: 'bookOptionHome' as const,
      descKey: 'bookOptionHomeDesc' as const,
      subjectKey: 'bookSubjectHome' as const,
    },
    {
      key: 'office' as const,
      icon: Building2,
      titleKey: 'bookOptionOffice' as const,
      descKey: 'bookOptionOfficeDesc' as const,
      subjectKey: 'bookSubjectOffice' as const,
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('bookTitle')}
      </h1>
      <p className="mt-3 text-muted-foreground">{t('bookIntro')}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-1">
        {options.map(({ icon: Icon, titleKey, descKey, subjectKey }) => (
          <Card key={titleKey} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon className="size-5 text-primary" aria-hidden />
                <CardTitle className="text-base leading-snug">{t(titleKey)}</CardTitle>
              </div>
              <CardDescription className="mt-1">{t(descKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" size="sm">
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(t(subjectKey))}`}
                  className="inline-flex items-center gap-2"
                >
                  {t('bookCtaRequest')}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/" className="text-primary underline underline-offset-2 hover:text-primary/90">
          ← {t('bookBackHome')}
        </Link>
      </p>
    </main>
  );
}
