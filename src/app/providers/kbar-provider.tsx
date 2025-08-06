'use client';

import { KBarProvider } from 'kbar';

export const KBar = ({ children }: { children: React.ReactNode }) => {
  return <KBarProvider>{children}</KBarProvider>;
};
