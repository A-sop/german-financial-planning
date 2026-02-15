import Link from 'next/link';

const DVAG_KARRIERE_URL = 'https://www.dvag-karriere.de/Logan.Williams';

export const metadata = {
  title: 'Career | German Financial Planning',
  description:
    'Interested in a career as a financial adviser? Learn about opportunities with German Financial Planning and Deutsche Vermögensberatung (DVAG).',
};

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Career</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Interested in a career as a financial adviser?
      </p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground">
        <p>
          We work with Deutsche Vermögensberatung (DVAG). If you&apos;d like to
          find out more about becoming a financial coach and the opportunities
          available, you can explore the DVAG career site.
        </p>
        <p>
          <a
            href={DVAG_KARRIERE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/90"
          >
            DVAG Karriere (career site, in German)
          </a>
        </p>
        <p>
          For German-speaking visitors, the main career page with application
          options is linked above. If you have questions in English, feel free to
          get in touch via the contact options on the homepage.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/90"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
