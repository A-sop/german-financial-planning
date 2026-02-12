import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import { LocaleProvider } from '@/components/providers/locale-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { SiteFooter } from '@/components/site-footer';

const GTM_ID = 'GTM-M4BTJ5C';

export const metadata: Metadata = {
  title: "Logan Williams",
  description: "Personal site of Logan Williams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
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
          <header className="flex h-16 flex-wrap items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Link
              href="/"
              className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/90"
              aria-label="Logan Williams home"
            >
              Logan Williams
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/insights"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Insights
              </Link>
              <Link
                href="/work-with-me"
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Work With Me
              </Link>
              <div className="ml-2 border-l border-border pl-2">
                <LanguageToggle />
              </div>
            </nav>
          </header>
          <div className="flex min-h-[calc(100vh-4rem)] flex-col">
            {children}
            <SiteFooter />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
