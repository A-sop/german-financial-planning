import type { ReactNode } from 'react';

export const metadata = {
  title: 'Advice',
  description:
    'In 5 steps to your financial goals. Structured, transparent financial coaching for expats in Germany.',
};

export default function AdviceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
