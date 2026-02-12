import type { Metadata } from 'next';

import { PricingTable, SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Pricing – Consulting & More Workspace',
  description:
    'Simple monthly pricing for the Consulting & More workspace. One operator and one assistant to keep German bureaucracy under control.',
};

type PricingPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const { reason } = await searchParams;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12">
      {reason === 'workspace' && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm text-foreground">
          Subscribe to CM Operator to access the workspace.
        </div>
      )}
      <section className="space-y-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Pricing for Consulting &amp; More operators
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
          One clear monthly price to keep assignments, documents, and deadlines under control. Designed
          for visually impaired or overloaded executives who coordinate German bureaucracy for their
          clients.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow">
        <SignedOut>
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">
              CM Operator starts at <span className="font-semibold text-foreground">€89 / month</span>{' '}
              for one operator and one assistant seat. Billing is handled securely by Clerk + Stripe.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <SignUpButton>
                <button
                  type="button"
                  className="rounded-full bg-[#6c47ff] px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                >
                  Get started
                </button>
              </SignUpButton>
              <p className="text-xs text-muted-foreground">
                No long-term commitment. You can change or cancel your plan later.
              </p>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Once signed in, Clerk renders the current public plans from your Clerk Billing configuration. */}
          <PricingTable />
        </SignedIn>
      </section>

      <section className="grid gap-8 md:grid-cols-2 text-sm text-muted-foreground">
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">What&apos;s included in CM Operator</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Workspace for one operator plus one assistant seat</li>
            <li>Assignments and tasks for each client or household</li>
            <li>Document intake and linking to obligations and partners</li>
            <li>Basic workflows for recurring obligations (payroll, taxes, renewals)</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">How to change pricing later</h2>
          <p>
            Plans and prices are managed directly in the Clerk Billing dashboard. You can adjust the
            monthly price or add new plans there without changing this page. The PricingTable component
            will always reflect your current public plans.
          </p>
        </div>
      </section>
    </main>
  );
}

