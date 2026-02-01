import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Workspace | Executive Concierge',
  description:
    'Assignments, tasks, and documents — Executive Concierge workspace for managing client assignments and workflows.',
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return children;
}
