import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hey, I&apos;m Logan
        </h1>
        <p className="text-lg text-muted-foreground">
          I work with expats on financial planning and write about life in
          Germany. Based in Cologne.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          I focus on clarity—health insurance, pensions, and how the German
          system works. Insights on life in Germany and personal finance live
          here. Work with me when you&apos;re ready.
        </p>
      </section>

      <section className="mt-14 flex flex-col gap-4">
        <Link
          href="/work-with-me"
          className="group flex w-full items-center justify-between gap-4 rounded-lg border-2 border-primary bg-primary/10 px-6 py-4 text-left transition-colors hover:bg-primary/20 hover:border-primary"
        >
          <span className="font-semibold text-foreground">
            Work With Me
          </span>
          <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/insights"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent hover:text-foreground"
          >
            Insights
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/insights/life-in-germany"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent hover:text-foreground"
          >
            Life in Germany
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/insights/personal-finance"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent hover:text-foreground"
          >
            Personal Finance
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
