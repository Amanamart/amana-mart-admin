'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ModuleProvider } from '@/context/ModuleContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ModuleProvider>
            {children}
          </ModuleProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
