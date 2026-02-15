import type { ReactNode } from 'react';

export const metadata = {
  title: 'About',
  description:
    'Get to know Logan D. Williams – your coach for financial questions in Germany. Holistic advice, real savings.',
};

export default function AboutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
