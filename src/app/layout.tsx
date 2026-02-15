import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import { LocaleProvider } from '@/components/providers/locale-provider';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const GTM_ID = 'GTM-M4BTJ5C';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.germanfinancialplanning.de';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Logan D. Williams – Vermögensberater in Köln | German Financial Planning',
    template: '%s | German Financial Planning',
  },
  description:
    'Ihr Vermögensberater aus Köln. Finanzcoaching, Vorsorge und Vermögensaufbau – ganzheitlich und persönlich. Termin vereinbaren.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_GB'],
    siteName: 'German Financial Planning',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Logan D. Williams',
  url: siteUrl,
  jobTitle: 'Vermögensberater',
  worksFor: {
    '@type': 'Organization',
    name: 'German Financial Planning',
    url: siteUrl,
  },
  sameAs: [
    'https://www.instagram.com/logandwilliams/',
    'https://www.facebook.com/logandwilliams',
    'https://twitter.com/loganwilliams',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <LocaleProvider>
          <SiteHeader />
          <div className="flex min-h-[calc(100vh-4rem)] flex-col">
            {children}
            <SiteFooter />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
