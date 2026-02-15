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
import { Star, Phone, Mail, Calendar } from 'lucide-react';
import { useLocale } from '@/components/providers/locale-provider';

const PHONE = '+49 157 92373917';
const PHONE_LANDLINE = '+49 221 95491545';
const EMAIL = 'Logan.Williams@allfinanz.ag';
const OFFICE_ADDRESS = 'Hohenzollernring 52, 50672 Köln';

const TESTIMONIAL_NAMES = ['Emma N.', 'Wolfgang V.', 'Steven Marks', 'Kimberly Cuskelly'];

export default function Home() {
  const { t } = useLocale();

  const stepKeys = ['homeStep1', 'homeStep2', 'homeStep3', 'homeStep4', 'homeStep5'] as const;
  const valueKeys = [
    { title: 'homeValue1Title', desc: 'homeValue1Desc' },
    { title: 'homeValue2Title', desc: 'homeValue2Desc' },
    { title: 'homeValue3Title', desc: 'homeValue3Desc' },
  ] as const;
  const testimonialKeys = [
    { title: 'homeT1Title', quote: 'homeT1Quote' },
    { title: 'homeT2Title', quote: 'homeT2Quote' },
    { title: 'homeT3Title', quote: 'homeT3Quote' },
    { title: 'homeT4Title', quote: 'homeT4Quote' },
  ] as const;
  const faqKeys = [
    { q: 'homeFaq1Q', a: 'homeFaq1A' },
    { q: 'homeFaq2Q', a: 'homeFaq2A' },
    { q: 'homeFaq3Q', a: 'homeFaq3A' },
    { q: 'homeFaq4Q', a: 'homeFaq4A' },
    { q: 'homeFaq5Q', a: 'homeFaq5A' },
  ] as const;

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <p className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="flex gap-0.5 text-amber-600" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            {t('homeHeroStars')}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Logan D. Williams
          </h1>
          <p className="mt-1 text-lg font-medium text-primary">{t('homeHeroTagline')}</p>
          <p className="mt-4 max-w-xl break-words text-sm text-muted-foreground">
            {t('homeHeroIntro')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/book" className="inline-flex items-center gap-2">
                <Calendar className="size-4" />
                {t('homeCtaBook')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2">
                <Phone className="size-4" />
                {t('homeCtaCall')}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#kontakt" className="inline-flex items-center gap-2">
                <Mail className="size-4" />
                {t('homeCtaContact')}
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-sm">
            <Link
              href="/#faq"
              className="text-primary underline underline-offset-2 hover:text-primary/90"
            >
              {t('homeFaqLink')}
            </Link>
          </div>
        </div>
      </section>

      {/* Lernen Sie mich kennen */}
      <section
        id="lernen-sie-mich-kennen"
        className="scroll-mt-14 border-b border-border bg-background"
      >
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeLearnTitle')}
          </h2>
          <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-muted-foreground">
            {t('homeLearnIntro')}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="text-3xl font-bold tabular-nums text-primary">41</span>
              <p className="mt-1 text-sm font-medium text-foreground">{t('homeLearnYears')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="text-3xl font-bold tabular-nums text-primary">965</span>
              <p className="mt-1 text-sm font-medium text-foreground">{t('homeLearnClients')}</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t('homeLearnCommitment')}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/about">{t('homeLearnMore')}</Link>
          </Button>
        </div>
      </section>

      {/* 5 Schritte */}
      <section
        id="schritte"
        className="scroll-mt-14 border-b border-border bg-muted/30"
      >
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeStepsTitle')}
          </h2>
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
          <Button asChild variant="outline" className="mt-6">
            <Link href="/advice">{t('homeStepsMore')}</Link>
          </Button>
        </div>
      </section>

      {/* Ihre Vorteile */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeValueTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('homeValueSubtitle')}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {valueKeys.map(({ title, desc }) => (
              <Card key={title} className="flex min-w-0 flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug break-words">{t(title)}</CardTitle>
                </CardHeader>
                <CardContent className="min-w-0 flex-1 break-words text-sm text-muted-foreground">
                  {t(desc)}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild>
              <Link href="/#kontakt">{t('homeValueCta')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ein Leben – viele Möglichkeiten */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeLifeTitle')}
          </h2>
          <h3 className="mt-2 text-base font-medium text-foreground">
            {t('homeLifeSubtitle')}
          </h3>
          <p className="mt-4 max-w-2xl break-words text-sm leading-relaxed text-muted-foreground">
            {t('homeLifePara1')}
          </p>
          <p className="mt-3 break-words text-sm font-medium text-foreground">{t('homeLifePara2')}</p>
          <Button asChild className="mt-6">
            <Link href="/book">{t('homeLifeCta')}</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="bewertungen"
        className="scroll-mt-14 border-b border-border bg-background"
      >
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeTestimonialsTitle')}
          </h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {t('homeTestimonialsIntro')}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {testimonialKeys.map(({ title, quote }, i) => (
              <Card key={title} className="min-w-0">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    {TESTIMONIAL_NAMES[i]}
                  </CardDescription>
                  <CardTitle className="text-base leading-snug break-words">{t(title)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground break-words">&ldquo;{t(quote)}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <a
              href="https://www.allfinanz.ag/logan.williams/ueber-uns/alle-bewertungen.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/90"
            >
              {t('homeTestimonialsAll')}
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-14 border-b border-border bg-muted/30"
      >
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeFaqTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('homeFaqSubtitle')}</p>
          <dl className="mt-8 space-y-6">
            {faqKeys.map(({ q, a }) => (
              <div key={q} className="min-w-0 rounded-xl border border-border bg-card p-6">
                <dt className="text-sm font-medium text-foreground break-words">{t(q)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
                  {t(a)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Contact */}
      <section
        id="kontakt"
        className="scroll-mt-14 border-b border-border bg-background"
      >
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {t('homeContactTitle')}
          </h2>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">Logan D. Williams</p>
              <p className="text-muted-foreground">{OFFICE_ADDRESS}</p>
              <p className="pt-2">
                <a
                  href={`tel:${PHONE_LANDLINE.replace(/\s/g, '')}`}
                  className="text-primary hover:underline"
                >
                  {t('homeContactPhone')} {PHONE_LANDLINE}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${PHONE.replace(/\s/g, '')}`}
                  className="text-primary hover:underline"
                >
                  {t('homeContactMobile')} {PHONE}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${EMAIL}?subject=Anfrage zur Vermögensberatung`}
                  className="text-primary hover:underline"
                >
                  {t('homeContactEmail')} {EMAIL}
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/book" className="inline-flex items-center gap-2">
                  <Calendar className="size-4" />
                  {t('homeContactBook')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2">
                  <Phone className="size-4" />
                  {t('homeCtaCall')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
