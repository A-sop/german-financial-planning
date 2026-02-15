import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Request appointment | German Financial Planning',
  description:
    'Choose how you’d like to meet: online via Teams, at your home in NRW/RP, or at the office in Cologne.',
};

export default function BookLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
