'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

import { getQueryClient } from '@/app/get-query-client';
import RootLayout from '@/components/layouts/GlobalLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { TenantProvider } from '@/contexts/TenantContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <TenantProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TaskProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </TaskProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TenantProvider>
  );
}
